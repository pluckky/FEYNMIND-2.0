package com.example.Feynmind.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AiService {

    private final ChatClient chatClient;

    public AiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    // --- FUNCTION 1: THE MENU MAKER (Concept Extraction) ---
    // Takes the messy PDF text and returns a clean list of topics
    public String generateStudyTopics(String pdfText) {
        // We truncate text to 3000 chars to save money/tokens for the demo
        String cleanText = pdfText.length() > 3000 ? pdfText.substring(0, 3000) : pdfText;

        String prompt = """
            You are an expert curriculum designer. 
            Analyze the following academic text and identify the 5 most important concepts.
            Return ONLY a valid JSON array of strings. Do not add markdown or extra text.
            
            Example format: ["Concept 1", "Concept 2", "Concept 3"]
            
            Text to analyze:
            """ + cleanText;

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

    // --- FUNCTION 2: THE FEYNMAN GRADER (The Core Feature) ---
    // Takes a concept and the student's attempt to explain it
    public String assessStudentExplanation(String concept, String studentExplanation) {
        String prompt = String.format("""
            You are Richard Feynman. A student is trying to explain the concept "%s" to you.
            
            Student's Explanation: "%s"
            
            Your Goal:
            1. Did they simplify it enough? (Pass/Fail)
            2. Did they miss any key nuance?
            3. If they failed, give a simple analogy to help them.
            4. Keep your response under 3 sentences.
            """, concept, studentExplanation);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }
}

// --- FUNCTION 3: THE EXAMINER (Quiz Generation) ---
    // Generates 3 Multiple Choice Questions for a specific concept
    public String generateQuiz(String concept, String pdfText) {
        // Truncate text again to be safe
        String cleanText = pdfText.length() > 3000 ? pdfText.substring(0, 3000) : pdfText;

        String prompt = String.format("""
            You are a strict examiner. Create a mini-quiz for the concept: "%s".
            Use the following context text: %s
            
            Requirements:
            1. Generate 3 Multiple Choice Questions.
            2. Provide 4 options for each (A, B, C, D).
            3. Clearly mark the correct answer.
            4. Return ONLY valid JSON.
            
            JSON Format Example:
            [
              {
                "question": "What is force?",
                "options": ["A) Push/Pull", "B) Magic", "C) Energy", "D) Heat"],
                "correctAnswer": "A) Push/Pull"
              }
            ]
            """, concept, cleanText);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

    // --- FUNCTION 4: THE ANALOGY ENGINE (Refinement) ---
    // Section 2.2: Helps students who fail to understand the abstract definition
    public String generateAnalogy(String concept) {
        String prompt = String.format("""
            The student is struggling to understand the concept: "%s".
            
            Task:
            1. Create a simple, real-world analogy to explain this.
            2. Do NOT use technical jargon.
            3. Connect the analogy back to the concept at the end.
            
            Example format: "Think of Voltage like water pressure in a pipe..."
            """, concept);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }    