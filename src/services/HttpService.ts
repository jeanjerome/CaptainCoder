export async function sendHttpRequest(url: string, options: RequestInit, stream: boolean = false, onData?: (data: string) => void): Promise<any> {
    const response = await fetch(url, options);

    if (stream) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
            throw new Error("Failed to get reader from response body");
        }

        console.log("Streaming started...");

        let accumulatedText = '';

        while (true) {
            const result = await reader.read();
            if (result.done) {
                console.log("Streaming finished.");
                if (onData) {
                    onData(accumulatedText);
                }
                break;
            }
            const text = decoder.decode(result.value, { stream: true });
            console.log("Received chunk:", text);

            const lines = text.split('\n');
            for (const line of lines) {
                if (line.trim()) {
                    try {
                        const json = JSON.parse(line);
                        // if (json.completed && json.total) {
                        //     const progress = (json.completed / json.total) * 100;
                        // }
                        // accumulatedText += json.response;
                        // if (json.done) {
                        //     if (onData) {
                        //         onData(accumulatedText);
                        //     }
                        //     return;
                        // }
                        if (onData) {
                            onData(json);
                        }
                    } catch (e) {
                        console.error('Error parsing line into JSON:', e);
                    }
                }
            }
        }
    } else {
        return response.json();
    }
}
