import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      // ✅ Get token
      const token = localStorage.getItem("token");

      // ❌ If not logged in → redirect
      if (!token) {
        window.location.href = "/";
        return;
      }

      const res = await fetch("http://localhost:5000/api/posts/all", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ FIXED
        },
      });

      // 🔥 Handle unauthorized
      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await res.json();

      setPosts(data);

    } catch (err) {
      console.error(err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">All Posts</h1>

      {/* 🔴 Error */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 🔄 Loading */}
      {loading ? (
        <p className="text-gray-500">Loading posts...</p>
      ) : (
        <div className="grid gap-4">
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center">No posts yet</p>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Post;