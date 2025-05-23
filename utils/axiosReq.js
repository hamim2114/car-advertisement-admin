import axios from "axios";


const baseURL = window.location.hostname === 'localhost'
  ? "http://localhost:5000/"
  : "https://car-advertisement-server.vercel.app/";

const apiReq = axios.create({
  baseURL,
  withCredentials: true,
});

// Request Interceptor: Attach token dynamically
apiReq.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const publicRoutes = ["/login", "/forgot-password"];

// Response Interceptor: Handle errors globally
apiReq.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        localStorage.removeItem("access_token");

        // Get the current path
        const currentPath = window.location.pathname;

        // Only redirect if the user is on a protected route (not a public one)
        if (!publicRoutes.includes(currentPath)) {
          window.location.href = "/login";
        }
      }

      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error("No response received from server:", error.request);
    } else {
      console.error("Axios request error:", error.message);
    }
    return Promise.reject(error);
  }
);



export default apiReq;


// import axios from "axios";
// import { refreshToken } from "./auth"; // Import refresh logic

// const baseURL = "http://127.0.0.1:8000/";
// // const baseURL = "https://test-app-project.onrender.com/";

// // Create an Axios instance
// const apiReq = axios.create({
//   baseURL,
//   withCredentials: true, // Allow sending cookies if backend supports it
// });

// // Public routes that don't require authentication
// const publicRoutes = ["/login", "/register", "/forgot-password"];

// // Function to get tokens from localStorage
// const getAccessToken = () => localStorage.getItem("access_token");
// const getRefreshToken = () => localStorage.getItem("refresh_token");

// // 🔹 Request Interceptor: Attach Access Token to Requests
// apiReq.interceptors.request.use(
//   (config) => {
//     const token = getAccessToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // 🔹 Response Interceptor: Handle Expired Tokens
// apiReq.interceptors.response.use(
//   (response) => response, // Return response if no error
//   async (error) => {
//     if (!error.response) {
//       console.error("No response received from server:", error.request);
//       return Promise.reject(error);
//     }

//     const originalRequest = error.config;
//     const { status } = error.response;

//     // If token expired (401 Unauthorized) & not retrying already
//     if (status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // Prevent infinite loops

//       try {
//         // Refresh the access token
//         const newAccessToken = await refreshToken();
//         if (newAccessToken) {
//           // Update token and retry the failed request
//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//           return apiReq(originalRequest); // Retry request with new token
//         }
//       } catch (refreshError) {
//         console.error("Refresh token failed:", refreshError);
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("refresh_token");

//         // Redirect only if user is on a protected route
//         if (!publicRoutes.includes(window.location.pathname)) {
//           window.location.href = "/login";
//         }
//       }
//     }

//     return Promise.reject(error.response.data);
//   }
// );

// export default apiReq;















