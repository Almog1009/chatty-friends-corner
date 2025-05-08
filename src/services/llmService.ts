
// Simple service to handle communication with LLM APIs

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// Generate a unique ID for messages
const generateId = () => Math.random().toString(36).substring(2, 10);

export class LlmService {
  private apiKey: string | null = null;
  private apiUrl: string = 'https://api.openai.com/v1/chat/completions';
  private model: string = 'gpt-4o-mini';

  setApiKey(key: string) {
    this.apiKey = key;
    // Save to localStorage for persistence
    localStorage.setItem('llm-api-key', key);
    return true;
  }

  getApiKey() {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('llm-api-key');
    }
    return this.apiKey;
  }

  async sendMessage(message: string, context: Message[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('API key is not set');
    }
    
    const messages: Message[] = [
      ...context,
      { role: 'user', content: message }
    ];

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from AI');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling LLM API:', error);
      throw error;
    }
  }
}

export const llmService = new LlmService();
