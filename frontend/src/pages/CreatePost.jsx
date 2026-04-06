import React, { useState, useEffect } from "react";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Check auth + LinkedIn status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/";
          return;
        }

        const res = await fetch(
          "http://localhost:5000/api/linkedin/status",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/";
          return;
        }

        const data = await res.json();

        setLinkedinConnected(data.connected);

      } catch (err) {
        console.error(err);
      }
    };

    checkStatus();

    // ✅ Handle redirect message
    const params = new URLSearchParams(window.location.search);
    if (params.get("linkedin") === "connected") {
      setLinkedinConnected(true);
      setMessage("✅ LinkedIn connected successfully!");

      window.history.replaceState({}, document.title, "/post");
    }

  }, []);

  // ✅ Connect LinkedIn
  const connectLinkedIn = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    window.location.href =
      `http://localhost:5000/api/linkedin/login?token=${token}`;
  };

  // ✅ Handle Image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // 🔥 OPTIONAL VALIDATION
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image");
      return;
    }

    setImage(file);
  };

  // ✅ Publish Post
  const handlePublish = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/";
        return;
      }

      if (!content && !image) {
        alert("Add caption or image");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("caption", content);

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(
        "http://localhost:5000/api/linkedin/post-image",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }

      const data = await res.json();

      if (res.ok) {
        alert("Post published 🚀");
        setContent("");
        setImage(null);
      } else {
        alert(data.error || "Failed to post");
      }

    } catch (error) {
      console.error(error);
      alert("Error posting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-4">Create Post</h1>

        {/* Message */}
        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {message}
          </div>
        )}

        {/* Image Upload */}
        <div className="mb-4">
          <input type="file" onChange={handleImageChange} />
        </div>

        {/* Preview */}
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="w-full rounded-lg mb-4"
          />
        )}

        {/* Caption */}
        <textarea
          placeholder="Write a caption..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />

        {/* Platforms */}
        <div className="flex gap-4 mb-4 items-center">

          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Instagram
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Facebook
          </label>

          {/* LinkedIn */}
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={linkedinConnected} readOnly />
            <span>LinkedIn</span>

            {!linkedinConnected ? (
              <button
                onClick={connectLinkedIn}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Connect LinkedIn
              </button>
            ) : (
              <span className="text-green-600 font-semibold">
                Connected ✅
              </span>
            )}
          </div>
        </div>

        {/* Publish */}
        <button
          onClick={handlePublish}
          disabled={!linkedinConnected || loading}
          className="w-full bg-black text-white py-2 rounded-lg disabled:bg-gray-400"
        >
          {loading ? "Posting..." : "Publish"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;