import API from "./api";

export const createPost = (data) => API.post("/posts", data);

export const getPosts = () => API.get("/posts");

export const deletePost = (id) => API.delete(`/posts/${id}`);