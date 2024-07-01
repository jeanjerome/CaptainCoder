import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { IVectorStore } from "./VectorStoreInterfaces";


export class VectorStoreInMemory extends MemoryVectorStore implements IVectorStore  {
    constructor() {
        super(new OllamaEmbeddings({
            model: "nomic-embed-text",
            baseUrl: "http://localhost:11434"
        }));
    }

    async add(splittedText: Document<Record<string, any>>[]) {
        if (!splittedText || !Array.isArray(splittedText)) {
            throw new Error('Invalid documents format');
        }

        console.log("Adding documents to vector store:", splittedText);
        await this.addDocuments(
            splittedText
        );
    }
}