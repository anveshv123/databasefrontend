const config = {
    API: {
      URL: 'http://localhost:8080/api', // Your default API URL
      TIMEOUT: 500000,
      ENDPOINTS: {
        LOGIN: '/auth/signin',
        SIGNUP: '/signup',
        PROFILE: '/profile'
      }
    }
  };
  
  export default config;