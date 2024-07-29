import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

interface ApiOptions {
  config: AxiosRequestConfig;
}

interface ApiResponse<T> {
  data: T | null;
  error: { message: string; details?: unknown } | null;
}

// Assuming a standard error response format from the API
interface ApiErrorResponse {
  message: string;
}

export const callExternalApi = async <T>(options: ApiOptions): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await axios(options.config);
    const { data } = response;
    return {
      data,
      error: null,
    };
  } catch (error: unknown) {
    let message = "HTTP request failed";
    let details: unknown = null;

    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;

      if (axiosError.code === 'ECONNABORTED') {
        message = "Request timed out";
      } else if (axiosError.response) {
        const responseData = axiosError.response.data;

        if (typeof responseData === 'object' && responseData !== null && 'message' in responseData) {
          message = (responseData as ApiErrorResponse).message;
        } else {
          message = "Unexpected error response format";
          details = responseData;
        }
      } else if (axiosError.message) {
        message = axiosError.message;
      }
    } else {
      message = (error as Error).message;
    }

    return {
      data: null,
      error: {
        message,
        details,
      },
    };
  }
};
