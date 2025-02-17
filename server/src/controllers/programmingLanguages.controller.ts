import { Request, Response } from "express";
import axios from "axios";

export const manglishWordSuggestion = async (req: Request, res: Response)=> {
    const { lastMalWord } = req.params;
    console.log(lastMalWord);
        if(lastMalWord){
            const response = await axios.get(`https://inputtools.google.com/request?text=${lastMalWord}&itc=ml-t-i0-und&num=13&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`)
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