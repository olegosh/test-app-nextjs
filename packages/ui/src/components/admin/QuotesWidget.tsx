import { cacheLife, cacheTag } from 'next/cache';
import { DUMMYJSON_QUOTES_URL } from '@product-portal/constants';

interface DummyQuote {
  id: number;
  quote: string;
  author: string;
}

interface QuotesResponse {
  quotes: DummyQuote[];
}

export async function QuotesWidget() {
  'use cache';
  cacheLife('days');
  cacheTag('admin-quotes');

  const res = await fetch(DUMMYJSON_QUOTES_URL);
  const data: QuotesResponse = await res.json();

  console.log(`[PPR] QuotesWidget fetched at ${new Date().toISOString()} — cache: days`);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Quotes</h2>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200">
          cache: days
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {data.quotes.map((q) => (
          <blockquote
            key={q.id}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <p className="text-sm text-gray-700 italic mb-2">&ldquo;{q.quote}&rdquo;</p>
            <footer className="text-xs text-gray-400">— {q.author}</footer>
          </blockquote>
        ))}
      </div>
    </div>
  );
}
