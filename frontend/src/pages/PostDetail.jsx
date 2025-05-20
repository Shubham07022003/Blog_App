import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import API_ENDPOINTS from '../config/api';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCommented, setHasCommented] = useState(false);
  const [userId, setUserId] = useState(null);
  const [allPosts, setAllPosts] = useState([]);

  // Function to strip HTML tags
  const stripHtmlTags = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (token) {
      // Decode token to get user ID
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.id);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postResponse, commentsResponse, allPostsResponse] = await Promise.all([
          axios.get(API_ENDPOINTS.POSTS.DETAIL(id)),
          axios.get(API_ENDPOINTS.POSTS.COMMENTS(id)),
          axios.get(API_ENDPOINTS.POSTS.LIST)
        ]);
        setPost(postResponse.data);
        setComments(commentsResponse.data);
        setAllPosts(allPostsResponse.data);
        
        // Check if user has already commented
        if (userId) {
          const userComment = commentsResponse.data.find(comment => comment.authorId === userId);
          setHasCommented(!!userComment);
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || post.isDraft || hasCommented) return;

    try {
      const response = await axios.post(
        API_ENDPOINTS.POSTS.COMMENTS(id),
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setComments([...comments, response.data]);
      setNewComment('');
      setHasCommented(true);
    } catch (err) {
      setError('Error posting comment');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center text-red-600 py-8">
        {error || 'Post not found'}
      </div>
    );
  }

  return (
    <div className="flex gap-8 h-[calc(100vh-8rem)]">
      {/* Left side - All posts */}
      <div className="w-1/3 overflow-y-auto pr-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="space-y-6">
          {allPosts.map((otherPost) => (
            <Link
              key={otherPost.id}
              to={`/post/${otherPost.id}`}
              className={`block p-4 rounded-lg transition-colors ${
                otherPost.id === parseInt(id)
                  ? 'bg-primary-50 border-l-4 border-primary-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {otherPost.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {stripHtmlTags(otherPost.content)}
              </p>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>{otherPost.author.name}</span>
                <span className="mx-2">•</span>
                <span>{new Date(otherPost.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Right side - Current post detail */}
      <div className="w-2/3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <article className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center mb-6">
              <img
                className="h-12 w-12 rounded-full"
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}`}
                alt={post.author.name}
              />
              <div className="ml-4">
                <p className="text-lg font-medium text-gray-900">{post.author.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>

            {post.isDraft ? (
              <div className="text-center py-4 bg-gray-50 rounded-lg mb-8">
                <p className="text-gray-600">
                  Please appreciate me and share your suggestions
                </p>
              </div>
            ) : !isAuthenticated ? (
              <div className="text-center py-4 bg-gray-50 rounded-lg mb-8">
                <p className="text-gray-600">
                  Please{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-500">
                    sign in
                  </Link>{' '}
                  to leave a comment
                </p>
              </div>
            ) : hasCommented ? (
              <div className="text-center py-4 bg-gray-50 rounded-lg mb-8">
                <p className="text-gray-600">
                  Please appreciate me and share your suggestions
                </p>
              </div>
            ) : (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <ReactQuill
                  value={newComment}
                  onChange={setNewComment}
                  className="h-32 mb-12"
                  placeholder="Write a comment..."
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Post Comment
                </button>
              </form>
            )}

            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-4">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.name)}`}
                    alt={comment.author.name}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        {comment.author.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      {stripHtmlTags(comment.content)}
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="text-center text-gray-500">No comments yet</p>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostDetail; 