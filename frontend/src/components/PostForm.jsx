import React, { useState } from "react";

const PostForm = ({ onSubmit }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({ content, image });

    setContent("");
    setImage(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow"
    >
      <textarea
        placeholder="Write your post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
      />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="text-sm"
      />

      <button
        type="submit"
        className="bg-black text-white py-2 rounded-lg hover:bg-gray-800"
      >
        Publish
      </button>
    </form>
  );
};

export default PostForm;