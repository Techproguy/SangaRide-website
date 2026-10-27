"use client";

import { ChevronRight, Search, SearchX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { articlePath, helpAreas, helpContactPath, popularSearches, searchArticles } from "@/lib/help";

/** Searches published articles only; chips run the same search as typing and pressing Enter. */
export function HelpSearch() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const results = submitted ? searchArticles(submitted) : [];
  const run = (q: string) => setSubmitted(q.trim() || null);

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          run(query);
        }}
        className="mt-8 flex h-14 items-center gap-2 rounded-2xl border border-slate-200 bg-white pr-2 pl-4 shadow-card focus-within:border-brand-500"
      >
        <Search className="h-5 w-5 shrink-0 text-muted" />
        <label htmlFor="help-search" className="sr-only">
          Describe your issue
        </label>
        <input
          id="help-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your issue (e.g. refund, lost item, driver verification)..."
          className="h-full min-w-0 flex-1 bg-transparent text-[0.9rem] outline-none placeholder:text-muted/80"
        />
        <button type="submit" className="h-10 shrink-0 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700">
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[0.8rem] font-semibold">Popular searches:</span>
        {popularSearches.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setQuery(s);
              run(s);
            }}
            className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[0.78rem] font-medium transition hover:border-brand-500 hover:text-brand-600"
          >
            {s}
          </button>
        ))}
      </div>

      <div aria-live="polite">
        {submitted &&
          (results.length ? (
            <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-2 shadow-card">
              <p className="px-3 pt-2 pb-1 text-[0.75rem] text-muted">
                {results.length} {results.length === 1 ? "article" : "articles"} for &ldquo;{submitted}&rdquo;
              </p>
              <ul>
                {results.map((a) => (
                  <li key={a.slug}>
                    <Link href={articlePath(a.slug)} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-surface">
                      <span>
                        <span className="block text-[0.88rem] font-semibold">{a.title}</span>
                        <span className="block text-[0.78rem] text-muted">
                          {helpAreas.find((h) => h.id === a.area)?.title} · {a.summary}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-brand-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-6 flex gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
              <SearchX className="mt-0.5 h-5 w-5 shrink-0 text-muted" />
              <div>
                <p className="text-[0.88rem] font-semibold">No published articles match &ldquo;{submitted}&rdquo;.</p>
                <p className="mt-1 text-[0.8rem] text-muted">
                  Try different words, browse by support area below, or{" "}
                  <Link href={helpContactPath} className="font-semibold text-brand-600 hover:underline">
                    see contact options
                  </Link>
                  .
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
