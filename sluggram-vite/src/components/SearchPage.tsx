import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from './Layout';

// Placeholder trending tags
const trendingTags = [
  { tag: 'ucsc', posts: 1234 },
  { tag: 'bananaslugs', posts: 892 },
  { tag: 'redwoods', posts: 654 },
  { tag: 'santacruz', posts: 543 },
  { tag: 'porter', posts: 432 },
  { tag: 'campuslife', posts: 321 },
];

// Placeholder suggested accounts
const suggestedAccounts = [
  { name: 'sammy_slug', handle: 'Official UCSC Mascot', avatar: '🐌' },
  { name: 'ucsc_redwoods', handle: 'Campus Nature', avatar: '🌲' },
  { name: 'slug_eats', handle: 'Food Reviews', avatar: '🍕' },
  { name: 'bay_tree', handle: 'Campus Store', avatar: '🛒' },
];

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredTags = trendingTags.filter(t =>
    t.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAccounts = suggestedAccounts.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="px-4 py-4">
        {/* Search Input */}
        <div className="relative mb-6">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search SlugGram"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ucsc-blue"
          />
        </div>

        {/* Trending Tags */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Trending on Campus</h2>
          <div className="space-y-3">
            {filteredTags.map((item) => (
              <button
                key={item.tag}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-ucsc-blue/10 flex items-center justify-center">
                    <span className="text-ucsc-blue font-bold">#</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">#{item.tag}</p>
                    <p className="text-sm text-gray-500">{item.posts.toLocaleString()} posts</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Accounts */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Suggested for You</h2>
          <div className="space-y-3">
            {filteredAccounts.map((account) => (
              <div
                key={account.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-ucsc-gold to-ucsc-blue p-[2px]">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xl">
                      {account.avatar}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{account.name}</p>
                    <p className="text-sm text-gray-500">{account.handle}</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-ucsc-blue text-ucsc-gold text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
