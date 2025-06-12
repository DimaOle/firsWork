import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8">
      <div className="space-x-2">
        <Link href="/login"><Button>Login</Button></Link>
        <Link href="/register"><Button>Registration</Button></Link>
      </div>
    </main>
  );
}