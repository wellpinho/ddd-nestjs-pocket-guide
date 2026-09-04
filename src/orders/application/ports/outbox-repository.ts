import { IntegrationEvent } from './event-publisher';

export interface OutboxMessage {
  id: string;
  event: IntegrationEvent;
  attempts: number;
  processedAt?: Date;
}

export abstract class OutboxRepository {
  abstract add(message: OutboxMessage): Promise<void>;
  abstract pending(): Promise<OutboxMessage[]>;
  abstract markProcessed(id: string): Promise<void>;
  abstract incrementAttempts(id: string): Promise<void>;
}
