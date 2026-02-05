"use client";

import React, { Suspense, useState } from "react";
import { signIn, signUp } from "@/src/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginInner() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || '/';

  // Check if email exists when user is signing up
  const checkEmailExists = async (emailToCheck: string) => {
    if (!emailToCheck || activeTab !== "signup") {
      setEmailExists(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToCheck }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setEmailExists(data.exists);
      }
    } catch (err) {
      console.error('Error checking email:', err);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    checkEmailExists(newEmail);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (activeTab === "signup") {
        if (!name) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }

        console.log('[SignUp] Starting signup for email:', email);
        const res: any = await signUp.email({
          email,
          password,
          name,
        });

        console.log('[SignUp] Response:', res);

        // better-auth client may return a result object instead of throwing.
        if (res && (res.error || res.ok === false)) {
          let message = (res.error && (res.error.message || res.error)) || 'Registration failed';
          
          // Check for duplicate email error
          if (typeof message === 'string' && (
            message.includes('already exists') || 
            message.includes('duplicate') ||
            message.includes('email')
          )) {
            message = 'This email is already registered. Please sign in instead or use a different email.';
          }
          
          setError(typeof message === 'string' ? message : JSON.stringify(message));
          setLoading(false);
          return;
        }

        // Try to trigger a clean welcome email from the server.
        // We don't block signup on the email delivery, but we await here
        // to surface any immediate problems in the UI for debugging.
        try {
          await fetch('/api/email/welcome', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name }),
          });
        } catch (emailErr) {
          // log and continue — welcome email failure shouldn't block signup
          console.error('Welcome email failed', emailErr);
        }

        console.log('[SignUp] Success, redirecting to:', redirectTo);
        router.push(redirectTo);
      } else {
        console.log('[SignIn] Starting signin for email:', email);
        try {
          const res: any = await signIn.email({
            email,
            password,
          });

          console.log('[SignIn] Response:', res);

          if (res && (res.error || res.ok === false)) {
            let message = (res.error && (res.error.message || res.error)) || 'Authentication failed';
            
            // Check for rate limit error
            if (typeof message === 'string' && message.includes('Too many requests')) {
              message = 'Too many login attempts. Please wait a few minutes before trying again.';
            }
            
            console.log('[SignIn] Error:', message);
            setError(typeof message === 'string' ? message : JSON.stringify(message));
            setLoading(false);
            return;
          }

          // Success - push to redirect URL
          console.log('[SignIn] Success, redirecting to:', redirectTo);
          router.push(redirectTo);
        } catch (signInErr) {
          console.error('[SignIn] Exception:', signInErr);
          const errMsg = signInErr instanceof Error ? signInErr.message : "Authentication failed";
          if (errMsg.includes('429') || errMsg.includes('Too many')) {
            setError('Too many login attempts. Please wait a few minutes before trying again.');
          } else {
            setError(errMsg);
          }
          setLoading(false);
        }
      }
    } catch (err) {
      console.error('[Form] Submission error:', err);
      const errMsg = err instanceof Error ? err.message : "Authentication failed";
      if (errMsg.includes('429') || errMsg.includes('Too many')) {
        setError('Too many login attempts. Please wait a few minutes before trying again.');
      } else {
        setError(errMsg);
      }
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "github" | "google") => {
    setLoading(true);
    setError("");
    try {
      await signIn.social({
        provider,
        callbackURL: redirectTo,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Social sign-in failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] w-full overflow-hidden bg-background text-foreground">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative z-10 bg-background">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back</h1>
            <p className="text-muted-foreground text-gray-500 dark:text-gray-400">
              Enter your details to access your account
            </p>
          </div>

          {/* Tabs */}
          <div className="flex p-1 mb-8 bg-gray-100 dark:bg-secondary/50 rounded-xl">
            <button
              onClick={() => setActiveTab("signin")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === "signin"
                  ? "bg-white dark:bg-card text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === "signup"
                  ? "bg-white dark:bg-card text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 rounded-xl text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {activeTab === "signup" && (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="flex h-11 w-full rounded-xl border border-gray-200 dark:border-transparent bg-transparent dark:bg-secondary px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-gray-300"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                className="flex h-11 w-full rounded-xl border border-gray-200 dark:border-transparent bg-transparent dark:bg-secondary px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-gray-300"
                placeholder="name@example.com"
              />
              {activeTab === "signup" && emailExists && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  This email is already registered. Please sign in instead or use a different email.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                {activeTab === "signin" && (
                  <Link href="/forgot-password" className="text-xs font-medium text-primary hover:text-primary/80">
                    Forgot password?
                  </Link>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex h-11 w-full rounded-xl border border-gray-200 dark:border-transparent bg-transparent dark:bg-secondary px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-gray-300"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || (activeTab === "signup" && emailExists)}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-gray-300 bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 h-11 w-full shadow-md"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </div>
              ) : activeTab === "signup" ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-secondary" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleSocialSignIn("github")}
              disabled={loading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-gray-300 border border-gray-200 bg-transparent shadow-sm hover:bg-gray-100 hover:text-gray-900 dark:border-transparent dark:bg-secondary dark:hover:bg-secondary/80 dark:hover:text-gray-50 h-11 w-full gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignIn("google")}
              disabled={loading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-gray-300 border border-gray-200 bg-transparent shadow-sm hover:bg-gray-100 hover:text-gray-900 dark:border-transparent dark:bg-secondary dark:hover:bg-secondary/80 dark:hover:text-gray-50 h-11 w-full gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <circle cx="9" cy="9" r="1" fill="currentColor" />
                <circle cx="15" cy="9" r="1" fill="currentColor" />
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - 3D Visual */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden">
        {/* Background removed as requested */}
        
        {/* 3D Card Effect */}
        <div className="relative w-[400px] h-[500px] perspective-1000">
          <div className="w-full h-full relative preserve-3d animate-float">
            {/* Main Card */}
            <div className="absolute inset-0 bg-white/10 dark:bg-secondary/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-transparent p-6 flex flex-col gap-4 transform rotate-y-12 rotate-x-6 translate-z-10">
              <div className="h-8 w-32 bg-white/20 dark:bg-secondary/30 rounded-lg animate-pulse" />
              <div className="flex-1 bg-white/10 dark:bg-secondary/20 rounded-xl animate-pulse delay-75" />
              <div className="h-20 bg-white/10 dark:bg-secondary/20 rounded-xl animate-pulse delay-150" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -right-12 top-20 w-24 h-24 bg-gray-500/80 rounded-2xl shadow-xl transform translate-z-20 animate-float-slow opacity-90 flex items-center justify-center backdrop-blur-md">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="absolute -left-8 bottom-32 w-20 h-20 bg-gray-600/80 rounded-full shadow-xl transform translate-z-30 animate-float-slower opacity-90 flex items-center justify-center backdrop-blur-md">
               <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .translate-z-10 {
          transform: translateZ(10px);
        }
        .translate-z-20 {
          transform: translateZ(30px);
        }
        .translate-z-30 {
          transform: translateZ(50px);
        }
        .rotate-y-12 {
          transform: rotateY(-12deg) rotateX(5deg);
        }
        @keyframes float {
          0%, 100% { transform: rotateY(-12deg) rotateX(5deg) translateY(0px); }
          50% { transform: rotateY(-12deg) rotateX(5deg) translateY(-20px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateZ(30px) translateY(0px); }
          50% { transform: translateZ(30px) translateY(-15px); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translateZ(50px) translateY(0px); }
          50% { transform: translateZ(50px) translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );

}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-6rem)] items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}