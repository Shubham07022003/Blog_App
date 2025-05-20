import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_ENDPOINTS from '../config/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [activeTab, setActiveTab] = useState('published');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, postsResponse] = await Promise.all([
          axios.get(API_ENDPOINTS.USERS.ME, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
          axios.get(API_ENDPOINTS.POSTS.MY_POSTS, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
        ]);

        setUser(userResponse.data);
        const publishedPosts = postsResponse.data.filter(post => !post.isDraft);
        const draftPosts = postsResponse.data.filter(post => post.isDraft);
        setPosts(publishedPosts);
        setDrafts(draftPosts);
      } catch (err) {
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(API_ENDPOINTS.POSTS.DELETE(postId), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPosts(posts.filter(post => post.id !== postId));
      setDrafts(drafts.filter(post => post.id !== postId));
    } catch (err) {
      setError('Error deleting post');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center text-red-600 py-8">
        {error || 'Error loading profile'}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center">
            <img
              className="h-16 w-16 rounded-full"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=128`}
              alt={user.name}
            />
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <div className="sm:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="published">Published Posts</option>
                <option value="drafts">Drafts</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <nav className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('published')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'published'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Published Posts
                </button>
                <button
                  onClick={() => setActiveTab('drafts')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'drafts'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Drafts
                </button>
              </nav>
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {(activeTab === 'published' ? posts : drafts).map((post) => (
                <div
                  key={post.id}
                  className="bg-white border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {post.title}
                    </h3>
                    <div className="flex space-x-4">
                      <Link
                        to={`/edit-post/${post.id}`}
                        className="text-primary-600 hover:text-primary-500"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-4 text-gray-600 line-clamp-2">
                    {post.content.replace(/<[^>]*>/g, '')}
                  </p>
                  {activeTab === 'published' && (
                    <Link
                      to={`/post/${post.id}`}
                      className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      Read more →
                    </Link>
                  )}
                </div>
              ))}

              {(activeTab === 'published' ? posts : drafts).length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900">
                    No {activeTab === 'published' ? 'published posts' : 'drafts'} yet
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {activeTab === 'published'
                      ? 'Start writing your first post!'
                      : 'Save your work as drafts to continue later'}
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/create-post"
                      className="btn btn-primary"
                    >
                      Create New Post
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 