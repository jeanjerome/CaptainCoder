import axios from 'axios';

export class OllamaService {
  private apiEndpoint: string;
  private apiModel: string;
  private apiTemperature: number;
  public numPredict: number;

  constructor(apiEndpoint: string, apiModel: string, apiTemperature: number, numPredict: number) {
    this.apiEndpoint = apiEndpoint;
    this.apiModel = apiModel;
    this.apiTemperature = apiTemperature;
    this.numPredict = numPredict;
  }

  async fetchCompletion(prompt: string, messageHeader: string, cancelToken: any): Promise<any> {
    try {
      const response = await axios.post(this.apiEndpoint, {
        model: this.apiModel,
        prompt: messageHeader + prompt,
        stream: true,
        raw: true,
        options: {
          num_predict: this.numPredict,
          temperature: this.apiTemperature,
          stop: ["```"]
        }
      }, {
        cancelToken,
        responseType: 'stream'
      });
      return response;
    } catch (error) {
      throw new Error('Error fetching completion from Ollama API');
    }
  }

  async fetchPreview(prompt: string, messageHeader: string, maxTokens: number, cancelToken: any): Promise<any> {
    try {
      const response = await axios.post(this.apiEndpoint, {
        model: this.apiModel,
        prompt: messageHeader + prompt,
        stream: false,
        raw: true,
        options: {
          num_predict: maxTokens,
          temperature: this.apiTemperature,
          stop: ['\n', '```']
        }
      }, {
        cancelToken
      });
      return response;
    } catch (error) {
      throw new Error('Error fetching preview from Ollama API');
    }
  }
}
