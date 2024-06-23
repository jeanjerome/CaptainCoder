import { sendHttpRequest } from './HttpService';

export class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /*
    **  List all the models already pulled
    */
    async listModels() {
        const url = `${this.baseUrl}/tags`;
        const options: RequestInit = {
            method: 'GET',
        };
        const response = await sendHttpRequest(url, options, false);
        return response;
    }

    /*
    **  Pull a new model into local Ollama
    */
    async pullModel(name: string, onData: (data: any) => void) {
        const url = `${this.baseUrl}/pull`;
        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name }),
        };

        await sendHttpRequest(url, options, true, onData);
    }

    /*
    **  Ask a question and get an answer back
    */
    async generate(model: string, question: string, onData: (data: any) => void) {
        const url = `${this.baseUrl}/generate`;
        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                prompt: question,
            }),
        };

        await sendHttpRequest(url, options, true, onData);
    }

}
