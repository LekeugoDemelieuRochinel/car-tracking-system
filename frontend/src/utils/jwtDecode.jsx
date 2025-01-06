// src/utils/jwtDecode.js

export const decodeJWT = (token) => {
  try {
      const base64Url = token.split('.')[1]; // Get the payload part of the token
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL-safe characters
      const jsonPayload = decodeURIComponent(
          atob(base64)
              .split('')
              .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
              .join('')
      );
      return JSON.parse(jsonPayload); // Parse the JSON payload
  } catch (error) {
      console.error('Invalid token:', error);
      return null; // Return null if decoding fails
  }
};
