import express from 'express';
import { requireAuth, currentUser } from '@aneebell/common-module';


const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });

});

export { router as currentUserRouter };