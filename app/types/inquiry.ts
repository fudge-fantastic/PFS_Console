export interface ContactInquiry {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  subject: string;
  message: string;
  subscribe_newsletter?: boolean;
}

export interface InquiryResponse {
  success: boolean;
  message: string;
  data: {
    reference_id: string;
    submitted_at: string;
    status: string;
  };
}

export interface EmailTestResponse {
  success: boolean;
  message: string;
  data: {
    test_completed: boolean;
    timestamp: string;
  };
}
