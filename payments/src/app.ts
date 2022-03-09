import express from "express";
import 'express-async-errors'; 
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@aneebell/common-module";
import { createChargeRouter } from "./routes/create-charge";


const app = express();

app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false, 
    secure: process.env.NODE_ENV !== 'test' 
  }) 
) 
// Every single incoming request (irrespective of having a JWT or not) needs to look up 'currentUser' to check whether or not the user is authenticated.
// If not authenticated, we don't necessarily immediately reject them. Instead, we only want to reject requests that are coming in to a very specific root handlers.
// And only those route handlers need to have that requireAuth middleware wired up.

// Make sure you add that middleware after cookie session.
// Cookie session has to run first so it can take a look at the cookie and set the req.session property.
// If we don't do that, then whenever current user runs, it will be running too soon and next session will not be set.

app.use(currentUser);

app.use(createChargeRouter);

app.all('*', async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };