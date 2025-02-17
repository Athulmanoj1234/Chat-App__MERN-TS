import express from "express";
import { manglishWordSuggestion } from "../controllers/programmingLanguages.controller";

const router = express();

router.get('/:lastMalWord', manglishWordSuggestion);

module.exports = router;