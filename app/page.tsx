import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Main() {
  return (
    <main className="w-full h-screen flex items-center justify-center">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </main>
  );
}
