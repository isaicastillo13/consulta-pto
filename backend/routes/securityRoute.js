import express from 'express'
import { getSecurityQuestions } from '../controllers/securityController.js'

const router = express.Router()
router.get('/questions', getSecurityQuestions);

export default router;