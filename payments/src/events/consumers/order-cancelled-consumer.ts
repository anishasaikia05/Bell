import { Consumer, NotFoundError, OrderCancelledEvent, Queues } from '@aneebell/common-module';
import { OrderStatus } from '@aneebell/common-module';
import { Channel } from 'amqplib';
import { NotBeforeError } from 'jsonwebtoken';
import { Order } from '../../models/order';

export class OrderCancelledConsumer extends Consumer<OrderCancelledEvent> {
  readonly queue: Queues.OrderCancelled = Queues.OrderCancelled;

  async onMessage(data: OrderCancelledEvent['data'], channel: Channel) {
    const order = await Order.findById(data.id);

    if (!order) {
      throw new NotFoundError();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    
    // channel.ack();
  }
}