async function loadRecursiveCharacterTextSplitter() {
    const module = await import("langchain/text_splitter");
    const { RecursiveCharacterTextSplitter } = module;
    return RecursiveCharacterTextSplitter;
}
import * as fs from 'fs-extra';

export class TextSplitter {

    async split(contentFilePath: string) {
        const RecursiveCharacterTextSplitter = await loadRecursiveCharacterTextSplitter();

        try {
            const text = await fs.readFile(contentFilePath, 'utf8');

            const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 500,
                separators: ['\n\n', '\n', ' ', ''],
                chunkOverlap: 50
            });
            const documents = splitter.createDocuments([text]);
            console.log("Documents created by splitter:", documents);

            return documents;
        } catch (error: any) {
            console.log(error);
            throw new Error(`Failed to split content: ${error.message}`);
        }
    }
}
