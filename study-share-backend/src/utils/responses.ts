export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T = any> extends ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pages: number;
}> {}

export const successResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data
});

export const errorResponse = (message: string, details?: any): ApiResponse => ({
  success: false,
  error: {
    message,
    details
  }
});

export const paginatedResponse = <T>(
  items: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> => ({
  success: true,
  data: {
    items,
    total,
    page,
    pages: Math.ceil(total / limit)
  }
});

