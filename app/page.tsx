import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        <form className="flex flex-col items-center shadow-md p-10">
          <h1 className="font-semibold">Welcome back</h1>
          <p className="text-gray-300 mb-5">Please login to continue</p>
          <div className="flex flex-col mb-5 gap-1">
            <label htmlFor="email">Email</label>
            <input
              className="rounded border px-1"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex flex-col mb-5 gap-1">
            <label htmlFor="email">Password</label>
            <input
              className="rounded border px-1"
              placeholder="Enter your password"
            />
          </div>
          <Link href="/dashboard">
            <Button className="self-start bg-green-500 rounded px-4 py-2 text-white">
              {" "}
              Login
            </Button>
          </Link>
        </form>
      </div>
    </div>
  );
}
