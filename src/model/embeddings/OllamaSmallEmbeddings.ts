import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { BaseEmbeddings } from '@llm-tools/embedjs';

export class OllamaSmallEmbeddings implements BaseEmbeddings {
    private model: OllamaEmbeddings;

    constructor() {
        this.model = new OllamaEmbeddings({ model: 'nomic-embed-text' });
    }

    getDimensions(): number {
        return 8192;
    }

    embedDocuments(texts: string[]): Promise<number[][]> {
        return this.model.embedDocuments(texts);
    }

    embedQuery(text: string): Promise<number[]> {
        return this.model.embedQuery(text);
    }
}