import fetch from 'node-fetch';
import { Response } from 'node-fetch';

export async function fetchHelper<T>(url: string, method: string, body?: any): Promise<T> {
    const response: Response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
    });

    if (!response.body) {
        throw new Error('Failed to get body from response.');
    }

    const result = await response.text();

    if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}. Response: ${result}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (!result.trim()) {
        return {} as T;
    }

    const lines = result.trim().split('\n');
    const finalLine = lines[lines.length - 1];

    try {
        return JSON.parse(finalLine) as T;
    } catch (error) {
        console.error(`Error parsing JSON response: ${result}`);
        throw new Error(`Error parsing JSON response: ${result}`);
    }
}
