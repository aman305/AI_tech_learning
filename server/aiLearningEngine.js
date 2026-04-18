import { buildPrompt } from "../promptEngine.js"

const defaultGraph = {
    Python: [
        "Variables aur Data Types",
        "Conditional Logic",
        "Loops",
        "Functions",
        "Lists aur Dictionaries",
        "Object-Oriented Basics"
    ]
}

function parseTopicsFromAI(text) {
    const lines = text.split(/\r?\n/)
    const topics = []
    for (const line of lines) {
        const m = line.match(/^\s*\d+\.\s*(.*)$/)
        if (m) {
            topics.push(m[1].trim())
        }
    }
    if (topics.length === 0) {
        for (const line of lines) {
            const trimmed = line.trim()
            if (trimmed && trimmed.length > 3 && trimmed.length < 100 && !trimmed.endsWith("?")) {
                topics.push(trimmed)
                if (topics.length >= 6) break
            }
        }
    }
    return topics
}

async function generateCurriculum(setup, askLLM) {
    const tech = setup.technology || "Python"
    const level = setup.level || "Beginner"
    const prompt = `As an AI learning designer, generate 6 lesson topics for ${tech} ${level} beginners in simple language. Output only a numbered list (1. ..., 2. ...).`
    const response = await askLLM(buildPrompt(prompt, setup, []))
    const topics = parseTopicsFromAI(response)
    if (topics.length >= 4) return topics.slice(0, 8)
    return defaultGraph[tech] || defaultGraph["Python"]
}

function parseEvaluation(response) {
    const lower = response.toLowerCase()
    if (/\bincorrect\b|\bwrong\b|\bnot\s+correct\b/.test(lower)) {
        return "incorrect"
    }
    if (/\bpartial\b|\bsomewhat\b|\balmost\b|\bnot\s+fully\b/.test(lower)) {
        return "partial"
    }
    if (/\bcorrect\b|\bsahi\b|\baccha\b|\bright\b|\bperfect\b/.test(lower)) {
        return "correct"
    }
    return "incorrect"
}

