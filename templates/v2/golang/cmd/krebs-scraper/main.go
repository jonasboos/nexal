package main

import (
	"crypto/md5"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/gocolly/colly/v2"
)

type PageData struct {
	URL      string   `json:"url"`
	Title    string   `json:"title"`
	MetaDesc string   `json:"meta_description"`
	H1       string   `json:"h1"`
	Headings []string `json:"headings"`
	Lists    []string `json:"lists"`
	Content  string   `json:"content"`
	Contact  string   `json:"contact_info"`
	Images   []string `json:"images"`
}

type ImageData struct {
	OriginalURL string   `json:"original_url"`
	LocalPath   string   `json:"local_path"`
	AltText     string   `json:"alt_text"`
	Title       string   `json:"title"`
	Pages       []string `json:"pages_found_on"`
	FileHash    string   `json:"file_hash"`
	FileSize    int64    `json:"file_size"`
}

type ScrapedData struct {
	Domain      string               `json:"domain"`
	Pages       map[string]PageData  `json:"pages"`
	Images      map[string]ImageData `json:"images"`
	AllHeadings []string             `json:"all_headings"`
	AllLists    [][]string           `json:"all_lists"`
	ContactInfo map[string]string    `json:"contact_info"`
}

var (
	baseDir      = "scraped_data"
	targetDomain string
	scrapedData  = ScrapedData{
		Pages:       make(map[string]PageData),
		Images:      make(map[string]ImageData),
		AllHeadings: []string{},
		AllLists:    [][]string{},
		ContactInfo: make(map[string]string),
	}
	imageIndex = make(map[string]bool) // Track unique images by URL
)

func main() {
	urlFlag := flag.String("url", "", "The target URL to scrape (e.g., https://www.example.com)")
	flag.Parse()

	if *urlFlag == "" {
		fmt.Println("Please provide a URL using the -url flag")
		fmt.Println("Example: go run cmd/krebs-scraper/main.go -url https://www.krebs-belp.ch")
		os.Exit(1)
	}

	// Parse the URL
	parsedURL, err := url.Parse(*urlFlag)
	if err != nil {
		log.Fatalf("Failed to parse URL: %v", err)
	}

	if parsedURL.Scheme == "" {
		parsedURL.Scheme = "https"
		parsedURL, _ = url.Parse(parsedURL.String())
	}

	targetDomain = parsedURL.Hostname()
	startURL := parsedURL.String()
	scrapedData.Domain = targetDomain

	// Setup output directory
	baseDir = filepath.Join("scraped_data", targetDomain)
	fmt.Printf("🔍 Starting scraper for: %s\n", startURL)
	fmt.Printf("📁 Saving data to: %s\n", baseDir)

	if err := os.MkdirAll(baseDir, 0755); err != nil {
		log.Fatalf("Could not create output directory: %v", err)
	}

	// Create the collector
	c := colly.NewCollector(
		colly.AllowedDomains(targetDomain, "www."+targetDomain),
		colly.Async(true),
	)

	c.Limit(&colly.LimitRule{
		DomainGlob:  "*",
		Parallelism: 2,
		RandomDelay: 500 * time.Millisecond,
	})

	pageCount := 0

	c.OnRequest(func(r *colly.Request) {
		fmt.Printf("  → Visiting: %s\n", r.URL.Path)
	})

	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		link := e.Attr("href")
		u := e.Request.AbsoluteURL(link)
		if strings.Contains(u, targetDomain) && !strings.Contains(link, "#") {
			c.Visit(u)
		}
	})

	c.OnHTML("img[src]", func(e *colly.HTMLElement) {
		src := e.Attr("src")
		u := e.Request.AbsoluteURL(src)
		if strings.Contains(u, targetDomain) {
			c.Visit(u)
		}
	})

	c.OnHTML("html", func(e *colly.HTMLElement) {
		pageCount++
		pageData := extractPageContent(e)
		scrapedData.Pages[e.Request.URL.String()] = pageData
	})

	c.OnError(func(_ *colly.Response, err error) {
		fmt.Printf("  ⚠ Error: %v\n", err)
	})

	c.Visit(startURL)
	c.Wait()

	fmt.Printf("\n✅ Scraped %d pages\n", pageCount)
	saveStructuredData()
}

