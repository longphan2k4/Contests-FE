/**
 * Interface cho lỗi validation từ backend
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Interface cho response lỗi validation
 */
export interface ValidationErrorResponse {
  errors: ValidationError[];
}
