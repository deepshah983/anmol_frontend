// api.js

import axios from 'axios';
import themeConfig from "../configs/themeConfig"

const instance = axios.create({
  baseURL: themeConfig.backendUrl, // Replace with your API base URL
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Get the token from localStorage
  },
});

// Add a response interceptor to handle errors globally
instance.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    // Handle errors
    if (error.response) {
        if(error.response.status == 401 && localStorage.getItem('accessToken') != null){
          reAuth();
        }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response from the server. Please check your connection.');
    } else {
      // Something else happened while setting up the request
      console.error('An error occurred. Please try again later.');
    }
    return Promise.reject(error);
  }
);

export default instance;

// Function to send a POST request with data
export const postData = (url, data) => {
  return instance.post(url, data);
};

// Function to send a POST request with data
export const reAuth = () => {
  let data = {
    refreshToken: `${localStorage.getItem('accessToken')}`
}

postData('/authorization/refresh-token', data).then((res) => {
    if (res.data.error) {
      localStorage.removeItem('authUser')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('accessToken')
      history("/login")
    }else{
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      window.location.reload();
    }
   
    
  });
};
