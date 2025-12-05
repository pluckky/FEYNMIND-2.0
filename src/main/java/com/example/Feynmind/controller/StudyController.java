package com.example.Feynmind.controller;

import com.example.Feynmind.service.AiService;
import com.example.Feynmind.service.PdfService; // Assuming you might look up files later
import com.example.Feynmind.controller.DocumentController; // To access the temp storage
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/study")
@CrossOrigin(origins = "*")
public class StudyController {

    private final AiService aiService;

    public StudyController(AiService aiService) {
        this.aiService = aiService;
    }

    // STEP 1: Get the topics for a specific file
    // POST http://localhost:8080/api/study/analyze
    // Body: { "fileName": "physics_intro.pdf" }
    @PostMapping("/analyze")
    public String getTopics(@RequestBody Map<String, String> payload) {
        String fileName = payload.get("fileName");
        
        // 1. Retrieve the text we saved in memory earlier
        String pdfText = DocumentController.temporaryStorage.get(fileName);
        
        if (pdfText == null) {
            return "Error: File not found in memory. Please upload again.";
        }

        // 2. Ask AI to generate the menu
        return aiService.generateStudyTopics(pdfText);
    }

    // STEP 2: The Student tries to explain a topic
    // POST http://localhost:8080/api/study/feynman-check
    // Body: { "concept": "Gravity", "explanation": "It is a force that pulls..." }
    @PostMapping("/feynman-check")
    public String checkUnderstanding(@RequestBody Map<String, String> payload) {
        String concept = payload.get("concept");
        String explanation = payload.get("explanation");

        // 3. Ask AI to grade it
        return aiService.assessStudentExplanation(concept, explanation);
    }
}

// STEP 3: Generate a Quiz for a Concept
    // POST http://localhost:8080/api/study/quiz
    // Body: { "fileName": "physics.pdf", "concept": "Gravity" }
    @PostMapping("/quiz")
    public String getQuiz(@RequestBody Map<String, String> payload) {
        String fileName = payload.get("fileName");
        String concept = payload.get("concept");
        
        // 1. Get the text from memory
        String pdfText = DocumentController.temporaryStorage.get(fileName);
        
        if (pdfText == null) {
            return "Error: File context lost. Please upload again.";
        }

        // 2. Ask AI to create the quiz
        return aiService.generateQuiz(concept, pdfText);
    }

// STEP 4: Get a Refinement/Analogy
    // POST http://localhost:8080/api/study/analogy
    // Body: { "concept": "Polymorphism" }
    @PostMapping("/analogy")
    public String getAnalogy(@RequestBody Map<String, String> payload) {
        String concept = payload.get("concept");
        return aiService.generateAnalogy(concept);
    }
// STEP 5: Log Student Performance (For Research Data)
    // POST http://localhost:8080/api/study/log-progress
    @PostMapping("/log-progress")
    public String logProgress(@RequestBody Map<String, Object> payload) {
        String fileName = (String) payload.get("fileName");
        String concept = (String) payload.get("concept");
        int score = (int) payload.get("score"); // e.g., 3 out of 3
        String type = (String) payload.get("type"); // "QUIZ" or "CHAT"

        // SIMULATE DATABASE SAVE
        System.out.println("=== RESEARCH DATA LOG ===");
        System.out.println("File: " + fileName);
        System.out.println("Concept: " + concept);
        System.out.println("Activity Type: " + type);
        System.out.println("Performance Score: " + score);
        System.out.println("Timestamp: " + java.time.LocalDateTime.now());
        System.out.println("=========================");

        // In the future, this is where 'repository.save(new ProgressLog(...))' goes
        
        return "Progress logged successfully.";
    }
            Create a simple analogy to help the student understand better.
            Keep it concise and easy to grasp.
            """, concept);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }
                