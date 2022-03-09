import mongoose from "mongoose";
import { OrderStatus } from "@aneebell/common-module";

interface OrderAttrs {
  productId: string;
  userId: string;
  status: string;
  price: number
}

interface OrderDoc extends mongoose.Document {
  productId: string;
  userId: string;
  status: OrderStatus;
  price: number;
}

interface OrderModel  extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
  productId: {
    type: String, 
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.AwaitingPayment
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };