import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Layout } from './Layout';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: number;
  unread: boolean;
  messages: Message[];
}

// Sample conversations
const sampleConversations: Conversation[] = [
  {
    id: '1',
    participantId: 'user1',
    participantName: 'Alex Chen',
    lastMessage: 'Hey! Are you going to the career fair tomorrow?',
    lastMessageTime: Date.now() - 1000 * 60 * 5,
    unread: true,
    messages: [
      { id: 'm1', senderId: 'user1', senderName: 'Alex Chen', text: 'Hey! Are you in CSE 101?', timestamp: Date.now() - 1000 * 60 * 60 },
      { id: 'm2', senderId: 'me', senderName: 'Me', text: 'Yes! Are you in Prof. Smith\'s section?', timestamp: Date.now() - 1000 * 60 * 30 },
      { id: 'm3', senderId: 'user1', senderName: 'Alex Chen', text: 'Hey! Are you going to the career fair tomorrow?', timestamp: Date.now() - 1000 * 60 * 5 },
    ],
  },
  {
    id: '2',
    participantId: 'user2',
    participantName: 'Maria Lopez',
    lastMessage: 'The study group is meeting at 6pm',
    lastMessageTime: Date.now() - 1000 * 60 * 60 * 2,
    unread: false,
    messages: [
      { id: 'm4', senderId: 'user2', senderName: 'Maria Lopez', text: 'Hi! Want to join our Orgo study group?', timestamp: Date.now() - 1000 * 60 * 60 * 24 },
      { id: 'm5', senderId: 'me', senderName: 'Me', text: 'Yes please! When do you meet?', timestamp: Date.now() - 1000 * 60 * 60 * 12 },
      { id: 'm6', senderId: 'user2', senderName: 'Maria Lopez', text: 'The study group is meeting at 6pm', timestamp: Date.now() - 1000 * 60 * 60 * 2 },
    ],
  },
  {
    id: '3',
    participantId: 'user3',
    participantName: 'Jordan Kim',
    lastMessage: 'Thanks for the notes! 🙏',
    lastMessageTime: Date.now() - 1000 * 60 * 60 * 24,
    unread: false,
    messages: [
      { id: 'm7', senderId: 'me', senderName: 'Me', text: 'Here are the lecture notes from Monday', timestamp: Date.now() - 1000 * 60 * 60 * 25 },
      { id: 'm8', senderId: 'user3', senderName: 'Jordan Kim', text: 'Thanks for the notes! 🙏', timestamp: Date.now() - 1000 * 60 * 60 * 24 },
    ],
  },
];

export function MessagesPage() {
  const { user } = useAuth0();
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 1000 * 60) return 'Just now';
    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}m`;
    if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))}h`;
    return `${Math.floor(diff / (1000 * 60 * 60 * 24))}d`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: 'me',
      senderName: user?.name || 'Me',
      text: newMessage,
      timestamp: Date.now(),
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: newMessage,
              lastMessageTime: Date.now(),
            }
          : conv
      )
    );

    setSelectedConversation(prev =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, message],
            lastMessage: newMessage,
            lastMessageTime: Date.now(),
          }
        : null
    );

    setNewMessage('');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
        <div className="flex h-full">
          {/* Conversations List */}
          <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Messages</h2>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ucsc-blue"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No conversations yet
                </div>
              ) : (
                filteredConversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversation(conv);
                      setConversations(prev =>
                        prev.map(c => (c.id === conv.id ? { ...c, unread: false } : c))
                      );
                    }}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${
                      selectedConversation?.id === conv.id ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-ucsc-gold to-ucsc-blue flex items-center justify-center text-white font-bold">
                      {conv.participantName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${conv.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                          {conv.participantName}
                        </span>
                        <span className="text-xs text-gray-400">{formatTime(conv.lastMessageTime)}</span>
                      </div>
                      <p className={`text-sm truncate ${conv.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unread && (
                      <div className="w-2 h-2 rounded-full bg-ucsc-blue" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-ucsc-gold to-ucsc-blue flex items-center justify-center text-white font-bold">
                    {selectedConversation.participantName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConversation.participantName}</h3>
                    <p className="text-xs text-gray-500">UCSC Student</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          message.senderId === 'me'
                            ? 'bg-ucsc-blue text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${message.senderId === 'me' ? 'text-ucsc-gold/70' : 'text-gray-400'}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-ucsc-blue"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="p-2 bg-ucsc-blue text-ucsc-gold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
