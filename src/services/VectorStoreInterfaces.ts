import { Document } from "@langchain/core/documents";


export interface IVectorStore {
    add(splittedText: Document<Record<string, any>>[]): void;
}
