import mongoose from "mongoose";
import { app } from "./app";
import { PaymentCreatedConsumer } from "./events/consumers/payment-created-consumer";
import { rabbitmqWrapper } from "./rabbitmq-wrapper";

const start = async () => {
  if(!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  if(!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('CLOUDINARY_CLOUD_NAME msut be defined');
  }

  if(!process.env.CLOUDINARY_API_KEY) {
    throw new Error('CLOUDINARY_API_KEY must be defined');
  }

  if(!process.env.CLOUDINARY_API_SECRET) {
    throw new Error('CLOUDINARY_API_SECRET must be defined');
  }

  if(!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
 
  try {
    await rabbitmqWrapper.connect('amqp://rabbitmq-srv:5672');
    // rabbitmqWrapper.client.on('close', (err) => {
    //   console.error("Connection closed:", err.message);
    //   process.exit();
    // });
    // process.on('SIGINT', () => rabbitmqWrapper.client.close());
    // process.on('SIGTERM', () => rabbitmqWrapper.client.close());

    new PaymentCreatedConsumer(rabbitmqWrapper.client).consumeMessage();

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