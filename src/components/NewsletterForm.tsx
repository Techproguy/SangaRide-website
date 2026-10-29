"use client";

import { ArrowRight } from "lucide-react";
import { useId, useState, type FormEvent } from "react";

// No subscription backend exists yet: the form validates and explains, but stores nothing.
export function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ tone: "error" | "info"; text: string } | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ tone: "error", text: "Enter a valid email address." });
      return;
    }
    setMessage({ tone: "info", text: "Thanks! Newsletter sign-ups open soon." });
    setEmail("");
  }

  return (
    <form onSubmit={submit} noValidate className="w-full max-w-md">
      <label htmlFor={id} className="block text-base font-bold text-white">
        Get the latest from Sanga
      </label>
      <p className="mt-1 text-[0.8rem] text-white/60">Product updates, city expansions and more.</p>
      <div className="mt-4 flex flex-col gap-2 min-[400px]:flex-row">
        <input
          id={id}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          aria-invalid={message?.tone === "error"}
          className="h-11 min-w-0 flex-none rounded-full border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:border-brand-400 focus:outline-none min-[400px]:flex-1"
        />
        <button
          type="submit"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-500"
        >
          Subscribe <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <p aria-live="polite" className={`mt-2 text-xs ${message?.tone === "error" ? "text-red-300" : "text-brand-200"}`}>
        {message?.text}
      </p>
    </form>
  );
}
