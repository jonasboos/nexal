"use client";

import { useSession, signOut } from "@/src/lib/auth-client";

export default function UserSession() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="p-4 bg-card rounded-lg transition-colors">
        <p className="text-muted">Loading session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-4 bg-card border border-yellow-200 dark:border-yellow-700 rounded-lg transition-colors border-card">
        <p className="text-yellow-800 dark:text-yellow-200">Not authenticated</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card border border-card rounded-lg transition-colors">
      <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-3">
        Authenticated User
      </h3>
      <div className="space-y-2 text-sm">
        <p className="text-muted">
          <span className="font-medium">Name:</span> {session.user.name || "N/A"}
        </p>
        <p className="text-muted">
          <span className="font-medium">Email:</span> {session.user.email}
        </p>
        <p className="text-muted">
          <span className="font-medium">User ID:</span> {session.user.id}
        </p>
        <p className="text-muted">
          <span className="font-medium">Email Verified:</span>{" "}
          {session.user.emailVerified ? "Yes" : "No"}
        </p>
      </div>
      <button
        onClick={async () => {
          await signOut();
          window.location.reload();
        }}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
