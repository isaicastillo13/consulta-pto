// import express from 'express'
// import { getSecurityQuestions } from '../controllers/securityController.js'

// const router = express.Router()
// router.get('/security-questions', getSecurityQuestions);

// export default router;

// backend/routes/securityRoutes.js
import express from 'express';
import { getSecurityQuestions } from '../controllers/securityController.js';

const router = express.Router();

router.get('/security-questions', getSecurityQuestions);

export default router;
