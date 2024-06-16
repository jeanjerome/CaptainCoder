import { fetchHelper } from '../utils/fetchHelper';
import { OllamaCompletionRequest, OllamaCompletionResponse, ModelDetails } from '../types/ollamaTypes';

const OLLAMA_API_URL = 'http://localhost:11434/api';

export async function generateCompletion(request: OllamaCompletionRequest): Promise<OllamaCompletionResponse> {
    return await fetchHelper<OllamaCompletionResponse>(`${OLLAMA_API_URL}/generate`, 'POST', request);
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
