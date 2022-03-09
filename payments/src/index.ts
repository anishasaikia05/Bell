import mongoose from "mongoose";
import { app } from "./app";
import { OrderCancelledConsumer } from "./events/consumers/order-cancelled-consumer";
import { OrderCreatedConsumer } from "./events/consumers/order-created-consumer";
import { rabbitmqWrapper } from "./rabbitmq-wrapper";

const start = async () => {
  if(!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
 
  // check if defined. 'process.env.MONGO_URI!' does not work
  if(!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  if(!process.env.STRIPE_KEY) {
    throw new Error('STRIPE_KEY must be defined');
  }

  try {
    await rabbitmqWrapper.connect('amqp://rabbitmq-srv:5672');
    // rabbitmqWrapper.client.on('close', (err) => {
    //   console.error("Connection closed:", err.message);
    //   process.exit();
    // });
    // process.on('SIGINT', () => rabbitmqWrapper.client.close());
    // process.on('SIGTERM', () => rabbitmqWrapper.client.close());

    new OrderCreatedConsumer(rabbitmqWrapper.client).consumeMessage();
    new OrderCancelledConsumer(rabbitmqWrapper.client).consumeMessage();

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to mongodb');
  }
  catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!');
  });
}

start();