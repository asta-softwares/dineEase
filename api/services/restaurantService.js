import apiClient from '../client';

export const restaurantService = {
  getAllRestaurants: async (params) => {
    try {
      const response = await apiClient.get('/restaurants', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRestaurantById: async (id) => {
    try {
      const response = await apiClient.get(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRestaurantMenu: async (id) => {
    try {
      const response = await apiClient.get(`/restaurants/${id}/menu`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchRestaurants: async (query) => {
    try {
      const response = await apiClient.get('/restaurants/search', { 
        params: { q: query } 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRestaurantsByCategory: async (category) => {
    try {
      const response = await apiClient.get('/restaurants/category', {
        params: { category }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
