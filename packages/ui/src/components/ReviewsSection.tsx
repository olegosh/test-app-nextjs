'use client';

import { useState, useEffect } from 'react';
import { useBrand } from '../context/BrandContext';

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface ReviewsData {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  _mock?: boolean;
}

interface ReviewsSectionProps {
  productId: number;
}

function Stars({ rating, color }: { rating: number; color: string }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill={i < rating ? color : '#e5e7eb'}
        >
          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.69l5.34-.78L10 1z" />
        </svg>
      ))}
    </span>
  );
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useBrand();

  useEffect(() => {
    let cancelled = false;

    async function fetchReviews() {
      setLoading(true);
      try {
        const res = await fetch(`/api/reviews/${productId}`);
        if (res.ok) {
          const json: ReviewsData = await res.json();
          if (!cancelled) setData(json);
        }
      } catch {
        // Silently fail — reviews are non-critical
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchReviews();
    return () => { cancelled = true; };
  }, [productId]);

  if (loading) {
    return (
      <div className="mt-8 animate-pulse">
        <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-20 bg-gray-100 rounded-xl" />
          <div className="h-20 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data || data.reviews.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Reviews</h2>
        <div className="flex items-center gap-1.5">
          <Stars rating={Math.round(data.averageRating)} color={theme.primaryColor} />
          <span className="text-sm text-gray-500">
            {data.averageRating} ({data.totalReviews})
          </span>
        </div>
        {data._mock && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
            mocked API
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {data.reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-semibold"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {review.author.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-900">{review.author}</span>
                {review.verified && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-50 text-green-600 border border-green-200">
                    Verified
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{review.date}</span>
            </div>
            <Stars rating={review.rating} color={theme.primaryColor} />
            <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
