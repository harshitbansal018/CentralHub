import React from "react";

const PostCard = ({ post }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 w-full max-w-xl mx-auto">
      
      {/* Image */}
      {post.image_url && (
        <img
          src={`http://localhost:5000/uploads/${post.image_url}`}
          alt="post"
          className="w-full h-64 object-cover rounded-md mb-3"
        />
      )}

      {/* Caption */}
      <p className="text-gray-800 text-lg mb-2">
        {post.caption}
      </p>

      {/* Footer */}
      <div className="flex justify-between text-sm text-gray-500">
        <span>{post.platform}</span>
        <span>
          {new Date(post.created_at).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default PostCard;