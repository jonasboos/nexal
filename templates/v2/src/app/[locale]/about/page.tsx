import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-16 sm:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-zinc-100">About Lumina</h1>
        
        <div className="space-y-6 text-lg text-zinc-600 dark:text-zinc-400">
          <p>
            At Lumina, we believe that technology should be an enabler, not a barrier. 
            Founded in 2024, our mission is to simplify the complex and illuminate the path forward for businesses navigating the digital landscape.
          </p>
          <p>
            We adhere to a philosophy of "minimalist excellence." We strip away the unnecessary to focus on what truly matters: 
            performance, security, and user experience.
          </p>
          
          <h2 className="text-2xl font-semibold mt-12 mb-4 text-zinc-900 dark:text-zinc-100">Our Values</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Clarity:</strong> We value clear communication and transparent code.</li>
            <li><strong>Quality:</strong> We do not compromise on the standards of our engineering.</li>
            <li><strong>Impact:</strong> We build software that makes a tangible difference.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
