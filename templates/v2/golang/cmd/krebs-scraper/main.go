package main

import (
	"flag"
	"fmt"
	"log"
	"mime"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/gocolly/colly/v2"
)

var (
	baseDir      = "scraped_data"
	targetDomain string
)

func main() {
	// Parse command line arguments
	urlFlag := flag.String("url", "", "The target URL to scrape (e.g., https://www.example.com)")
	flag.Parse()

	if *urlFlag == "" {
		fmt.Println("Please provide a URL using the -url flag")
		fmt.Println("Example: go run main.go -url https://www.krebs-belp.ch")
		os.Exit(1)
	}

	// Parse the URL to get the host
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

	// Update baseDir to include hostname to avoid mixing data
	baseDir = filepath.Join("scraped_data", targetDomain)

	fmt.Printf("Starting scraper for: %s\n", startURL)
	fmt.Printf("Saving data to: %s\n", baseDir)

	// Create the output directory
	if err := os.MkdirAll(baseDir, 0755); err != nil {
		fmt.Printf("Could not create output directory: %v\n", err)
		return
	}

	// Initialize the collector
	c := colly.NewCollector(
		colly.AllowedDomains(targetDomain, "www."+targetDomain),
		colly.Async(true), // Enable async for faster downloading
	)

	// Set valid granularity
	c.Limit(&colly.LimitRule{
		DomainGlob:  "*",
		Parallelism: 4,
		RandomDelay: 500 * time.Millisecond,
	})

	// REQUST HANDLER: Logging
	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting:", r.URL.String())
	})

	// ERROR HANDLER
	c.OnError(func(r *colly.Response, err error) {
		fmt.Printf("Error requesting %s: %v\n", r.Request.URL, err)
	})

	// HTML HANDLER: Find links, extract text, and queue resources
	c.OnHTML("html", func(e *colly.HTMLElement) {
		// 1. Visit all internal page links
		e.ForEach("a[href]", func(_ int, el *colly.HTMLElement) {
			link := el.Attr("href")
			u := e.Request.AbsoluteURL(link)
			if strings.Contains(u, targetDomain) {
				e.Request.Visit(u)
			}
		})

		// 2. Queue all images on the page
		e.ForEach("img[src]", func(_ int, el *colly.HTMLElement) {
			src := el.Attr("src")
			u := e.Request.AbsoluteURL(src)
			if strings.Contains(u, targetDomain) {
				e.Request.Visit(u)
			}
		})

		// 3. Queue linked images (potential full resolution)
		e.ForEach("a[href]", func(_ int, el *colly.HTMLElement) {
			href := el.Attr("href")
			lowerHref := strings.ToLower(href)
			if strings.HasSuffix(lowerHref, ".jpg") ||
				strings.HasSuffix(lowerHref, ".jpeg") ||
				strings.HasSuffix(lowerHref, ".png") ||
				strings.HasSuffix(lowerHref, ".gif") ||
				strings.HasSuffix(lowerHref, ".webp") ||
				strings.HasSuffix(lowerHref, ".svg") {

				u := e.Request.AbsoluteURL(href)
				if strings.Contains(u, targetDomain) {
					e.Request.Visit(u)
				}
			}
		})

		// 4. Queue other assets like CSS/JS
		e.ForEach("link[href]", func(_ int, el *colly.HTMLElement) {
			href := el.Attr("href")
			u := e.Request.AbsoluteURL(href)
			if strings.Contains(u, targetDomain) {
				e.Request.Visit(u)
			}
		})
		e.ForEach("script[src]", func(_ int, el *colly.HTMLElement) {
			src := el.Attr("src")
			u := e.Request.AbsoluteURL(src)
			if strings.Contains(u, targetDomain) {
				e.Request.Visit(u)
			}
		})

		// 5. EXTRACT TEXT CONTENT (Exclusive to HTML pages)
		// We remove scripts, styles, etc. to get only visible text.
		e.DOM.Find("script, style, noscript, link, head").Remove()
		text := e.DOM.Find("body").Text()

		// Clean up whitespace
		space := regexp.MustCompile(`\s+`)
		cleanText := space.ReplaceAllString(text, " ")
		cleanText = strings.TrimSpace(cleanText)

		// Save text file
		saveTextFile(e.Request.URL.Path, cleanText)
	})

	// RESPONSE HANDLER: Save NON-HTML resources (Images, CSS, JS, etc.)
	c.OnResponse(func(r *colly.Response) {
		contentType := r.Headers.Get("Content-Type")
		// If it's HTML, we ALREADY handled it in OnHTML (extracting text).
		// We do NOT want to save the raw HTML file.
		if strings.Contains(contentType, "text/html") {
			return
		}

		saveRawFile(r)
	})

	// Start scraping
	c.Visit(startURL)
	c.Wait()
}

// saveTextFile saves the extracted text content as a .txt file
func saveTextFile(urlPath string, content string) {
	if urlPath == "" || urlPath == "/" {
		urlPath = "/index"
	}

	// Clean path and ensure it allows for .txt extension
	cleanPath := filepath.Clean(urlPath)

	// If it has an extension like .html, replace it.
	// If it has no extension, append .txt
	ext := filepath.Ext(cleanPath)
	if ext != "" {
		cleanPath = strings.TrimSuffix(cleanPath, ext)
	}

	localPath := filepath.Join(baseDir, cleanPath+".txt")

	// Create directory
	dir := filepath.Dir(localPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		fmt.Printf("Error creating dir for text %s: %v\n", dir, err)
		return
	}

	if err := os.WriteFile(localPath, []byte(content), 0644); err != nil {
		fmt.Printf("Error writing text file %s: %v\n", localPath, err)
	}
}

// saveRawFile saves resources like images, css, js
func saveRawFile(r *colly.Response) {
	u := r.Request.URL
	p := u.Path

	if p == "" || p == "/" {
		// Should generally not happen here since we skip HTML which is usually root,
		// but safe fallback.
		p = "/index.unknown"
	}
	p = filepath.Clean(p)

	// Determine extension if missing
	ext := filepath.Ext(p)
	if ext == "" {
		contentType := r.Headers.Get("Content-Type")
		extensions, _ := mime.ExtensionsByType(contentType)
		if len(extensions) > 0 {
			p += extensions[0]
		}
	}

	localPath := filepath.Join(baseDir, p)

	dir := filepath.Dir(localPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		fmt.Printf("Error creating dir %s: %v\n", dir, err)
		return
	}

	if err := os.WriteFile(localPath, r.Body, 0644); err != nil {
		fmt.Printf("Error writing file %s: %v\n", localPath, err)
	}
}
