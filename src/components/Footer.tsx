import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Nexal. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/impressum" className="text-muted-foreground hover:text-foreground transition-colors">
              Impressum
            </Link>
            <Link href="/agb" className="text-muted-foreground hover:text-foreground transition-colors">
              AGB
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
