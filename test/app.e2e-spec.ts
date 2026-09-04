import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Orders (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates, lists and pays an order', async () => {
    const created = await request(app.getHttpServer())
      .post('/orders')
      .send({
        customerId: 'customer-e2e',
        customerType: 'REGULAR',
        items: [
          {
            productId: 'product-1',
            name: 'Keyboard',
            priceInCents: 10_000,
            quantity: 2,
          },
        ],
      })
      .expect(201);

    expect(created.body.status).toBe('PENDING');

    const list = await request(app.getHttpServer()).get('/orders').expect(200);
    expect(list.body).toHaveLength(1);

    const paid = await request(app.getHttpServer())
      .patch(`/orders/${created.body.id}/pay`)
      .expect(200);

    expect(paid.body.status).toBe('PAID');
    expect(paid.body.paymentTransactionId).toBe(`fake-${created.body.id}`);
  });
});