// extractPageContent intelligently extracts content from a page
func extractPageContent(e *colly.HTMLElement) PageData {
	doc := e.DOM

	page := PageData{
		URL:      e.Request.URL.String(),
		Title:    strings.TrimSpace(doc.Find("title").Text()),
		MetaDesc: strings.TrimSpace(doc.Find("meta[name='description']").AttrOr("content", "")),
		H1:       strings.TrimSpace(doc.Find("h1").First().Text()),
		Headings: []string{},
		Lists:    []string{},
	}

	// Extract all headings
	doc.Find("h2, h3, h4, h5").Each(func(_ int, s *goquery.Selection) {
		text := strings.TrimSpace(s.Text())
		if text != "" {
			page.Headings = append(page.Headings, text)
			scrapedData.AllHeadings = append(scrapedData.AllHeadings, text)
		}
	})

	// Extract list items
	doc.Find("ul, ol").Each(func(_ int, s *goquery.Selection) {
		var listItems []string
		s.Find("li").Each(func(_ int, li *goquery.Selection) {
			text := strings.TrimSpace(li.Text())
			if text != "" && len(text) < 500 { // Skip very long items
				listItems = append(listItems, text)
			}
		})
		if len(listItems) > 0 {
			listStr := strings.Join(listItems, " | ")
			page.Lists = append(page.Lists, listStr)
			scrapedData.AllLists = append(scrapedData.AllLists, listItems)
		}
	})

	// Extract main content (paragraphs)
	var contentParts []string
	doc.Find("main, article, section, .content, [role='main']").Each(func(_ int, s *goquery.Selection) {
		s.Find("p").Each(func(_ int, p *goquery.Selection) {
			text := strings.TrimSpace(p.Text())
			if text != "" && len(text) > 20 {
				contentParts = append(contentParts, text)
			}
		})
	})

	// Fallback to body if no main content found
	if len(contentParts) == 0 {
		doc.Find("body p").Each(func(_ int, p *goquery.Selection) {
			text := strings.TrimSpace(p.Text())
			if text != "" && len(text) > 20 {
				contentParts = append(contentParts, text)
			}
		})
	}

	// Join content and clean up
	if len(contentParts) > 0 {
		page.Content = strings.Join(contentParts, "\n\n")
	}

	// Extract contact information
	contactInfo := extractContactInfo(e.DOM)
	if contactInfo != "" {
		page.Contact = contactInfo
		scrapedData.ContactInfo[page.URL] = contactInfo
	}

	// Collect images from page
	page.Images = collectImages(e.DOM, page.URL)

	return page
}

// extractContactInfo finds email, phone, address
func extractContactInfo(sel *goquery.Selection) string {
	var info []string

	// Email regex
	emailRegex := regexp.MustCompile(`[\w\.-]+@[\w\.-]+\.\w+`)
	sel.Find("*").Each(func(_ int, s *goquery.Selection) {
		text := s.Text()
		if emails := emailRegex.FindAllString(text, -1); len(emails) > 0 {
			for _, email := range emails {
				if !contains(info, email) {
					info = append(info, "Email: "+email)
				}
			}
		}
	})

	// Phone regex - look for tel links
	sel.Find("a[href^='tel:']").Each(func(_ int, s *goquery.Selection) {
		phone := strings.TrimSpace(s.Text())
		if phone != "" && !contains(info, phone) {
			info = append(info, "Phone: "+phone)
		}
	})

	// Address (look for common patterns)
	sel.Find("address, [itemtype*='PostalAddress']").Each(func(_ int, s *goquery.Selection) {
		text := strings.TrimSpace(s.Text())
		if text != "" && !contains(info, text) {
			info = append(info, "Address: "+text)
		}
	})

	return strings.Join(info, " | ")
}

// contains checks if string exists in slice
func contains(slice []string, item string) bool {
	for _, v := range slice {
		if strings.Contains(v, item) {
			return true
		}
	}
	return false
}

// collectImages extracts and registers images from a page
func collectImages(doc *goquery.Selection, pageURL string) []string {
	var images []string

	doc.Find("img[src]").Each(func(_ int, s *goquery.Selection) {
		src := s.AttrOr("src", "")
		if src != "" {
			alt := s.AttrOr("alt", "")
			title := s.AttrOr("title", "")

			// Make absolute URL
			imgURL := src
			if !strings.HasPrefix(src, "http") {
				baseURL := strings.Split(pageURL, "?")[0] // Remove query params
				base := strings.TrimSuffix(baseURL, "/")
				if !strings.HasPrefix(src, "/") {
					base = filepath.Dir(base)
				}
				imgURL = base + "/" + strings.TrimPrefix(src, "/")
			}

			images = append(images, imgURL)

			// Register and download image
			if _, exists := imageIndex[imgURL]; !exists {
				imageIndex[imgURL] = true

				// Download immediately
				imgData := downloadImageDirect(imgURL)
				imgData.AltText = alt
				imgData.Title = title
				imgData.Pages = []string{pageURL}
				scrapedData.Images[imgURL] = imgData
			} else {
				// Add to existing page list
				if img, ok := scrapedData.Images[imgURL]; ok {
					img.Pages = append(img.Pages, pageURL)
					scrapedData.Images[imgURL] = img
				}
			}
		}
	})

	return images
}

// downloadImageDirect downloads an image using HTTP client
func downloadImageDirect(imgURL string) ImageData {
	imgData := ImageData{
		OriginalURL: imgURL,
	}

	// Create images directory
	imagesDir := filepath.Join(baseDir, "images")
	if err := os.MkdirAll(imagesDir, 0755); err != nil {
		log.Printf("Error creating images directory: %v", err)
		return imgData
	}

	// Download with timeout
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get(imgURL)
	if err != nil {
		log.Printf("Error downloading %s: %v", imgURL, err)
		return imgData
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Printf("Failed to download %s: status %d", imgURL, resp.StatusCode)
		return imgData
	}

	// Read body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading image body: %v", err)
		return imgData
	}

	// Generate filename from hash
	hash := getImageHash(body)
	ext := getImageExtension(resp.Header.Get("Content-Type"))
	filename := hash + ext
	localPath := filepath.Join(imagesDir, filename)

	// Save image
	if err := os.WriteFile(localPath, body, 0644); err != nil {
		log.Printf("Error saving image %s: %v", imgURL, err)
		return imgData
	}

	imgData.LocalPath = "images/" + filename
	imgData.FileHash = hash
	imgData.FileSize = int64(len(body))

	fmt.Printf("  📸 Downloaded: %s (%s) from %s\n", filename, formatFileSize(int64(len(body))), imgURL)
	return imgData
}

