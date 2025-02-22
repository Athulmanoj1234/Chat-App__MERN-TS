import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { google_BaseUrl } from "../sense_variable/variable";

export const manglishWordSuggestion = (req: Request, res: Response): void => {
    const { lastMalWord } = req.params;
    console.log(lastMalWord);
        if(!lastMalWord){
            res.status(404).json({ messege: "input is to be converted into manglish didnt received" });
        }
        if(lastMalWord){
            axios.get(google_BaseUrl, {
                params: {
                    text: lastMalWord,
                    itc: "ml-t-i0-und",
                    num: 5,
                    cp: 0,
                    cs: 1,
                    ie: "utf-8",
                    oe: "utf-8",
                    app: "demopage"
                }
            }).then(response=> {
                const malResponse: [] = response.data;
                    if(malResponse.length){
                        const result = malResponse.map((malResult: string[])=> malResult[0][1]);
                        console.log(result);
                        if(result.length > 0){
                            res.status(200).json(result);
                        }else{
                            res.status(404).json({ messege: "cant find any manglish word" });
                        }
                }
            }).catch(err=> {
                res.status(500).json({ messege: err });
            }) 
            }else{
                res.status(404).json({ messege: "input is to be converted into manglish didnt received" });
            }
}