import { IntegrationEvent, EventPublisher } from '../ports/event-publisher';
import { InMemoryOutboxRepository } from '../../infrastructure/messaging/in-memory-outbox.repository';
import { ProcessOutboxUseCase } from './process-outbox';

class PublisherStub implements EventPublisher {
  published: IntegrationEvent[] = [];
  async publish(event: IntegrationEvent): Promise<void> {
    this.published.push(event);
  }
}

describe('ProcessOutboxUseCase', () => {
  it('should publish pending messages and mark them processed', async () => {
    const outbox = new InMemoryOutboxRepository();
    const publisher = new PublisherStub();
    const useCase = new ProcessOutboxUseCase(outbox, publisher);

    await outbox.add({
      id: 'message-1',
      attempts: 0,
      event: { eventName: 'orders.order-paid.v1', occurredAt: new Date(), payload: { orderId: 'order-1' } },
    });

    expect(await useCase.execute()).toBe(1);
    expect(publisher.published).toHaveLength(1);
    expect(await outbox.pending()).toHaveLength(0);
  });
});
