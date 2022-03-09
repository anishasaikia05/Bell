import express from "express";
import 'express-async-errors'; 
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@aneebell/common-module";
import { createProductRouter } from "./routes/product/create-product";
import { getProductRouter } from "./routes/product/get-single-product";
import { getAllProductRouter } from "./routes/product/get-all-products";
import { updateProductRouter } from "./routes/product/edit-product";
import { createOrderRouter } from "./routes/order/create-order";
import { cancelOrderRouter } from "./routes/order/cancel-order";
import { getAllOrdersRouter } from "./routes/order/get-all-orders";
import { getOrderRouter } from "./routes/order/get-single-order";
 
const app = express();

app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false, 
    secure: process.env.NODE_ENV !== 'test' 
  })
)
 
app.use(currentUser);

app.use(createProductRouter);
app.use(getProductRouter);
app.use(getAllProductRouter);
app.use(updateProductRouter);
app.use(createOrderRouter);
app.use(cancelOrderRouter);
app.use(getAllOrdersRouter);
app.use(getOrderRouter);

app.all('*', async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app }; 