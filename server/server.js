/*
server.js
---------
Main backend server for AI Tech Platform.

Flow:
Frontend -> /chat -> Learning Engine -> LLM -> Response
*/

import dotenv from "dotenv"
dotenv.config({ path: ".env" })
import express from "express"
import cors from "cors"
import { runLearningEngine } from "./aiLearningEngine.js"
import { askLLM } from "./llmRouter.js"
import morgan from "morgan"
 
const app = express()
app.use(morgan("dev"))

app.use(cors())
app.use(express.json())

/* -----------------------------------
SESSION MEMORY
----------------------------------- */

const sessions = {}

/* -----------------------------------
CHAT ENDPOINT
----------------------------------- */

app.post("/chat", async (req, res) => {

    try {

        const { message, sessionId, setup } = req.body

        if (!message) {
            return res.json({ reply: "No message received." })
        }

        /* Create session if it doesn't exist */

        if (!sessions[sessionId]) {

            sessions[sessionId] = {

                setup: setup || {},
                curriculum: null,
                currentLesson: 0,
                exerciseMode: false

            }

            console.log("New session created:", sessionId)
        }

        const session = sessions[sessionId]

        /* -----------------------------------
        RUN LEARNING ENGINE
        THIS WAS THE MISSING STEP
        ----------------------------------- */

        const reply = await runLearningEngine(
            message,
            session,
            askLLM
        )

        res.json({
            reply,
            curriculum: session.curriculum || [],
            currentLesson: session.currentLesson || 0,
            awaitingAnswer: !!session.awaitingAnswer
        })

    } catch (err) {

        console.error("Server error:", err)

        res.status(500).json({
            reply: "Server error occurred."
        })
    }

})

/* -----------------------------------
HEALTH CHECK
----------------------------------- */

app.get("/", (req, res) => {

    res.send("AI Learning Server Running")

})

/* -----------------------------------
HEALTH CHECK ROUTE
----------------------------------- */

app.get("/", (req, res) => {
    res.send("AI Learning Server Running 🚀")
})
/* -----------------------------------
START SERVER
----------------------------------- */

const PORT = 3000

app.listen(PORT, () => {

    console.log("Server running on port", PORT)

})