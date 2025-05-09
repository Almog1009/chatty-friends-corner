import { MindTribute, userService } from "./userService";
import prompt from "@/lib/prompt.txt?raw";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface LlmResponse {
  chatResponse: string;
  mindTributes: MindTribute[];
}

export class LlmService {
  private apiKey: string | null = null;
  private apiUrl: string =
    "https://mindmates-openai.openai.azure.com/openai/deployments";
  private apiVersion: string = "api-version=2025-01-01-preview";
  private model: string = "gpt-4o-mini";

  setApiKey(key: string) {
    this.apiKey = key;
    // Save to localStorage for persistence
    localStorage.setItem("llm-api-key", key);
    return true;
  }

  getApiKey() {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem("llm-api-key");
    }
    return this.apiKey;
  }

  async sendRequest(body: object): Promise<any> {
    if (!this.apiKey) {
      throw new Error("API key is not set");
    }

    try {
      const response = await fetch(
        `${this.apiUrl}/${this.model}/chat/completions?${this.apiVersion}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Failed to get response from AI"
        );
      }

      return response.json();
    } catch (error) {
      console.error("Error calling LLM API:", error);
      throw error;
    }
  }

  async sendMessage(userContext: string[], userId: string): Promise<string> {
    const messages: Message[] = [
      {
        role: "user",
        content: prompt.replace("{{userMessages}}", userContext.join("\n")),
      },
    ];

    const response = await this.sendRequest({
      model: this.model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const llmResponse = await this.parseLlmResponse(response);

    console.log(llmResponse);

    userService.updateUserMindTributes(userId, llmResponse.mindTributes);

    return llmResponse.chatResponse;
  }

  async parseLlmResponse(response: any): Promise<LlmResponse> {
    try {
      const llmResponse: LlmResponse = JSON.parse(
        response.choices[0].message.content
      );
      return llmResponse;
    } catch (error) {
      try {
        const reRunResponse = await this.sendRequest({
          model: this.model,
          messages: [
            {
              role: "user",
              content:
                "Please fix this json response:\n" +
                response.choices[0].message.content +
                "\n\n" +
                "Send the fixed json response back only, nothing else.",
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        });
        const llmResponse: LlmResponse = JSON.parse(
          reRunResponse.choices[0].message.content
        );
        return llmResponse;
      } catch (error) {
        throw error;
      }
    }
  }
}

export const llmService = new LlmService();
