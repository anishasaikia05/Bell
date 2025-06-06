import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  if(!process.env.JWT_KEY) {
    throw new Error('JWT_KEY msut be defined');
  }

  if(!process.env.MONGO_URI) {
    throw new Error('MONGO_URI msut be defined');
  }

  try {
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