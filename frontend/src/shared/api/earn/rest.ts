import { EarnApi, GetEarnDataResponse, GetEarnDataResponseItem, ResponseDefault } from './types';
import { $sessionId } from "@/shared/model/session";  // Import the session store

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ResponseDefault<T>> {
  if (!response.ok) {
    const errorText = await response.text(); // Capture the error response
    console.error("API Error:", errorText);
    return { error: true, payload: null };
  }

  try {
    const data: T = await response.json();
    return { error: false, payload: data };
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    return { error: true, payload: null };
  }
}

// Helper to retrieve the current session ID from Effector store
function getSessionId(): string | null {
  return $sessionId.getState();  // Use getState() to retrieve the current value
}

// Traditional fetch function for GET requests
async function fetchData<T>(url: string): Promise<ResponseDefault<T>> {
  const sessionId = getSessionId();  // Get session ID globally

  if (!sessionId) {
    console.error("Session ID is missing.");
    return { error: true, payload: null };
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Session ${sessionId}`, // Use session ID for Authorization
      },
    });

    return await handleResponse<T>(response); // Handle and return the response
  } catch (error) {
    console.error("Fetch request failed:", error);
    return { error: true, payload: null };
  }
}

// Traditional fetch function for POST requests
async function postData<T>(url: string, body: any): Promise<ResponseDefault<T>> {
  const sessionId = getSessionId();  // Get session ID globally

  if (!sessionId) {
    console.error("Session ID is missing.");
    return { error: true, payload: null };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Session ${sessionId}`, // Use session ID for Authorization
      },
      body: JSON.stringify(body),
    });

    return await handleResponse<T>(response); // Handle and return the response
  } catch (error) {
    console.error("Fetch request failed:", error);
    return { error: true, payload: null };
  }
}

// Updated earnApi implementation using fetchData and postData
export const earnApi: EarnApi = {
  getData: async () => {
    const response = await fetchData<{ tasks: GetEarnDataResponseItem[]; user_level: number }>('/api/earn/task.php');

    if (response.error) {
      throw new Error("Failed to fetch earn data");
    }

    return response as GetEarnDataResponse; // Ensure the correct return type
  },

  taskJoined: async (data) => {
    return await postData<any>('/api/earn/complete_task.php', data);
  },
};