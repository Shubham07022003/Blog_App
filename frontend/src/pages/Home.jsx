import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts');
        setPosts(response.data);
        
        // Extract unique tags from all posts
        const tags = [...new Set(response.data.flatMap(post => post.tags || []))];
        setAllTags(tags);
      } catch (err) {
        setError('Error fetching posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags && post.tags.includes(selectedTag))
    : posts;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Latest Blog Posts
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
      </div>

      {allTags.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedTag('')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedTag === ''
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedTag === tag
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="mt-12 space-y-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex-1 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}`}
                    alt={post.author.name}
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {post.author.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Link to={`/post/${post.id}`} className="block mt-4">
                <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600">
                  {post.title}
                </h3>
                <p className="mt-3 text-base text-gray-500 line-clamp-3">
                  {post.content.replace(/<[^>]*>/g, '')}
                </p>
              </Link>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {post.readingTime} min read
                  </span>
                </div>
                <Link
                  to={`/post/${post.id}`}
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  Read more →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No posts found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {selectedTag ? `No posts found with tag "${selectedTag}"` : 'Be the first to share your thoughts!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home; 