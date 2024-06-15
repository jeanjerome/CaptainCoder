export async function fetchHelper<T>(url: string, method: string, body?: any): Promise<T> {
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let result = '';

    if (!reader) {
        throw new Error('Failed to get reader from response body.');
    }

    while (true) {
        const { done, value } = await reader.read();
        if (done) {break;}
        result += decoder.decode(value, { stream: true });
    }

    if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}. Response: ${result}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Handle the case where the response is empty
    if (!result.trim()) {
        // Return an empty object for void responses
        return {} as T;
    }

    // Handle the case where the response is streaming multiple JSON lines
    const lines = result.trim().split('\n');
    const finalLine = lines[lines.length - 1];

    try {
        return JSON.parse(finalLine) as T;
    } catch (error) {
        console.error(`Error parsing JSON response: ${result}`);
        throw new Error(`Error parsing JSON response: ${result}`);
    }
}
