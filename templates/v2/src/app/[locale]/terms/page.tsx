import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-16 sm:px-8 max-w-3xl prose dark:prose-invert">
        <h1>Terms of Service</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Agreement to Terms</h2>
        <p>
          These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and 
          Lumina ("we," "us" or "our"), concerning your access to and use of our website.
        </p>
        
        <h2>2. Intellectual Property Rights</h2>
        <p>
          Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, 
          website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, 
          service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
        </p>
        
        {/* Add more generic terms clauses as needed */}
      </main>
      <Footer />
    </div>
  );
}
