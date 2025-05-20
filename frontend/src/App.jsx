import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import About from './pages/About';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/create-post"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <CreatePost />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-post/:id"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <EditPost />
                </PrivateRoute>
              }
            />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
