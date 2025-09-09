import { apiClient } from '../lib/api';
import { API_ENDPOINTS } from '../lib/constants';
import type { ContactInquiry, InquiryResponse, EmailTestResponse } from '../types/inquiry';

export const inquiryService = {
  // Submit customer inquiry
  submitInquiry: async (inquiryData: ContactInquiry): Promise<InquiryResponse> => {
    const response = await apiClient.post<InquiryResponse>(
      API_ENDPOINTS.INQUIRY_CONTACT,
      inquiryData
    );
    return response.data;
  },

  // Test email service
  testEmailService: async (): Promise<EmailTestResponse> => {
    const response = await apiClient.get<EmailTestResponse>(
      API_ENDPOINTS.INQUIRY_TEST
    );
    return response.data;
  },
};
