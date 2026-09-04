import { Injectable } from '@nestjs/common';
import {
  EventPublisher,
  IntegrationEvent,
} from '../../application/ports/event-publisher';

@Injectable()
export class InMemoryEventPublisher implements EventPublisher {
  readonly published: IntegrationEvent[] = [];

  async publish(event: IntegrationEvent): Promise<void> {
    this.published.push(event);
  }
}
