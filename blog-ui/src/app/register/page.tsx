"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      alert("Password doesn't match");
    } else {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push("/posts");
      } else {
        alert("Login error");
      }
    }

  };

  return (
    <form onSubmit={handleLogin} className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Sign up</h2>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2"
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4"
      />
      <Input
        type="reapetPassword"
        placeholder="Repeate password"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
        className="mb-4"
      />
      <Button type="submit">sign up</Button>
    </form>
  );
}