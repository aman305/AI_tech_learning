import express from "express"
import dotenv from "dotenv"
import {GoogleGenAI} from "@google/genai"
dotenv.config()
const app = express()
const port = process.env.PORT || 3000
if (!process.env.GEMINI_API_KEY) 
{
    throw new Error("GEMINI_API_KEY not found in .env file")
}
app.use(express.json())
app.use(express.static("public"))

