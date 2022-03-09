import { OrderStatus } from "@aneebell/common-module";
import mongoose from "mongoose";

interface OrderAttrs {
  id: string;
  price: number;
  userId: string;
  status: OrderStatus; 
}

interface OrderDoc extends mongoose.Document {
  price: number;
  userId: string;
  status: OrderStatus;
}
 
interface OrderModel  extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}
 
const orderSchema = new mongoose.Schema({
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
    enum: Object.values(OrderStatus)
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
  const { id, ...rest } = attrs;
  return new Order({
    _id: id,
    ...rest
  });
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };