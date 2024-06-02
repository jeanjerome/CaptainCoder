export class CacheManager {
  private cache: Map<string, string>;

  constructor() {
    this.cache = new Map();
  }

  get(prompt: string): string | undefined {
    return this.cache.get(prompt);
  }

  set(prompt: string, completion: string): void {
    this.cache.set(prompt, completion);
  }
}
