import express from "express";
import { manglishWordSuggestion } from "../controllers/ManglishWords.controller";
import cors from "cors";

const router = express();
const app = express();

router.get('/:lastMalWord', manglishWordSuggestion);

module.exports = router; 