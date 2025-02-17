import express from "express";
import { manglishWordSuggestion } from "../controllers/ManglishWords.controller";

const router = express();

router.get('/:lastMalWord', manglishWordSuggestion);

module.exports = router; 