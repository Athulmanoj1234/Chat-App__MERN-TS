import express from "express";
import { manglishWordSuggestion } from "../controllers/ManglishWords.controller";
import cors from "cors";

const router = express(); // TODO: Why we are creating two instances of express instead of using express.Router() ?
const app = express(); // TODO: Why we are creating two instances of express inside this file?

router.get('/:lastMalWord', manglishWordSuggestion);

module.exports = router;  // TODO: module.exports instead of export default?