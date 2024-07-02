import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { Document } from "@langchain/core/documents";
import { VectorStoreInMemory } from "./VectorStoreInMemory";


export class ChatWithCaptain {

    private llm: ChatOllama;
    private retriever;

    constructor(vectorStore: VectorStoreInMemory) {
        this.llm = new ChatOllama({ model: "llama2", baseUrl: "http://localhost:11434" });
        this.retriever = vectorStore.asRetriever();
    }

    async transformToStandalone(question: string) {
        const standaloneQuestionTemplate = `Given a question, convert it to a standalone question.
question: {question} 
standalone question:
`;
        const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);

        const answerTemplate = `You are an enthusiastic and helpful coding assistant who can answer questions about code based 
on the provided context. Study and understand the context, then develop your answer accordingly. Always respond using Markdown format. 
If you truly don't know the answer, simply say "I'm sorry, I don't know the answer to that." Don't try to make up an answer. Always 
speak as if you were chatting with a friend.
context: {context}
question: {question}
answer:
`;

        const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

        const standaloneQuestionChain = standaloneQuestionPrompt
            .pipe(this.llm)
            .pipe(new StringOutputParser());

        const retrieverChain = RunnableSequence.from([
            prevResult => prevResult.standalone_question,
            this.retriever,
            this.combineDocuments
        ]);

        const answerChain = answerPrompt
            .pipe(this.llm)
            .pipe(new StringOutputParser());

        const chain = RunnableSequence.from([
            {
                standalone_question: standaloneQuestionChain,
                original_input: new RunnablePassthrough()
            },
            {
                context: retrieverChain,
                question: ( { original_input }) => original_input.question
            },
            answerChain
        ]);

        const response = await chain.invoke({
            question: question
        });

        return response;
    }

    combineDocuments(docs: Document<Record<string, any>>[]) {
        return docs.map((doc)=>doc.pageContent).join('\n\n');
    }
    
}