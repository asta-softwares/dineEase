import apiClient from '../client';

export const restaurantService = {
  getAllRestaurants: async (params) => {
    try {
      const response = await apiClient.get('/restaurants/', { params });
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
      console.error('Error fetching restaurant:', error);
      throw error;
    }
  },

  getRestaurantMenu: async (id) => {
    try {
      const response = await apiClient.get(`/menus/${id}/`);
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

  getRestaurantsByFilter: async ({ serviceType, categoryId, searchQuery }) => {
    try {
      const params = {};
      
      if (serviceType) {
        params.service_type = serviceType;
      }
      
      if (categoryId) {
        params.categories = categoryId;
      }

      if (searchQuery) {
        params.name = searchQuery;
      }

      const response = await apiClient.get('/restaurants/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMenuCuisines: async () => {
    try {
      const response = await apiClient.get('/menu-cuisines/');
      return response.data;
    } catch (error) {
      console.error('Error fetching menu cuisines:', error);
      throw error;
    }
  },

  getAllPromos: async () => {
    try {
      const response = await apiClient.get('/promos/');
      return response.data;
    } catch (error) {
      console.error('Error fetching promos:', error);
      throw error;
    }
  },

  getOrderPromos: async (restaurantId, orderTotal) => {
    try {
      const response = await apiClient.get(`/promos/restaurant/${restaurantId}?order_total=${orderTotal}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching promos:', error);
      throw error;
    }
  },

  getOrderTotal: async (orderData) => {
    try {
      const response = await apiClient.post(`/payments/order-preview/`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error fetching order total preview:', error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post('/payments/order-create/', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  createPaymentIntent: async (amount) => {
    try {
      const response = await apiClient.post('/payments/create-payment-intent/', { amount });
      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }
};

export default restaurantService;
