export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  error: {
    type: string;
    details: ValidationErrorDetail[];
  };
  timestamp: string;
}
