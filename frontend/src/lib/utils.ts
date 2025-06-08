import type { AxiosError } from "axios";

export function formatMessageTime(date: string) {
  return new Date(date).toLocaleTimeString("en-UK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function isMyApiError(error: unknown): error is AxiosError {
  // First, check if it's an object and not null
  if (typeof error !== 'object' || error === null) {
    return false;
  }


  // This is safe within a type guard because we're asserting the type.
  const err = error;

  // Check if 'response' property exists and is an object
  if (!('response' in err) || typeof err.response !== 'object' || err.response === null) {
    return false;
  }

  // Check if 'data' property exists within 'response' and is an object
  if (!('data' in err.response) || typeof err.response.data !== 'object' || err.response.data === null) {
    return false;
  }

  // Check if 'message' property exists within 'data' and is a string
  if (!('message' in err.response.data) || typeof err.response.data.message !== 'string') {
    return false;
  }

  return true;
}