export async function runLearningEngine(message, session, askLLM) {
    const msg = message.trim()
    const msgLower = msg.toLowerCase()
    const setup = session.setup || {}
    const tech = setup.technology || "Python"
    const level = setup.level || "Beginner"

    if (!session.curriculum) {
        session.curriculum = await generateCurriculum(setup, askLLM)
        session.currentLesson = 0
        session.awaitingAnswer = false
        session.studentModel = {
            correctCount: 0,
            partialCount: 0,
            incorrectCount: 0
        }
    }

    const topic = session.curriculum[session.currentLesson] || "Final Review"

    if (msgLower.startsWith("jump-to:")) {
        const idx = parseInt(msgLower.split(":")[1], 10)
        if (Number.isNaN(idx) || idx < 0 || idx >= session.curriculum.length) {
            return "Invalid lesson index."
        }
        if (idx > session.currentLesson) {
            return `You must complete the current lesson first before jumping ahead. Current lesson: ${session.currentLesson + 1}.`
        }
        session.currentLesson = idx
        session.awaitingAnswer = false
        const nextTopic = session.curriculum[session.currentLesson]
        return `Switched to lesson ${idx + 1}: ${nextTopic}. Type 'start' to continue.`
    }

    const isGreeting = /^(hi|hello|hey)\b/.test(msgLower)

    if (isGreeting) {
        const intro = `Welcome to the ${tech} tutor. Aaj hum padh rahe hain: ${topic}.` +
            "\n\nMain pehle concept explain karunga, fir ek question puchunga."
        session.awaitingAnswer = false
        return `${intro}\n\nType 'start' to begin lesson.`
    }

    if (msgLower === "start" || msgLower.includes("teach")) {
        const teachPrompt = `Explain ${topic} for ${level} learners with clear markdown headings: ### Concept, ### Example, ### Code, ### Question. Keep it short and simple in Hinglish/English.`
        const teachingText = await askLLM(buildPrompt(teachPrompt, setup, session.history || []))
        const questionMatch = teachingText.match(/###\s*Question[:\-]?\s*([\s\S]*)/i)
        const questionText = questionMatch ? `Question: ${questionMatch[1].trim().split(/\n/)[0]}` : `Question: ${topic} par ek short sawal btao.`
        session.awaitingAnswer = true
        session.lastQuestion = questionText
        session.history = session.history || []
        session.history.push({ role: "user", content: message })
        session.history.push({ role: "assistant", content: teachingText + "\n\n" + questionText })
        return `${teachingText}\n\n${questionText}`
    }

    const isRepeat = msgLower === "repeat" || msgLower.includes("repeat")
    const isHint = msgLower === "hint" || msgLower.includes("hint")
    const isExercise = msgLower === "exercise" || msgLower.includes("exercise")
    const isSummary = msgLower === "summary" || msgLower.includes("summary")

    if (isRepeat || isHint || isExercise || isSummary) {
        // Keep awaitingAnswer intact so the student still must answer the current question.
        let prompt
        if (isRepeat) {
            prompt = `Repeat ${topic} again in more easy way in 2 bullet points with headings, with funny and humorous example of girlfriend boyfriend situation and end with Question.`
        } else if (isHint) {
            prompt = `Give a short, funny, friendly, Humorous hint for ${topic} that helps the student without giving away the full answer.`
        } else if (isExercise) {
            prompt = `Suggest a small practice exercise for ${topic} with one example input and expected output. Keep it simple and hands-on.`
        } else {
            prompt = `Summarize ${topic} in 2-3 quick bullet points as a review.`
        }

        const teachingText = await askLLM(buildPrompt(prompt, setup, session.history || []))
        let response = teachingText

        if (isRepeat) {
            const questionMatch = teachingText.match(/###\s*Question[:\-]?\s*([\s\S]*)/i)
            const questionText = questionMatch ? `Question: ${questionMatch[1].trim().split(/\n/)[0]}` : `Question: ${topic} ka ek chhota sawal btao.`
            session.awaitingAnswer = true
            session.lastQuestion = questionText
            session.history.push({ role: "user", content: message })
            session.history.push({ role: "assistant", content: teachingText + "\n\n" + questionText })
            response = `${teachingText}\n\n${questionText}`
        } else {
            // keep awaitingAnswer state as-is so student can still answer the last question
            session.history = session.history || []
            session.history.push({ role: "user", content: message })
            session.history.push({ role: "assistant", content: teachingText })
        }

        return response
    }

    if (session.awaitingAnswer) {
        if (msgLower === "next") {
            return `Please answer the current question first or type 'repeat' to review before moving to next lesson.`
        }
        if (msg.length <= 4) {
            session.studentModel.incorrectCount += 1
            session.awaitingAnswer = true
            return `❌ Incorrect. You need to provide a complete answer, not just '${message}'. Type 'repeat' to review and try again.`
        }

        // Handle quick answer checks directly for known simple questions
        const normalized = msgLower.replace(/[^a-z0-9]/g, " ")
        if (session.lastQuestion?.includes("x = 10.5") && normalized.includes("float")) {
            session.studentModel.correctCount += 1
            session.currentLesson += 1
            session.awaitingAnswer = false
            if (session.currentLesson >= session.curriculum.length) {
                return "✔ Great! Correct answer. 🎉 You completed the course!"
            }
            const nextTopic = session.curriculum[session.currentLesson]
            return `✔ Correct! Agla concept: ${nextTopic}. Type 'start' to continue.`
        }

        const evalPrompt = `Evaluate this learner answer for topic ${topic}. Question: ${session.lastQuestion}. Student Answer: ${message}. Return clearly whether correct/partial/incorrect and provide feedback.`
        const evalText = await askLLM(buildPrompt(evalPrompt, setup, session.history || []))
        const quality = parseEvaluation(evalText)

        if (quality === "correct") {
            session.studentModel.correctCount += 1
            session.currentLesson += 1
            session.awaitingAnswer = false
            if (session.currentLesson >= session.curriculum.length) {
                return `✔ Great! Answer sahi hai. ${evalText}\n\n🎉 You completed the course!`;
            }
            const nextTopic = session.curriculum[session.currentLesson]
            return `✔ Correct! ${evalText}\n\nAgla concept: ${nextTopic}. Type 'start' to continue.`
        }

        if (quality === "partial") {
            session.studentModel.partialCount += 1
            session.awaitingAnswer = true
            return `⚠️ Partial answer. ${evalText}\n\nChalo thoda aur clearly samjhte hain. Type 'repeat' to retry.`
        }

        session.studentModel.incorrectCount += 1
        session.awaitingAnswer = true
        return `❌ Incorrect. ${evalText}\n\nLet's retry concept: ${topic}. Type 'repeat' for re-explanation.`
    }

    if (msgLower.includes("next")) {
        if (session.awaitingAnswer) {
            return `Please answer the current question first or type 'repeat' to review before moving to next lesson.`
        }
        session.currentLesson += 1
        if (session.currentLesson >= session.curriculum.length) {
            return "🎉 Course completed! No next lesson."
        }
        session.awaitingAnswer = false
        const nextTopic = session.curriculum[session.currentLesson]
        return `Next lesson: ${nextTopic}. Type 'start' to learn.`
    }

    // Fallback teaching response
    const fallback = `Please type 'start' to begin teaching for ${topic}, or 'repeat' to review.`
    return fallback
}
