'use client'
import { useEffect, useState } from "react";

export default function CallbackPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Parse the URL fragment (window.location.hash)
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1); // remove '#'
      const params = new URLSearchParams(hash);

      const token = params.get("access_token");

      if (token) {
        setAccessToken(token);

        // Optional: clear hash from URL to clean up
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
          <>
            <h1 className="text-2xl font-bold mb-4">Processing login...</h1>
            <p className="text-gray-600">
              This page will handle Twitch OAuth redirection
            </p>
          </>
      </div>
    </div>
  );
}
