/**
 * Manus API Client for Nano Banana Image Generation
 *
 * Handles:
 * - Portrait generation
 * - Emoji/sticker set generation
 * - Zodiac animal generation
 * - Batch generation for carousels/multi-image posts
 */

export interface ManusTaskParams {
  prompt: string;
  model?: 'flux-pro' | 'flux-dev' | 'flux-schnell';
  aspect_ratio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  num_inference_steps?: number;
  guidance_scale?: number;
  seed?: number;
  image?: string; // base64 encoded reference image (for img2img)
}

export interface ManusTaskResponse {
  task_id: string;
}

export interface ManusStatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output_url?: string;
  error?: string;
}

const MANUS_API_BASE = 'https://manus.aws.metafb.cloud/api/v1';
const DEFAULT_POLL_INTERVAL = 5000; // 5 seconds
const DEFAULT_TIMEOUT = 5 * 60 * 1000; // 5 minutes

/**
 * Manus API Client
 */
export class ManusClient {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.MANUS_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('MANUS_API_KEY is required');
    }
  }

  /**
   * Create a new Manus generation task
   */
  async createTask(params: ManusTaskParams): Promise<string> {
    const response = await fetch(`${MANUS_API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        prompt: params.prompt,
        model: params.model || 'flux-pro',
        aspect_ratio: params.aspect_ratio || '1:1',
        num_inference_steps: params.num_inference_steps || 50,
        guidance_scale: params.guidance_scale || 7.5,
        seed: params.seed,
        ...(params.image && { image: params.image }),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Manus API error (${response.status}): ${error}`);
    }

    const data: ManusTaskResponse = await response.json();
    return data.task_id;
  }

  /**
   * Check task status
   */
  async getTaskStatus(taskId: string): Promise<ManusStatusResponse> {
    const response = await fetch(`${MANUS_API_BASE}/tasks/${taskId}/status`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Manus status check failed (${response.status}): ${error}`);
    }

    return response.json();
  }

  /**
   * Poll task until completion or timeout
   */
  async pollUntilComplete(
    taskId: string,
    options?: {
      timeout?: number;
      pollInterval?: number;
      onProgress?: (status: ManusStatusResponse, attempt: number) => void;
    }
  ): Promise<string> {
    const timeout = options?.timeout || DEFAULT_TIMEOUT;
    const pollInterval = options?.pollInterval || DEFAULT_POLL_INTERVAL;
    const startTime = Date.now();
    let attempt = 0;

    while (Date.now() - startTime < timeout) {
      attempt++;
      const status = await this.getTaskStatus(taskId);

      if (options?.onProgress) {
        options.onProgress(status, attempt);
      }

      if (status.status === 'completed') {
        if (!status.output_url) {
          throw new Error('Task completed but no output URL provided');
        }
        return status.output_url;
      }

      if (status.status === 'failed') {
        throw new Error(`Task failed: ${status.error || 'Unknown error'}`);
      }

      // Exponential backoff with max interval
      const backoffInterval = Math.min(pollInterval * Math.pow(1.5, attempt - 1), 30000);
      await new Promise(resolve => setTimeout(resolve, backoffInterval));
    }

    throw new Error(`Task timed out after ${timeout / 1000}s`);
  }

  /**
   * Generate image and wait for completion (convenience method)
   */
  async generate(params: ManusTaskParams, options?: {
    timeout?: number;
    onProgress?: (status: ManusStatusResponse, attempt: number) => void;
  }): Promise<string> {
    const taskId = await this.createTask(params);
    console.log(`✓ Manus task created: ${taskId}`);

    return this.pollUntilComplete(taskId, {
      timeout: options?.timeout,
      onProgress: options?.onProgress,
    });
  }

  /**
   * Batch generate multiple images
   */
  async generateBatch(
    prompts: ManusTaskParams[],
    options?: {
      timeout?: number;
      onProgress?: (index: number, status: ManusStatusResponse, attempt: number) => void;
    }
  ): Promise<string[]> {
    console.log(`\n🎨 Starting batch generation: ${prompts.length} images\n`);

    // Create all tasks first
    const taskIds = await Promise.all(
      prompts.map(async (params, i) => {
        const taskId = await this.createTask(params);
        console.log(`  ${i + 1}/${prompts.length} Task created: ${taskId}`);
        return taskId;
      })
    );

    console.log('\n⏳ Polling for completion...\n');

    // Poll all tasks in parallel
    const results = await Promise.all(
      taskIds.map((taskId, i) =>
        this.pollUntilComplete(taskId, {
          timeout: options?.timeout,
          onProgress: (status, attempt) => {
            if (options?.onProgress) {
              options.onProgress(i, status, attempt);
            }
          },
        })
      )
    );

    console.log('\n✅ All images generated!\n');
    return results;
  }

  /**
   * Download generated image as buffer
   */
  async downloadImage(url: string): Promise<Buffer> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
