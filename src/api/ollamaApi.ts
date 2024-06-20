import { fetchHelper } from '../utils/fetchHelper';
import { ModelDetails, OllamaRequest, OllamaResponse } from '../types/ollamaTypes';

const OLLAMA_API_URL = 'http://localhost:11434/api';
const decoder = new TextDecoder();

export async function generateCompletion(request: OllamaRequest): Promise<AsyncIterable<OllamaResponse>> {
    const response = await fetchHelper<Response>(`${OLLAMA_API_URL}/generate`, 'POST', request);

    if (!response.body) {
        throw new Error('Response body is null');
    }

    const reader = response.body.getReader();

    return {
        async *[Symbol.asyncIterator]() {
            let { done, value } = await reader.read();
            while (!done) {
                const chunk = decoder.decode(value, { stream: true });
                const parsed = JSON.parse(chunk.trim());
                yield parsed;
                ({ done, value } = await reader.read());
            }
        }
    };
}

export async function listLocalModels(): Promise<ModelDetails[]> {
    const response = await fetchHelper<{ models: ModelDetails[] }>(`${OLLAMA_API_URL}/tags`, 'GET');
    return response.models;
}

export async function pullModel(modelName: string): Promise<void> {
    await fetchHelper<void>(`${OLLAMA_API_URL}/pull`, 'POST', { name: modelName });
}

export async function deleteModel(modelName: string): Promise<void> {
    await fetchHelper<void>(`${OLLAMA_API_URL}/delete`, 'DELETE', { name: modelName });
}
