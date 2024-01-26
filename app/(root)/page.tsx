import { fetchPosts } from "@/lib/actions/thread.action";

export default async function Home() {
  const result = await fetchPosts();
  return (
    <>
     
      <h1 className="head-text text-left">Shivani is back</h1>
    </>
  );
}

