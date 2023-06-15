import express from 'express';

import { getUserMe, updateProfile } from '../controllers/users.js';
import {
  updateProfileJoi,
} from '../middlewares/celebrate.js';

const userRouter = express.Router();

userRouter.get('/me', getUserMe);

userRouter.patch('/me', updateProfileJoi, updateProfile);

export default userRouter;
