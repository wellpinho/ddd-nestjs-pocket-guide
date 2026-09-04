import { Injectable } from '@nestjs/common';
import {
  OutboxMessage,
  OutboxRepository,
} from '../../application/ports/outbox-repository';

@Injectable()
export class InMemoryOutboxRepository implements OutboxRepository {
  private readonly messages: OutboxMessage[] = [];

  async add(message: OutboxMessage): Promise<void> {
    this.messages.push({ ...message });
  }

  async pending(): Promise<OutboxMessage[]> {
    return this.messages.filter((message) => !message.processedAt);
  }

  async markProcessed(id: string): Promise<void> {
    const message = this.messages.find((item) => item.id === id);
    if (message) message.processedAt = new Date();
  }

  async incrementAttempts(id: string): Promise<void> {
    const message = this.messages.find((item) => item.id === id);
    if (message) message.attempts += 1;
  }
}
