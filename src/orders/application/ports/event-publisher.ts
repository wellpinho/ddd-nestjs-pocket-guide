export interface IntegrationEvent {
  eventName: string;
  payload: Record<string, unknown>;
  occurredAt: Date;
}

export abstract class EventPublisher {
  abstract publish(event: IntegrationEvent): Promise<void>;
}
