import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">About BlogApp</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Blog Creation</h3>
                  <p className="text-gray-600">
                    • Create and edit blogs with a rich text editor<br />
                    • Add tags to categorize your blogs<br />
                    • Auto-save functionality to prevent content loss<br />
                    • Save as draft or publish immediately
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Draft Management</h3>
                  <p className="text-gray-600">
                    • Save blogs as drafts to work on them later<br />
                    • Edit drafts anytime<br />
                    • Convert drafts to published blogs<br />
                    • Auto-save drafts every 2 seconds
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">User Features</h3>
                  <p className="text-gray-600">
                    • User authentication and profile management<br />
                    • View all your published blogs and drafts<br />
                    • Edit or delete your blogs<br />
                    • Comment on published blogs
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Creating a Blog</h3>
                  <p className="text-gray-600">
                    1. Click "Create Blog" in the navigation bar<br />
                    2. Enter your blog title and content<br />
                    3. Add tags to categorize your blog<br />
                    4. Choose to save as draft or publish immediately
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Managing Drafts</h3>
                  <p className="text-gray-600">
                    1. Access your drafts from your profile<br />
                    2. Edit drafts anytime<br />
                    3. Convert drafts to published blogs<br />
                    4. Delete drafts you no longer need
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Interacting with Blogs</h3>
                  <p className="text-gray-600">
                    1. Browse published blogs on the home page<br />
                    2. Filter blogs by tags<br />
                    3. Read full blog posts<br />
                    4. Leave comments on published blogs
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technical Details</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  • Built with React and Express.js<br />
                  • Uses JWT for secure authentication<br />
                  • Real-time auto-save functionality<br />
                  • Responsive design for all devices<br />
                  • Rich text editor for content creation
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 