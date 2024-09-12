import { EarnApi } from './types';
import { $sessionId } from "@/shared/model/session";

const baseUrl = '/api'; // Assuming both frontend and backend are hosted under the same directory

export const earnApi: EarnApi = {
    getData: async () => {
        const sessionId = $sessionId.getState(); // Assuming this gets the current sessionId
        const response = await fetch(`${baseUrl}/earn/tasks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionId}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch task data');
        }

        return response.json();
    },
    taskJoined: async (data) => {
        const sessionId = $sessionId.getState();
        const response = await fetch(`${baseUrl}/earn/completeTask`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionId}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to join task');
        }

        return response.json();
    }
};