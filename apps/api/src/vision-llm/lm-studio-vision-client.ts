import { BadGatewayException } from '@nestjs/common';
import { type VisionLlmConfig } from './vision-llm.config';
import { type VisionLlmClient, type VisionLlmImageRequest } from './vision-llm-client';

interface LmStudioChatChoice {
  message?: {
    content?: string | null;
  };
}

interface LmStudioChatResponse {
  choices?: LmStudioChatChoice[];
}

export class LmStudioVisionClient implements VisionLlmClient {
  constructor(private readonly config: VisionLlmConfig) {}

  public async requestJson(request: VisionLlmImageRequest): Promise<unknown> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      const response = await fetch(this.chatCompletionsUrl(), {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify(this.body(request)),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new BadGatewayException(await this.errorMessage(response));
      }

      const data = (await response.json()) as LmStudioChatResponse;
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new BadGatewayException('Vision LLM returned an empty response');
      }

      return this.parseJsonContent(content);
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }

      throw new BadGatewayException('Vision LLM request failed');
    } finally {
      clearTimeout(timeout);
    }
  }

  private chatCompletionsUrl(): string {
    return `${this.config.baseUrl.replace(/\/$/, '')}/chat/completions`;
  }

  private headers(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      headers.Authorization = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }

  private body(request: VisionLlmImageRequest): unknown {
    return {
      model: this.config.model,
      temperature: request.temperature ?? 0,
      max_tokens: this.config.maxTokens,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'order_extraction_response',
          schema: request.responseSchema ?? {
            type: 'object',
            additionalProperties: true,
          },
        },
      },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: request.prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:${request.image.mimeType};base64,${request.image.buffer.toString('base64')}`,
              },
            },
          ],
        },
      ],
    };
  }

  private parseJsonContent(content: string): unknown {
    try {
      return JSON.parse(content);
    } catch {
      throw new BadGatewayException('Vision LLM did not return valid JSON');
    }
  }

  private async errorMessage(response: Response): Promise<string> {
    const body = await response.text();

    if (!body) {
      return `Vision LLM request failed with ${response.status}`;
    }

    return `Vision LLM request failed with ${response.status}: ${body}`;
  }
}
