import axios from "axios";

// Log the base URL to ensure it's correctly set
console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 50000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const setToken = (token) => {
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
};

const responseBody = (response) => response.data;

const requests = {
  get: (url, body) => {
    if (!url) {
      throw new Error("URL is required for GET request");
    }
    // Ensure the URL is complete with the base URL
    const fullUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`;
    console.log("GET request URL:", fullUrl); // Log the URL for debugging
    return instance.get(fullUrl, { params: body }).then(responseBody).catch(error => {
      console.error("GET request error:", error);
      throw error;
    });
  },
  post: (url, body, headers) => {
    if (!url) {
      throw new Error("URL is required for POST request");
    }
    // Ensure the URL is complete with the base URL
    const fullUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`;
    console.log("POST request URL:", fullUrl); // Log the URL for debugging
    return instance.post(fullUrl, body, headers).then(responseBody).catch(error => {
      console.error("POST request error:", error);
      throw error;
    });
  },
  put: (url, body) => {
    if (!url) {
      throw new Error("URL is required for PUT request");
    }
    // Ensure the URL is complete with the base URL
    const fullUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`;
    console.log("PUT request URL:", fullUrl); // Log the URL for debugging
    return instance.put(fullUrl, body).then(responseBody).catch(error => {
      console.error("PUT request error:", error);
      throw error;
    });
  },
};

export default requests;
