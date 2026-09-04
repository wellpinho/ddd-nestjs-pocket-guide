import { Injectable } from '@nestjs/common';
import { EventPublisher } from '../ports/event-publisher';
import { OutboxRepository } from '../ports/outbox-repository';

@Injectable()
export class ProcessOutboxUseCase {
  constructor(
    private readonly outboxRepository: OutboxRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(): Promise<number> {
    const messages = await this.outboxRepository.pending();
    let processed = 0;

    for (const message of messages) {
      try {
        await this.eventPublisher.publish(message.event);
        await this.outboxRepository.markProcessed(message.id);
        processed += 1;
      } catch {
        await this.outboxRepository.incrementAttempts(message.id);
      }
    }

    return processed;
  }
}
