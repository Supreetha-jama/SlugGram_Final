import { useState } from 'react';
import { Layout } from './Layout';

interface StudyGroup {
  id: string;
  name: string;
  course: string;
  description: string;
  members: number;
  maxMembers: number;
  meetingTime: string;
  location: string;
  creator: string;
  tags: string[];
}

// Sample study groups
const sampleGroups: StudyGroup[] = [
  {
    id: '1',
    name: 'CSE 101 Study Squad',
    course: 'CSE 101',
    description: 'Weekly study sessions for Data Structures. We go over problem sets and exam prep.',
    members: 8,
    maxMembers: 12,
    meetingTime: 'Tuesdays & Thursdays, 6 PM',
    location: 'Science & Engineering Library',
    creator: 'Alex S.',
    tags: ['Computer Science', 'Algorithms'],
  },
  {
    id: '2',
    name: 'Organic Chem Warriors',
    course: 'CHEM 108A',
    description: 'Surviving orgo together! We share notes and practice mechanisms.',
    members: 15,
    maxMembers: 20,
    meetingTime: 'Mondays, 4 PM',
    location: 'Thimann Labs Study Room',
    creator: 'Maria L.',
    tags: ['Chemistry', 'Pre-Med'],
  },
  {
    id: '3',
    name: 'Econ 1 Discussion Group',
    course: 'ECON 1',
    description: 'Casual group to discuss macroeconomics concepts and prep for midterms.',
    members: 6,
    maxMembers: 10,
    meetingTime: 'Wednesdays, 3 PM',
    location: 'McHenry Library',
    creator: 'Jordan K.',
    tags: ['Economics', 'Social Sciences'],
  },
  {
    id: '4',
    name: 'Math 19A Calculus Crew',
    course: 'MATH 19A',
    description: 'Working through calculus problems together. All skill levels welcome!',
    members: 12,
    maxMembers: 15,
    meetingTime: 'Fridays, 2 PM',
    location: 'Baskin Engineering 101',
    creator: 'Sam T.',
    tags: ['Mathematics', 'STEM'],
  },
];

export function StudyGroupsPage() {
  const [groups] = useState<StudyGroup[]>(sampleGroups);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'available'>('all');

  const filteredGroups = groups.filter(group => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = filter === 'all' || group.members < group.maxMembers;

    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Study Groups</h1>
            <p className="text-gray-600">Find or create study groups with fellow Slugs</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
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
              placeholder="Search by course, name, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucsc-blue"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-ucsc-blue text-ucsc-gold'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Groups
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'available'
                  ? 'bg-ucsc-blue text-ucsc-gold'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Open Spots
            </button>
          </div>
        </div>

        {/* Groups Grid */}
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <span className="text-4xl mb-4 block">📚</span>
            <h3 className="text-lg font-semibold text-gray-900">No study groups found</h3>
            <p className="text-gray-500 mt-2">Try a different search or create your own group!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredGroups.map(group => (
              <div
                key={group.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:border-ucsc-blue/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 bg-ucsc-blue/10 text-ucsc-blue text-xs font-semibold rounded mb-2">
                      {group.course}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">{group.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${
                      group.members >= group.maxMembers ? 'text-red-500' : 'text-green-600'
                    }`}>
                      {group.members}/{group.maxMembers} members
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-gray-600 text-sm">{group.description}</p>

                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{group.meetingTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <span>{group.location}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {group.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Created by {group.creator}</span>
                  <button
                    disabled={group.members >= group.maxMembers}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      group.members >= group.maxMembers
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-ucsc-blue text-ucsc-gold hover:opacity-90'
                    }`}
                  >
                    {group.members >= group.maxMembers ? 'Full' : 'Join Group'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
