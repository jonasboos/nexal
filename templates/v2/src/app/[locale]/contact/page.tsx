import { Footer } from "@/components/footer";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-16 sm:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-zinc-100">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Ready to start your next project? We'd love to hear from you.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                <Mail className="h-5 w-5" />
                <span>hello@lumina.inc</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                 <Phone className="h-5 w-5" />
                 <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                 <MapPin className="h-5 w-5" />
                 <span>123 Innovation Dr, San Francisco, CA</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
             <form className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Name</label>
                 <input type="text" className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                 <input type="email" className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Message</label>
                 <textarea rows={4} className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white" />
               </div>
               <button className="w-full rounded-md bg-zinc-900 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                 Send Message
               </button>
             </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
