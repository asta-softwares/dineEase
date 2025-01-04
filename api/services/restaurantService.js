import apiClient from '../client';

export const restaurantService = {
  getAllRestaurants: async (params) => {
    try {
      const response = await apiClient.get('/restaurants/', { params });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.message;
      
      console.error('Error fetching all restaurants:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data
      });
      
      throw new Error(errorMessage);
    }
  },

  getRestaurantById: async (id) => {
    try {
      const response = await apiClient.get(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.message;
      
      console.error('Error fetching restaurant by id:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data
      });
      
      throw new Error(errorMessage);
    }
  },

  getRestaurantMenu: async (id) => {
    try {
      const response = await apiClient.get(`/menus/${id}/`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.message;
      
      console.error('Error fetching restaurant menu:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data
      });
      
      throw new Error(errorMessage);
    }
  },

  searchRestaurants: async (query) => {
    try {
      const response = await apiClient.get('/restaurants/search/', { 
        params: { q: query } 
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.message;
      
      console.error('Error searching restaurants:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data
      });
      
      throw new Error(errorMessage);
    }
  },

  getRestaurantsCategory: async (category) => {
    try {
      const response = await apiClient.get('/restaurant-categories/', {
        params: { category }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.message;
      
      console.error('Error fetching restaurant categories:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data
      });
      
      throw new Error(errorMessage);
    }
  },

  searchRestaurantsByCategory: async (categoryId) => {
    try {
      const response = await apiClient.get('/restaurants/', {
        params: { categories: categoryId }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.message;
      
      console.error('Error searching restaurants by category:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data
      });
      
      throw new Error(errorMessage);
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
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.message;
      
      console.error('Error fetching restaurants by filter:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data
      });
      
      throw new Error(errorMessage);
    }
  },

  getMenuCuisines: async () => {
    try {
      const response = await apiClient.get('/menu-cuisines/');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.message;
      
      console.error('Error fetching menu cuisines:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data
      });
      
      throw new Error(errorMessage);
    }
  },

  getAllPromos: async () => {
    try {
      const response = await apiClient.get('/promos/');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.message;
      
      console.error('Error fetching all promos:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data
      });
      
      throw new Error(errorMessage);
    }
  },

  getOrderPromos: async (restaurantId, orderTotal) => {
    console.log(restaurantId, orderTotal);
    try {
      const response = await apiClient.get(`/promos/restaurant/${restaurantId}?order_total=${orderTotal}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.message;
      
      console.error('Error fetching order promos:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data
      });
      
      throw new Error(errorMessage);
    }
  },

  getOrderTotal: async (orderData) => {
    try {
      const response = await apiClient.post(`/payments/order-preview/`, orderData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.message;
      
      console.error('Error fetching order total preview:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data
      });
      
      throw new Error(errorMessage);
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post('/payments/order-create/', orderData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.message;
      
      console.error('Error creating order:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data
      });
      
      throw new Error(errorMessage);
    }
  },

  createPaymentIntent: async (paymentData) => {
    try {
      const response = await apiClient.post('/payments/create-payment-intent/', paymentData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.message;
      
      console.error('Error creating payment intent:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data
      });
      
      throw new Error(errorMessage);
    }
  },

  getOrders: async (page = 1) => {
    try {
      const response = await apiClient.get('/payments/orders/', { params: { page } });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.message;
      
      console.error('Error fetching orders:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data
      });
      
      throw new Error(errorMessage);
    }
  },

  getOrdersById: async (orderId) => {
    try {
      const response = await apiClient.get(`/payments/orders/${orderId}/`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data?.detail ||
                          error.message;
      
      console.error('Error fetching payment orders by id:', {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data
      });
      
      throw new Error(errorMessage);
    }
  },
};

export default restaurantService;
