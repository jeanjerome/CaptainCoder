import { HNSWDb } from "@llm-tools/embedjs/vectorDb/hnswlib";

import { OllamaSmallEmbeddings } from "../model/embeddings/OllamaSmallEmbeddings";
import { RAGApplicationBuilder, Ollama, TextLoader } from "@llm-tools/embedjs";

import * as fs from 'fs';
import * as path from 'path';

export async function callRagModel() {
    const llmApplication = await new RAGApplicationBuilder()
        .setEmbeddingModel(new OllamaSmallEmbeddings())
        .setModel(
            new Ollama({
                modelName: "mixtral",
                baseUrl: 'http://localhost:11434'
            }),
        )
        .setSearchResultCount(30)
        .setVectorDb(new HNSWDb())
        .build();

    const srcDirectory = path.resolve(__dirname, 'src');

    const files = fs.readdirSync(srcDirectory);

    for (const file of files) {
        const filePath = path.join(srcDirectory, file);
        if (fs.statSync(filePath).isFile()) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const text = `File: ${filePath}\n${fileContent}\n`;
            llmApplication.addLoader(new TextLoader({ text }));
        }
    }

    await llmApplication.query('Rédige une description de cette application.');
}