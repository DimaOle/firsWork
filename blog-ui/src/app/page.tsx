
//import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  // useEffect(() => {
  //   // Пример запроса на backend
  //   fetch("http://localhost:3001/api/your-endpoint")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("Backend response:", data);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching data:", err);
  //     });
  // }, []);

  return (
    <main className="p-8">
      <div className="fixed top-4 right-4 flex space-x-2">
        <Link href="/login"><Button size="sm">Sign in</Button></Link>
        <Link href="/register"><Button size="sm">Sign up</Button></Link>
      </div>
    </main>
  );
}