import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <UserButton afterSignOutUrl="/sign-in" />
      <h1 className="head-text text-left">Shivani is back</h1>
    </>
  );
}

