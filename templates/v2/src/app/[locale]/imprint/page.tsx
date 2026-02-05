import { Footer } from "@/components/footer";

export default function ImprintPage() {
  return (
    <div className="flex flex-col min-h-screen">
       <main className="flex-1 container mx-auto px-4 py-16 sm:px-8 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-zinc-100">Imprint / Impressum</h1>
        
        <div className="space-y-6 text-zinc-600 dark:text-zinc-400">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Angaben gemäß § 5 TMG</h2>
            <p>Lumina Inc.</p>
            <p>123 Innovation Dr</p>
            <p>San Francisco, CA 94103</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Represented by / Vertreten durch:</h2>
            <p>John Doe, CEO</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Contact / Kontakt</h2>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Email: hello@lumina.inc</p>
          </div>
          
          <div className="pt-8 text-xs text-zinc-500">
             <p>Use this generated imprint as a placeholder. You must update this with your actual legal information.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
