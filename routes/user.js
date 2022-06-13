import express from 'express';

import auth from '../middlewares/auth.js';
import {
    getUser,
    loginUser,
    deleteUser,
    logoutUser,
    updateUser,
    registerUser,
} from '../controllers/user.js';

const useRouter = express.Router();

useRouter.get('/:id', getUser);
useRouter.post('/login', loginUser);
useRouter.post('/register', registerUser);
useRouter.post('/logout', auth, logoutUser);
useRouter.post('/update', auth, updateUser);
useRouter.delete('/:wallet', auth, deleteUser);

export default useRouter;
