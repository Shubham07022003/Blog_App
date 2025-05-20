import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isDraft, setIsDraft] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState(null);

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const savePost = useCallback(async (draft = true) => {
    if (!title.trim() || !content.trim()) return;

    try {
      setSaving(true);
      let response;
      
      if (currentDraftId && draft) {
        // Update existing draft
        response = await axios.put(`http://localhost:5000/api/posts/${currentDraftId}`, {
          title,
          content,
          tags,
          isDraft: draft,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } else {
        // Create new post
        response = await axios.post('http://localhost:5000/api/posts', {
          title,
          content,
          tags,
          isDraft: draft,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (draft) {
          setCurrentDraftId(response.data.id);
        }
      }
      
      // Only navigate to home if publishing
      if (!draft) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving post');
    } finally {
      setSaving(false);
    }
  }, [title, content, tags, navigate, currentDraftId]);

  useEffect(() => {
    if (isDraft && !isPublishing && title.trim() && content.trim()) {
      const timer = setTimeout(() => {
        savePost(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [title, content, isDraft, isPublishing, savePost]);

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content before publishing');
      return;
    }
    
    setIsPublishing(true);
    setIsDraft(false);
    try {
      setSaving(true);
      let response;
      
      if (currentDraftId) {
        // Update existing draft to published post
        response = await axios.put(`http://localhost:5000/api/posts/${currentDraftId}`, {
          title,
          content,
          tags,
          isDraft: false,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        // Clear the draft ID since it's now published
        setCurrentDraftId(null);
      } else {
        // Create new published post
        response = await axios.post('http://localhost:5000/api/posts', {
          title,
          content,
          tags,
          isDraft: false,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }
      
      // Navigate to home page after successful publish
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Error publishing post');
    } finally {
      setSaving(false);
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsDraft(true);
    setIsPublishing(false);
    try {
      setSaving(true);
      let response;
      
      if (currentDraftId) {
        // Update existing draft
        response = await axios.put(`http://localhost:5000/api/posts/${currentDraftId}`, {
          title,
          content,
          tags,
          isDraft: true,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } else {
        // Create new draft
        response = await axios.post('http://localhost:5000/api/posts', {
          title,
          content,
          tags,
          isDraft: true,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCurrentDraftId(response.data.id);
      }
      // Navigate to home page after saving draft
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving draft');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Blog</h3>
          
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

          <div className="mt-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                className="input"
                placeholder="Add tags (press Enter to add)"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {saving ? 'Saving...' : isDraft && !isPublishing ? 'Auto-saved' : ''}
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

export default CreatePost; 