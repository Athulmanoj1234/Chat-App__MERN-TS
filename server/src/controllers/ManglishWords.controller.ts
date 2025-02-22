import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const manglishWordSuggestion = async (req: Request, res: Response)=> {
    const { lastMalWord } = req.params;
    console.log(process.env.GOOGLE_INPUT_QUERY_STRING);
    console.log(lastMalWord);
    
        if(lastMalWord){
            const response = await axios.get(`${process.env.GOOGLE_INPUT_BASE_URL}?text=${lastMalWord}&${process.env.GOOGLE_INPUT_QUERY_STRING}`); // TODO: Use try-catch block for error handling, Query params should be passed as an object instead of string from env
            const malResponse: [] = response.data;
                if(malResponse.length){
                    const result = malResponse.map((malResult: string[])=> malResult[0][1]);
                    console.log(result);
                        if(result.length > 0){
                            res.status(200).json(result);
                        }else{
                            res.status(404).json({ messege: "cant find any manglish word" });
                        }
                }else{
                res.status(500).json({ messege: "google input api error" });
                }
            }else{
                res.status(404).json({ messege: "input is to be converted into manglish didnt received" });
            }
}