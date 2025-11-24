"use client";

import { useSession, signOut } from "@/src/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useState } from "react";
import { cn } from "@/src/lib/utils";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <nav className="w-full max-w-5xl rounded-2xl transition-all duration-300 bg-card/80 backdrop-blur-md shadow-lg">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between h-14 items-center">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary transition-colors">
                Nexal
              </Link>
              <Link href="/subscribe" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                Pricing
              </Link>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              {isPending ? (
                <div className="animate-pulse flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ) : session ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    {/* User Avatar */}
                    <Link href="/profile" className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm hover:opacity-80 transition-opacity">
                      {session.user.name?.charAt(0).toUpperCase() || session.user.email.charAt(0).toUpperCase()}
                    </Link>
                    {/* User Info */}
                    <div className="hidden sm:block">
                      <Link href="/profile" className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:underline">
                        {session.user.name || "User"}
                      </Link>
                    </div>
                  </div>
                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                    title="Sign Out"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

