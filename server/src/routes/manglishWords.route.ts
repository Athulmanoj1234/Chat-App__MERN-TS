import express from "express";
import { manglishWordSuggestion } from "../controllers/manglishWords.controller";

const router = express.Router();

router.get('/:lastMalWord', manglishWordSuggestion);

export default router; 