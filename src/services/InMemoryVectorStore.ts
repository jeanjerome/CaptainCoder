import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";


export class InMemoryVectorStore {

    private store: MemoryVectorStore;

    constructor() {
        this.store = new MemoryVectorStore(new OllamaEmbeddings());
    }

    async add(splittedText: Document<Record<string, any>>[]) {
        if (!splittedText || !Array.isArray(splittedText)) {
            throw new Error('Invalid documents format');
        }

        console.log("Adding documents to vector store:", splittedText);
        await this.store.addDocuments(
            splittedText
        );
    }
}