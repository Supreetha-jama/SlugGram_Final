import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PostsProvider } from './contexts/PostsContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { FeedPage } from './components/FeedPage';
import { CalendarPage } from './components/CalendarPage';
import { StudyGroupsPage } from './components/StudyGroupsPage';
import { ProfilePage } from './components/ProfilePage';
import { SearchPage } from './components/SearchPage';
import { MessagesPage } from './components/MessagesPage';
import { ReelsPage } from './components/ReelsPage';

function Feed() {
  return (
    <ProtectedRoute>
      <FeedPage />
    </ProtectedRoute>
  );
}

function Calendar() {
  return (
    <ProtectedRoute>
      <CalendarPage />
    </ProtectedRoute>
  );
}

function StudyGroups() {
  return (
    <ProtectedRoute>
      <StudyGroupsPage />
    </ProtectedRoute>
  );
}

function Profile() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}

function Search() {
  return (
    <ProtectedRoute>
      <SearchPage />
    </ProtectedRoute>
  );
}

function Messages() {
  return (
    <ProtectedRoute>
      <MessagesPage />
    </ProtectedRoute>
  );
}

function Reels() {
  return (
    <ProtectedRoute>
      <ReelsPage />
    </ProtectedRoute>
  );
}

function App() {
  return (
    <PostsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/study-groups" element={<StudyGroups />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </BrowserRouter>
    </PostsProvider>
  );
}

export default App;
