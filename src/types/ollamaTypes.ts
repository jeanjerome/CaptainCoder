export interface OllamaCompletionRequest {
    model: string;
    prompt: string;
    options?: {
        num_keep?: number;
        seed?: number;
        num_predict?: number;
        top_k?: number;
        top_p?: number;
        tfs_z?: number;
        typical_p?: number;
        repeat_last_n?: number;
        temperature?: number;
        repeat_penalty?: number;
        presence_penalty?: number;
        frequency_penalty?: number;
        mirostat?: number;
        mirostat_tau?: number;
        mirostat_eta?: number;
        penalize_newline?: boolean;
        stop?: string[];
        numa?: boolean;
        num_ctx?: number;
        num_batch?: number;
        num_gpu?: number;
        main_gpu?: number;
        low_vram?: boolean;
        f16_kv?: boolean;
        vocab_only?: boolean;
        use_mmap?: boolean;
        use_mlock?: boolean;
        num_thread?: number;
    };
}

export interface OllamaCompletionResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
    context?: number[];
    total_duration?: number;
    load_duration?: number;
    prompt_eval_count?: number;
    prompt_eval_duration?: number;
    eval_count?: number;
    eval_duration?: number;
}
