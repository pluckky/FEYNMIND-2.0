package com.example.Feynmind.controller;

import com.example.Feynmind.model.StudyMaterial;
import com.example.Feynmind.model.DocumentAnalysis;
import com.example.Feynmind.repository.StudyMaterialRepository;
import com.example.Feynmind.repository.DocumentAnalysisRepository;
import com.example.Feynmind.service.AiService;
import com.example.Feynmind.service.PdfService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:3001")
public class DocumentController {

    private final PdfService pdfService;
    private final AiService aiService;
    private final StudyMaterialRepository repository;
    private final DocumentAnalysisRepository analysisRepository;

    public DocumentController(PdfService pdfService, AiService aiService, StudyMaterialRepository repository, DocumentAnalysisRepository analysisRepository) {
        this.pdfService = pdfService;
        this.aiService = aiService;
        this.repository = repository;
        this.analysisRepository = analysisRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPdf(@RequestParam("file") MultipartFile file) {
        System.out.println("------------------------------------------------");
        System.out.println("📂 NEW UPLOAD REQUEST: " + file.getOriginalFilename());

        try {
            // 1. EXTRACT
            System.out.println("📄 Step 1: Extracting text from document...");
            String extractedText = pdfService.extractTextFromDocument(file);
            System.out.println("✅ Text extracted. Length: " + extractedText.length() + " chars");

            // Check if extraction failed
            if (extractedText.startsWith("Error:")) {
                return ResponseEntity.badRequest().body(extractedText);
            }

            // 2. CHECK DATABASE (Handle Duplicates Safely)
            System.out.println("💾 Step 2: Checking database for existing file...");
            List<StudyMaterial> existingFiles = repository.findByFileName(file.getOriginalFilename());
            
            StudyMaterial material;
            if (!existingFiles.isEmpty()) {
                System.out.println(" Found " + existingFiles.size() + " existing copies. Updating the first one.");
                material = existingFiles.get(0);
                material.setContent(extractedText);
            } else {
                System.out.println("No duplicates found. Creating new entry.");
                material = new StudyMaterial(file.getOriginalFilename(), extractedText);
            }
            
            repository.save(material);
            System.out.println("✅ Saved to database successfully.");

            // 3. ANALYZE
            System.out.println(" Step 3: Sending to AI for analysis...");
            String analysisResult = aiService.generateStudyTopics(extractedText);
            System.out.println("✅ AI Response received: " + analysisResult);

            // Parse the analysis result to separate topics and quality analysis
            String topics = analysisResult;
            String qualityAnalysis = "";
            
            if (analysisResult.contains("\n\nQuality Analysis:")) {
                String[] parts = analysisResult.split("\n\nQuality Analysis:", 2);
                topics = parts[0];
                qualityAnalysis = parts[1];
            }

            // 4. SAVE ANALYSIS RESULTS
            System.out.println(" Step 4: Saving analysis results...");
            String fileType = determineFileType(file.getOriginalFilename());
            DocumentAnalysis analysis = new DocumentAnalysis(
                file.getOriginalFilename(),
                fileType,
                extractedText,
                topics,
                qualityAnalysis
            );
            analysisRepository.save(analysis);
            System.out.println("✅ Analysis saved to database.");

            // 5. RESPONSE
            Map<String, String> response = new HashMap<>();
            response.put("fileName", file.getOriginalFilename());
            response.put("topics", topics);
            response.put("analysisId", analysis.getId().toString());
            
            System.out.println(" Step 5: Sending response to frontend.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println(" CRITICAL ERROR IN UPLOAD:");
            e.printStackTrace(); 
            return ResponseEntity.internalServerError().body("Backend Error: " + e.getMessage());
        }
    }

    @GetMapping("/analyses")
    public ResponseEntity<?> getAllAnalyses() {
        try {
            List<DocumentAnalysis> analyses = analysisRepository.findAllByOrderByProcessedAtDesc();
            return ResponseEntity.ok(analyses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error retrieving analyses: " + e.getMessage());
        }
    }

    @GetMapping("/analyses/{id}")
    public ResponseEntity<?> getAnalysisById(@PathVariable Long id) {
        try {
            DocumentAnalysis analysis = analysisRepository.findById(id).orElse(null);
            if (analysis == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error retrieving analysis: " + e.getMessage());
        }
    }

    private String determineFileType(String fileName) {
        if (fileName == null) return "unknown";
        
        String lowerName = fileName.toLowerCase();
        if (lowerName.endsWith(".pdf")) return "pdf";
        if (lowerName.endsWith(".docx")) return "docx";
        if (lowerName.endsWith(".doc")) return "doc";
        
        return "unknown";
    }
}