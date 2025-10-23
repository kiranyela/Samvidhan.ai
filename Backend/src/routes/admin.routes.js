import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/admin.middleware.js';
import { listUsers, verifyUser, setRole, listNgos, verifyNgo } from '../controllers/admin.controller.js';

const router = Router();

router.use(verifyJWT, isAdmin);

router.get('/users', listUsers);
router.post('/users/:id/verify', verifyUser);
router.patch('/users/:id/role', setRole);

// NGOs
router.get('/ngos', listNgos);
router.post('/ngos/:id/verify', verifyNgo);

export default router;
