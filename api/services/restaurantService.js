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

  getRestaurantsCategory: async (category) => {
    try {
      const response = await apiClient.get('/restaurant-categories', {
        params: { category }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchRestaurantsByCategory: async (categoryId) => {
    try {
      const response = await apiClient.get('/restaurants/', {
        params: { categories: categoryId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRestaurantsByFilter: async ({ serviceType, categoryId }) => {
    try {
      const params = {};
      
      if (serviceType) {
        params.service_type = serviceType;
      }
      
      if (categoryId) {
        params.categories = categoryId;
      }

      const response = await apiClient.get('/restaurants/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
