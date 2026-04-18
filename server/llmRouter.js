/*
LLM Router
----------
Decides which LLM provider to use
*/

import { askAzure } from "./providers/azureProvider.js"

export async function askLLM(prompt) {

    console.log("\n=== LLM ROUTER ===")
    console.log("PROMPT RECEIVED BY ROUTER:")
    console.log(prompt)

    try {
        console.log("Using Azure LLM")
        return await askAzure(prompt)
    } catch (err) {
        console.error("LLM Router Error:", err)
        return "⚠️ AI provider error"
    }
}