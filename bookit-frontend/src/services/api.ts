import axios from 'axios';

const API_BASE_URL = 'https://bookit-production-4b93.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// Types
export interface Experience {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  duration: string;
  image_url: string;
  category: string;
  rating: number;
}

export interface Slot {
  id: number;
  experience_id: number;
  date: string;
  time_slot: string;
  total_capacity: number;
  available_capacity: number;
  status: string;
}

export interface BookingData {
  experienceId: number;
  slotId: number;
  userName: string;
  userEmail: string;
  userPhone?: string;
  numberOfPeople: number;
  promoCode?: string;
}

export interface PromoValidation {
  code: string;
  orderAmount: number;
}

// API Functions
export const experiencesAPI = {
  getAll: () => api.get<{ success: boolean; data: Experience[] }>('/experiences'),
  
  getById: (id: number) => api.get<{
    success: boolean;
    data: {
      experience: Experience;
      slots: Record<string, Slot[]>;
      totalSlots: number;
    };
  }>(`/experiences/${id}`),
};

export const bookingsAPI = {
  create: (data: BookingData) => api.post('/bookings', data),
  
  getByEmail: (email: string) => api.get(`/bookings/user/${email}`),
};

export const promoAPI = {
  validate: (data: PromoValidation) => api.post('/promo/validate', data),
};

export default api;
