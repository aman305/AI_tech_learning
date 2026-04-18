/*
Azure OpenAI Provider
---------------------
Handles calls to Azure OpenAI Chat Completion API
*/

import fetch from "node-fetch"

export async function askAzure(prompt) {

    try {

        const endpoint = process.env.OPENAI_API_BASE
        const deployment = process.env.OPENAI_DEPLOYMENT_NAME
        const apiKey = process.env.OPENAZURE_API_KEY
        const version = process.env.OPENAI_API_VERSION

        if (!endpoint || !deployment || !apiKey || !version) {
            throw new Error("Azure credentials not configured. Check .env variables OPENAI_API_BASE, OPENAI_DEPLOYMENT_NAME, OPENAZURE_API_KEY, OPENAI_API_VERSION.")
        }

        const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${version}`

        console.log("\n=== AZURE PROMPT ===\n")
        console.log(prompt)

        const response = await fetch(url, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey
            },

            body: JSON.stringify({

                messages: [

                    {
                        role: "system",
                        content:
                        "You are an AI programming tutor. Always follow the instructions in the prompt strictly."
                    },

                    {
                        role: "user",
                        content: prompt
                    }

                ],

                temperature: 0.7,
                max_tokens: 800

            })

        })

        const data = await response.json()

        console.log("\n=== AZURE RESPONSE ===\n")
        console.log(JSON.stringify(data,null,2))

        return data?.choices?.[0]?.message?.content || "No response"

    } catch (err) {

        console.error("Azure Error:", err)

        return "⚠️ Azure AI error"

    }

}