// getImageHash creates MD5 hash of image content
func getImageHash(data []byte) string {
	hash := md5.Sum(data)
	return fmt.Sprintf("%x", hash)
}

// getImageExtension returns file extension based on content type
func getImageExtension(contentType string) string {
	switch {
	case strings.Contains(contentType, "jpeg"):
		return ".jpg"
	case strings.Contains(contentType, "png"):
		return ".png"
	case strings.Contains(contentType, "gif"):
		return ".gif"
	case strings.Contains(contentType, "webp"):
		return ".webp"
	case strings.Contains(contentType, "svg"):
		return ".svg"
	default:
		return ".jpg"
	}
}

// formatFileSize converts bytes to human readable format
func formatFileSize(bytes int64) string {
	const unit = 1024
	if bytes < unit {
		return fmt.Sprintf("%d B", bytes)
	}
	div, exp := int64(unit), 0
	for n := bytes / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %cB", float64(bytes)/float64(div), "KMGTPE"[exp])
}

// saveStructuredData saves all data in well-organized JSON files
func saveStructuredData() {
	// Create subdirectories
	pagesDir := filepath.Join(baseDir, "pages")
	if err := os.MkdirAll(pagesDir, 0755); err != nil {
		log.Printf("Error creating pages directory: %v", err)
	}

	// Save individual page data
	fmt.Println("\n📄 Saving page data...")
	for url, page := range scrapedData.Pages {
		// Create filename from URL
		filename := sanitizeFilename(url)
		filepath := filepath.Join(pagesDir, filename+".json")

		data, _ := json.MarshalIndent(page, "", "  ")
		if err := os.WriteFile(filepath, data, 0644); err != nil {
			log.Printf("Error writing page file: %v", err)
		}
		fmt.Printf("  ✓ %s\n", filename)
	}

	// Save aggregated data
	fmt.Println("\n📊 Saving aggregated data...")

	// All headings
	headingsFile := filepath.Join(baseDir, "headings.json")
	headingsData, _ := json.MarshalIndent(scrapedData.AllHeadings, "", "  ")
	os.WriteFile(headingsFile, headingsData, 0644)
	fmt.Printf("  ✓ headings.json (%d items)\n", len(scrapedData.AllHeadings))

	// All lists
	listsFile := filepath.Join(baseDir, "lists.json")
	listsData, _ := json.MarshalIndent(scrapedData.AllLists, "", "  ")
	os.WriteFile(listsFile, listsData, 0644)
	fmt.Printf("  ✓ lists.json (%d lists)\n", len(scrapedData.AllLists))

	// Images mapping
	if len(scrapedData.Images) > 0 {
		imagesFile := filepath.Join(baseDir, "images.json")
		imagesData, _ := json.MarshalIndent(scrapedData.Images, "", "  ")
		os.WriteFile(imagesFile, imagesData, 0644)
		fmt.Printf("  ✓ images.json (%d images)\n", len(scrapedData.Images))
	}

	// Contact info
	if len(scrapedData.ContactInfo) > 0 {
		contactFile := filepath.Join(baseDir, "contact.json")
		contactData, _ := json.MarshalIndent(scrapedData.ContactInfo, "", "  ")
		os.WriteFile(contactFile, contactData, 0644)
		fmt.Printf("  ✓ contact.json\n")
	}

	// Summary
	summaryFile := filepath.Join(baseDir, "summary.json")
	summary := map[string]interface{}{
		"domain":      scrapedData.Domain,
		"pages_count": len(scrapedData.Pages),
		"headings":    len(scrapedData.AllHeadings),
		"lists":       len(scrapedData.AllLists),
		"timestamp":   time.Now().Format(time.RFC3339),
	}
	summaryData, _ := json.MarshalIndent(summary, "", "  ")
	os.WriteFile(summaryFile, summaryData, 0644)
	fmt.Printf("  ✓ summary.json\n")

	fmt.Printf("\n✨ All data saved to: %s\n", baseDir)
}

// sanitizeFilename creates a safe filename from a URL
func sanitizeFilename(urlStr string) string {
	u, _ := url.Parse(urlStr)
	path := u.Path
	if path == "" || path == "/" {
		return "index"
	}
	path = strings.Trim(path, "/")
	path = strings.ReplaceAll(path, "/", "-")
	path = regexp.MustCompile(`[^\w\-]`).ReplaceAllString(path, "")
	if len(path) > 100 {
		path = path[:100]
	}
	return path
}
