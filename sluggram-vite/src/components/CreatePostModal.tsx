import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../contexts/PostsContext';
import { saveVideo } from '../lib/videoStorage';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PostType = 'general' | 'event' | 'study' | 'reel';

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const { addPost } = usePosts();
  const navigate = useNavigate();
  const [postType, setPostType] = useState<PostType>('general');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Event fields
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  // Study group fields
  const [groupName, setGroupName] = useState('');
  const [course, setCourse] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [studyLocation, setStudyLocation] = useState('');
  const [maxMembers, setMaxMembers] = useState('10');

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size - limit to 100MB
      if (file.size > 100 * 1024 * 1024) {
        alert('Video file is too large. Please use a video under 100MB.');
        return;
      }
      // Store the file for later upload to IndexedDB
      setVideoFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
      // Clear any manually entered URL
      setVideoUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (postType === 'general') {
      addPost({
        type: 'general',
        content: caption,
        imageUrl: imageUrl || undefined,
      });
    } else if (postType === 'event') {
      addPost({
        type: 'event',
        content: caption,
        eventTitle,
        eventDate,
        eventTime,
        eventLocation,
      });
    } else if (postType === 'study') {
      addPost({
        type: 'study',
        content: caption,
        groupName,
        course,
        meetingTime,
        studyLocation,
        maxMembers: parseInt(maxMembers) || 10,
      });
    } else if (postType === 'reel') {
      setIsUploading(true);

      try {
        let finalVideoUrl = videoUrl || undefined;

        // If we have a video file, save it to IndexedDB
        if (videoFile) {
          const videoId = `video_${Date.now()}`;
          finalVideoUrl = await saveVideo(videoId, videoFile);
        }

        addPost({
          type: 'reel',
          content: caption,
          videoUrl: finalVideoUrl,
          imageUrl: imageUrl || undefined,
        });

        onClose();
        navigate('/reels');
        // Reset form and return early
        setPostType('general');
        setCaption('');
        setImageUrl('');
        setImagePreview(null);
        setVideoUrl('');
        setVideoPreview(null);
        setVideoFile(null);
        setIsUploading(false);
        return;
      } catch (error) {
        console.error('Failed to save video:', error);
        alert('Failed to save video. Please try again.');
        setIsUploading(false);
        return;
      }
    }

    onClose();
    // Reset form
    setCaption('');
    setImageUrl('');
    setImagePreview(null);
    setVideoUrl('');
    setVideoPreview(null);
    setVideoFile(null);
    setEventTitle('');
    setEventDate('');
    setEventTime('');
    setEventLocation('');
    setGroupName('');
    setCourse('');
    setMeetingTime('');
    setStudyLocation('');
    setMaxMembers('10');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Create New Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Post Type Selector */}
        <div className="p-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">What would you like to create?</label>
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setPostType('general')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                postType === 'general'
                  ? 'border-ucsc-blue bg-ucsc-blue/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl block mb-1">📸</span>
              <span className={`text-xs font-medium ${postType === 'general' ? 'text-ucsc-blue' : 'text-gray-600'}`}>
                Post
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPostType('reel')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                postType === 'reel'
                  ? 'border-ucsc-blue bg-ucsc-blue/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl block mb-1">🎬</span>
              <span className={`text-xs font-medium ${postType === 'reel' ? 'text-ucsc-blue' : 'text-gray-600'}`}>
                Reel
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPostType('event')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                postType === 'event'
                  ? 'border-ucsc-blue bg-ucsc-blue/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl block mb-1">📅</span>
              <span className={`text-xs font-medium ${postType === 'event' ? 'text-ucsc-blue' : 'text-gray-600'}`}>
                Event
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPostType('study')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                postType === 'study'
                  ? 'border-ucsc-blue bg-ucsc-blue/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl block mb-1">📚</span>
              <span className={`text-xs font-medium ${postType === 'study' ? 'text-ucsc-blue' : 'text-gray-600'}`}>
                Study
              </span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* General Post Fields */}
          {postType === 'general' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageUrl('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-ucsc-blue transition-colors cursor-pointer"
                  >
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <p className="text-sm text-gray-500">Click to upload a photo</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucsc-blue resize-none"
                />
              </div>
            </>
          )}

          {/* Event Fields */}
          {postType === 'event' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g., UCSC Career Fair"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucsc-blue"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucsc-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucsc-blue"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="e.g., East Field House"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucsc-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Tell people about your event..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucsc-blue resize-none"
                />
              </div>
            </>
          )}

          {/* Reel Fields */}
          {postType === 'reel' && (
            <>
              {/* Video upload for reel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Video (MP4)</label>
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoChange}
                  className="hidden"
                />
                {videoPreview ? (
                  <div className="relative">
                    <video
                      src={videoPreview}
                      className="w-full h-48 object-cover rounded-lg bg-black"
                      controls
                      playsInline
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setVideoPreview(null);
                        setVideoUrl('');
                        setVideoFile(null);
                        if (videoInputRef.current) videoInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-ucsc-blue transition-colors cursor-pointer"
                  >
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <p className="text-sm text-gray-500">Click to upload a video</p>
                    <p className="text-xs text-green-600 mt-1">Videos are saved locally and persist</p>
                  </div>
                )}
              </div>

              {/* Alternative: Image upload */}
              {!videoPreview && !videoFile && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Or upload an image</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageUrl('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-gray-300 transition-colors cursor-pointer"
                    >
                      <p className="text-sm text-gray-400">Click to upload an image instead</p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption to your reel..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucsc-blue resize-none"
                />
              </div>
            </>
          )}

          {/* Study Group Fields */}
          {postType === 'study' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name *</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g., CSE 101 Study Squad"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucsc-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g., CSE 101, CHEM 108A"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucsc-blue"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Time *</label>
                  <input
                    type="text"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    placeholder="e.g., Tuesdays 6 PM"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucsc-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Members</label>
                  <input
                    type="number"
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(e.target.value)}
                    min="2"
                    max="50"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucsc-blue"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  value={studyLocation}
                  onChange={(e) => setStudyLocation(e.target.value)}
                  placeholder="e.g., McHenry Library"
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucsc-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What will your study group focus on?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucsc-blue resize-none"
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-3 bg-ucsc-blue text-ucsc-gold font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Uploading...
              </span>
            ) : (
              <>
                {postType === 'general' && 'Share Post'}
                {postType === 'reel' && 'Share Reel'}
                {postType === 'event' && 'Create Event'}
                {postType === 'study' && 'Create Study Group'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
