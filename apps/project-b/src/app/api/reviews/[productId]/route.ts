import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Mocked API: Simulates an unreleased product reviews endpoint.
 * Returns deterministic fake review data based on productId.
 * When the real backend is ready, replace this with a proxy to the actual API.
 */

const REVIEWER_NAMES = [
  'Alice Johnson', 'Bob Smith', 'Carol White', 'David Brown',
  'Emma Davis', 'Frank Wilson', 'Grace Lee', 'Henry Taylor',
];

const REVIEW_TEMPLATES = [
  'Great product! Exactly what I was looking for.',
  'Good quality for the price. Would recommend.',
  'Decent product, but shipping took a while.',
  'Exceeded my expectations. Very happy with the purchase.',
  'Not bad, but I expected better packaging.',
  'Absolutely love it! Will buy again.',
  'Solid product. Works as described.',
  'Pretty good overall, minor issues with the finish.',
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  const id = parseInt(productId, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  // Simulate network latency (200-500ms)
  const rand = seededRandom(id);
  await new Promise((resolve) => setTimeout(resolve, 200 + rand() * 300));

  const reviewCount = 2 + Math.floor(rand() * 4); // 2-5 reviews per product
  const reviews = Array.from({ length: reviewCount }, (_, i) => {
    const r = seededRandom(id * 100 + i);
    return {
      id: `review-${id}-${i}`,
      author: REVIEWER_NAMES[Math.floor(r() * REVIEWER_NAMES.length)]!,
      rating: 3 + Math.floor(r() * 3), // 3-5 stars
      comment: REVIEW_TEMPLATES[Math.floor(r() * REVIEW_TEMPLATES.length)]!,
      date: new Date(2025, Math.floor(r() * 12), 1 + Math.floor(r() * 28)).toISOString().split('T')[0],
      verified: r() > 0.3,
    };
  });

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  console.log(`[Mock API] GET /api/reviews/${productId} — ${reviews.length} reviews generated`);

  return NextResponse.json({
    productId: id,
    reviews,
    averageRating: Math.round(avgRating * 10) / 10,
    totalReviews: reviews.length,
    _mock: true,
    _note: 'This endpoint returns mocked data. Replace with real API when available.',
  });
}
