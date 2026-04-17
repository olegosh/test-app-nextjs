import { cacheLife, cacheTag } from 'next/cache';
import { DUMMYJSON_POSTS_URL } from '@product-portal/constants';

interface DummyPost {
  id: number;
  title: string;
  body: string;
  reactions: { likes: number; dislikes: number };
  tags: string[];
}

interface PostsResponse {
  posts: DummyPost[];
}

export async function RecentPosts() {
  'use cache';
  cacheLife('hours');
  cacheTag('admin-posts');

  const res = await fetch(DUMMYJSON_POSTS_URL);
  const data: PostsResponse = await res.json();

  console.log(`[PPR] RecentPosts fetched at ${new Date().toISOString()} — cache: hours`);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
          cache: hours
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {data.posts.map((post) => (
          <div
            key={post.id}
            className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow"
          >
            <h3 className="font-medium text-gray-900 mb-1 text-sm">{post.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2 mb-2">{post.body}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>👍 {post.reactions.likes}</span>
              <span>👎 {post.reactions.dislikes}</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
