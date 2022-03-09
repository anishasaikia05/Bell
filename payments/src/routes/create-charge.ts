import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus} from '@aneebell/common-module';

import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-completed-publisher';
import { rabbitmqWrapper } from '../rabbitmq-wrapper';

const router = express.Router();

router.post('/api/payments',
  requireAuth,
  [ 
    body('token')
      .not()
      .isEmpty(),
    body('orderId')
      .isMongoId()
      .not()
      .isEmpty()
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if(!order) {
      throw new NotFoundError();
    }

    if(order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError;
    }
 
    if(order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for cancelled order');
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price,
      source: token
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id
    });

    await payment.save();

    await new PaymentCreatedPublisher(rabbitmqWrapper.client).publish({
      orderId: orderId,
      stripeId: charge.id
    })
    
    res.send({ success: true });
  });

  export { router as createChargeRouter };