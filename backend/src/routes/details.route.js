import { Router } from 'express';
import { getDetails } from '../controllers/details.controller.js';

const router = Router();

router.get('/:type/:id', getDetails);

export default router;
