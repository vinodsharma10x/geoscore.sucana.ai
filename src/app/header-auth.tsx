"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export function HeaderAuth() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  if (isSignedIn) {
    return (
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-8 w-8",
          },
        }}
      />
    );
  }

  return (
    <SignInButton mode="modal">
      <button className="rounded-full bg-purple-500 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-purple-600">
        Sign in
      </button>
    </SignInButton>
  );
}
