import { Consumer, OrderCreatedEvent, Queues } from '@aneebell/common-module';
import { Channel } from 'amqplib';
import { Order } from '../../models/order';

export class OrderCreatedConsumer extends Consumer<OrderCreatedEvent> {
  readonly queue: Queues.OrderCreated = Queues.OrderCreated;

  async onMessage(data: OrderCreatedEvent['data'], channel: Channel) {
    const order = Order.build({
      id: data.id,
      price: data.price,
      status: data.status,
      userId: data.userId,
    })

    await order.save();
    
    // channel.ack();
  }
}