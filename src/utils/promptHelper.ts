import { PromptOptions } from '../types/ollamaTypes';

export function getPromptOptions(family: string): PromptOptions {
    switch (family.toLowerCase()) {
        case 'llama':
            return {
                systemMessage: 'You are using a llama model.',
                userMessage: 'Here is your prompt:'
            };
        case 'qwen':
            return {
                systemMessage: 'You are a personal assistant that answers coding questions and provides working solutions.',
                userMessage: '<fim_prefix>{beginning}<fim_suffix>{ending}<fim_middle>'
            };
        default:
            return {
                systemMessage: 'You are using a generic model.',
                userMessage: 'Here is your input:'
            };
    }
}
