import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import API_ENDPOINTS from '../config/api';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isDraft, setIsDraft] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.POSTS.DETAIL(id), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTitle(response.data.title);
        setContent(response.data.content);
        setIsDraft(response.data.isDraft);
      } catch (err) {
        setError('Error fetching post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const savePost = useCallback(async (shouldNavigate = false) => {
    if (!title.trim() || !content.trim()) return;

    try {
      setSaving(true);
      const response = await axios.put(
        API_ENDPOINTS.POSTS.UPDATE(id),
        {
          title,
          content,
          isDraft,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      // Only navigate if explicitly requested
      if (shouldNavigate) {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving post');
    } finally {
      setSaving(false);
    }
  }, [title, content, isDraft, id, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title.trim() || content.trim()) {
        savePost(false); // Don't navigate on auto-save
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, content, savePost]);

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content before publishing');
      return;
    }
    
    try {
      setSaving(true);
      setIsDraft(false);
      
      // Update the post to published status
      const response = await axios.put(
        API_ENDPOINTS.POSTS.UPDATE(id),
        {
          title,
          content,
          isDraft: false,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      // Navigate to home page after successful publish
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Error publishing post');
      setIsDraft(true); // Revert to draft if publish fails
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsDraft(true);
    await savePost(true); // Navigate after manual save
  };

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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Post</h3>
          
          {error && (
            <div className="mt-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 input"
              placeholder="Enter post title"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <div className="mt-1">
              <ReactQuill
                value={content}
                onChange={setContent}
                className="h-64 mb-12"
                placeholder="Write your post content here..."
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {saving ? 'Saving...' : 'Auto-saved'}
            </div>
            <div className="space-x-4">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="btn btn-secondary"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="btn btn-primary"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost; 