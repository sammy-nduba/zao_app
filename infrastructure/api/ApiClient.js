import axios from 'axios';

export class ApiClient {
  constructor(baseURL, apiKey = '') {
    this.client = axios.create({
      baseURL, 
      timeout: 10000, 
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'X-Api-Key': apiKey }),
      },
    });

    // Add response interceptor for better error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`API response: ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
        return response;
      },
      (error) => {
        console.error(`API error: ${error.config?.url}`, {
          method: error.config?.method,
          data: error.config?.data,
          status: error.response?.status,
          responseData: error.response?.data,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  async get(url) {
    try {
      console.log(`API GET request: ${url}`);
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`API GET error: ${error.message}`);
    }
  }

  async post(url, data) {
    try {
      console.log(`API POST request: ${url}`, { data });
      const response = await this.client.post(url, data);
      return response.data;
    } catch (error) {
      throw new Error(`API POST error: ${error.message}`);
    }
  }
}