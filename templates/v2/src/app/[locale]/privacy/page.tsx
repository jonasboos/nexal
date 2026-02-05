import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-16 sm:px-8 max-w-3xl prose dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>
          At Lumina ("we", "us", or "our"), we are committed to protecting your personal information and your right to privacy. 
          This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website.
        </p>
        
        <h2>1. Information We Collect</h2>
        <p>
          We may collect personal information that you voluntarily provide to us when you register on the website, 
          express an interest in obtaining information about us or our products and services, when you participate 
          in activities on the website or otherwise when you contact us.
        </p>
        
        <h2>2. How We Use Your Information</h2>
        <p>
          We use personal information collected via our website for a variety of business purposes described below. 
          We process your personal information for these purposes in reliance on our legitimate business interests, 
          in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
        </p>
        
        {/* Add more generic privacy clauses as needed */}
      </main>
      <Footer />
    </div>
  );
}
