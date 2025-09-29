import express from 'express'
import { getSecurityQuestions } from '../controllers/userController.js'

const router = express.Router()

router.get('/security-questions', getSecurityQuestions);

export default router;