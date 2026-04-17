import { Suspense } from 'react';
import type { Metadata } from 'next';
import { UsersTable, RecentPosts, QuotesWidget, LiveTodos } from '@product-portal/ui';

export const metadata: Metadata = {
  title: 'Admin Dashboard — ProjectA',
  robots: { index: false },
};

interface Props {
  params: Promise<{ market: string }>;
}

function Skeleton({ label }: { label: string }) {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6">
      <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
      <div className="space-y-3">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-4/6" />
      </div>
      <p className="text-xs text-gray-400 mt-4">Loading {label}...</p>
    </div>
  );
}

export default function AdminPage(_props: Props) {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Partial Pre-Rendering demo — static shell with streamed dynamic sections
        </p>
      </div>

      <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-xs font-medium text-indigo-800">
        <strong>PPR:</strong> The page shell rendered instantly (static). Each section below streams independently
        via <code className="bg-indigo-100 px-1 rounded">{'<Suspense>'}</code> with different cache strategies.
        Check the server console for fetch timestamps.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<Skeleton label="users" />}>
          <UsersTable />
        </Suspense>

        <Suspense fallback={<Skeleton label="posts" />}>
          <RecentPosts />
        </Suspense>

        <Suspense fallback={<Skeleton label="quotes" />}>
          <QuotesWidget />
        </Suspense>

        <Suspense fallback={<Skeleton label="todos" />}>
          <LiveTodos />
        </Suspense>
      </div>
    </main>
  );
}
