'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Animated3DObject from './Animated3DObject';

export default function Footer() {
  const pathname = usePathname();

  if (pathname === '/login') {
    return null;
  }

  return (
    <footer className="mt-auto w-full backdrop-blur-sm">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <Animated3DObject />
            <div className="text-sm text-muted-foreground/80 font-light tracking-wide">
              &copy; {new Date().getFullYear()} Nexal. All rights reserved.
            </div>
          </div>

          <div className="flex gap-8 text-sm font-medium">
            <Link href="/impressum" className="text-muted-foreground/60 hover:text-primary transition-colors duration-300">
              Impressum
            </Link>
            <Link href="/agb" className="text-muted-foreground/60 hover:text-primary transition-colors duration-300">
              AGB
            </Link>
            <Link href="/privacy" className="text-muted-foreground/60 hover:text-primary transition-colors duration-300">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
