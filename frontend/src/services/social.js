import API from "./api";

// connect social accounts
export const connectInstagram = () => API.get("/social/instagram");
export const connectFacebook = () => API.get("/social/facebook");

// publish post
export const publishToSocial = (data) =>
  API.post("/social/publish", data);