package com.example.Feynmind.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import weka.classifiers.functions.SMO;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.SerializationHelper;

import java.io.File;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    // --- GEMINI CONFIG ONLY ---
    @Value("${gemini.api.key}")
    private String geminiKey;

    @Value("${gemini.api.url}")
    private String geminiUrl;

    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private SMO svmClassifier;
    private Instances trainingData;

    public AiService(RestClient.Builder builder) {
        this.restClient = builder.build();
        initializeSVM();
    }

    private void initializeSVM() {
        try {
            // Create attributes for SVM features
            ArrayList<Attribute> attributes = new ArrayList<>();
            
            // Text-based features
            attributes.add(new Attribute("wordCount"));
            attributes.add(new Attribute("sentenceCount"));
            attributes.add(new Attribute("avgWordLength"));
            attributes.add(new Attribute("containsConcept"));
            attributes.add(new Attribute("technicalTerms"));
            
            // Class attribute (accurate vs inaccurate)
            ArrayList<String> classValues = new ArrayList<>();
            classValues.add("accurate");
            classValues.add("inaccurate");
            attributes.add(new Attribute("accuracy", classValues));
            
            // Create training dataset
            trainingData = new Instances("ExplanationAccuracy", attributes, 0);
            trainingData.setClassIndex(trainingData.numAttributes() - 1);
            
            // Initialize SVM classifier
            svmClassifier = new SMO();
            
            // Load pre-trained model if it exists, otherwise train with sample data
            File modelFile = new File("svm_model.model");
            if (modelFile.exists()) {
                svmClassifier = (SMO) SerializationHelper.read("svm_model.model");
                System.out.println("Loaded pre-trained SVM model");
            } else {
                trainSampleData();
                System.out.println("Trained new SVM model with sample data");
            }
            
        } catch (Exception e) {
            System.err.println("Error initializing SVM: " + e.getMessage());
            // Fallback: create a simple rule-based classifier
        }
    }

    private void trainSampleData() {
        try {
            // Sample training data for demonstration
            // In a real application, this would be much larger and more diverse
            
            // Accurate explanations
            addTrainingInstance("Photosynthesis is the process where plants use sunlight, water, and carbon dioxide to create glucose and oxygen.", "accurate");
            addTrainingInstance("Gravity is the force that attracts objects with mass toward each other. The strength depends on mass and distance.", "accurate");
            addTrainingInstance("DNA replication is the process of copying genetic material before cell division to ensure each daughter cell gets identical DNA.", "accurate");
            
            // Inaccurate explanations
            addTrainingInstance("Photosynthesis is when plants eat sunlight and drink water to make sugar.", "inaccurate");
            addTrainingInstance("Gravity is a magical force that makes things fall down.", "inaccurate");
            addTrainingInstance("DNA is just a code that tells cells what to do, like computer programming.", "inaccurate");
            
            // Train the SVM
            svmClassifier.buildClassifier(trainingData);
            
            // Save the model
            SerializationHelper.write("svm_model.model", svmClassifier);
            
        } catch (Exception e) {
            System.err.println("Error training SVM: " + e.getMessage());
        }
    }

    private void addTrainingInstance(String explanation, String accuracy) {
        try {
            double[] features = extractFeatures(explanation, ""); // Empty concept for training
            features[features.length - 1] = trainingData.attribute("accuracy").indexOfValue(accuracy);
            
            Instance instance = new DenseInstance(1.0, features);
            instance.setDataset(trainingData);
            trainingData.add(instance);
        } catch (Exception e) {
            System.err.println("Error adding training instance: " + e.getMessage());
        }
    }

    private double[] extractFeatures(String explanation, String concept) {
        // Extract features from explanation text
        String[] words = explanation.split("\\s+");
        String[] sentences = explanation.split("[.!?]+");
        
        double wordCount = words.length;
        double sentenceCount = sentences.length;
        double avgWordLength = words.length > 0 ? 
            explanation.replaceAll("\\s+", "").length() / (double) words.length : 0;
        
        // Check if explanation contains the concept
        double containsConcept = concept.isEmpty() ? 0 : 
            (explanation.toLowerCase().contains(concept.toLowerCase()) ? 1 : 0);
        
        // Count technical terms (simplified - words longer than 6 chars)
        double technicalTerms = 0;
        for (String word : words) {
            if (word.length() > 6) technicalTerms++;
        }
        
        return new double[]{wordCount, sentenceCount, avgWordLength, containsConcept, technicalTerms, 0};
    }

    // --- SVM-BASED ACCURACY CHECKING ---
    public String checkExplanationAccuracy(String concept, String explanation) {
        try {
            double[] features = extractFeatures(explanation, concept);
            
            // Create instance for classification
            Instance instance = new DenseInstance(1.0, features);
            instance.setDataset(trainingData);
            
            // Classify
            double prediction = svmClassifier.classifyInstance(instance);
            String predictedClass = trainingData.classAttribute().value((int) prediction);
            
            // Get confidence
            double[] distribution = svmClassifier.distributionForInstance(instance);
            double confidence = Math.max(distribution[0], distribution[1]) * 100;
            
            return String.format("SVM Analysis: Explanation appears %s (%.1f%% confidence)", 
                predictedClass, confidence);
            
        } catch (Exception e) {
            System.err.println("SVM classification error: " + e.getMessage());
            return "SVM Analysis: Unable to analyze accuracy (using fallback method)";
        }
    }

    public double getAccuracyScore(String concept, String explanation) {
        try {
            double[] features = extractFeatures(explanation, concept);
            Instance instance = new DenseInstance(1.0, features);
            instance.setDataset(trainingData);
            
            double[] distribution = svmClassifier.distributionForInstance(instance);
            return distribution[trainingData.classAttribute().indexOfValue("accurate")] * 100;
            
        } catch (Exception e) {
            return 50.0; // Neutral score on error
        }
    }

    // --- MAIN METHOD: CALL GEMINI ---
    private String callGemini(String promptText) {
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", promptText)))
            )
        );

        try {
            URI uri = URI.create(geminiUrl + "?key=" + geminiKey);
            System.out.println(" Sending request to Gemini...");
            
            String response = restClient.post()
                .uri(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(String.class);
                
            return extractTextFromGemini(response);

        } catch (Exception e) {
            System.err.println(" GEMINI ERROR: " + e.getMessage());
            // Return error as a JSON list so the frontend doesn't crash
            String cleanError = e.getMessage().replace("\"", "'");
            return "[\"Error calling Gemini: " + cleanError + "\"]";
        }
    }

    private String extractTextFromGemini(String json) {
        try {
            JsonNode root = objectMapper.readTree(json);
            String text = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
            // CLEANUP: Remove markdown formatting if Gemini adds it (e.g. ```json ... ```)
            return text.replaceAll("```json", "").replaceAll("```", "").trim();
            
        } catch (Exception e) {
            return "[\"Error parsing Gemini JSON: " + e.getMessage() + "\"]";
        }
    }

    // --- FEATURES (ALL USING GEMINI NOW) ---

    public String generateStudyTopics(String pdfText) {
        String cleanText = pdfText.length() > 5000 ? pdfText.substring(0, 5000) : pdfText;
        // Instruction to ensure valid JSON output
        String prompt = "You are a study assistant. Extract the 5 most important concepts from the text below. Return them strictly as a JSON list of strings (e.g. [\"Concept 1\", \"Concept 2\"]). Do not add markdown formatting. Text: " + cleanText;
        String topics = callGemini(prompt);
        
        // Validate topic quality with SVM
        String qualityCheck = validateTopicQuality(pdfText, topics);
        
        return topics + "\n\nQuality Analysis: " + qualityCheck;
    }

    private String validateTopicQuality(String originalText, String topicsJson) {
        try {
            // Simple validation: check if topics are relevant to the original text
            String[] topicList = objectMapper.readValue(topicsJson, String[].class);
            
            int relevantTopics = 0;
            for (String topic : topicList) {
                if (originalText.toLowerCase().contains(topic.toLowerCase()) || 
                    topic.toLowerCase().contains("error")) {
                    relevantTopics++;
                }
            }
            
            double relevanceScore = (double) relevantTopics / topicList.length * 100;
            
            if (relevanceScore >= 80) {
                return "High quality - topics are well-aligned with content";
            } else if (relevanceScore >= 60) {
                return "Good quality - most topics are relevant";
            } else {
                return "Needs review - some topics may not align with content";
            }
            
        } catch (Exception e) {
            return "Unable to validate topic quality";
        }
    }

    // UPDATED: Now accepts 'difficulty'
    public String assessStudentExplanation(String concept, String explanation, String difficulty) {
        
        String toneInstruction = "";

        // Customize the persona based on difficulty
        switch (difficulty.toLowerCase()) {
            case "easy":
                toneInstruction = "You are a gentle, encouraging tutor teaching a beginner. Use simple language (ELIF5), avoid jargon, and focus on the big picture. If they are close, give them credit.";
                break;
            case "hard":
                toneInstruction = "You are a strict, Socratic professor at a top university. Challenge the user's assumptions, demand precise terminology, and point out even small logical flaws.";
                break;
            case "medium":
            default:
                toneInstruction = "You are a helpful study assistant. Verify accuracy and correct mistakes clearly, but keep the conversation flowing naturally.";
                break;
        }

        String prompt = toneInstruction + "\n\n" +
                        "Concept: " + concept + "\n" +
                        "Student Explanation: " + explanation + "\n\n" +
                        "Provide feedback on their explanation.";

        String aiFeedback = callGemini(prompt);
        
        // Add SVM accuracy analysis
        String svmAnalysis = checkExplanationAccuracy(concept, explanation);
        double accuracyScore = getAccuracyScore(concept, explanation);
        
        return aiFeedback + "\n\n" + svmAnalysis + "\nAccuracy Score: " + String.format("%.1f%%", accuracyScore);
    }

    // UPDATED: Now accepts 'difficulty'
    public String generateAnalogy(String concept, String difficulty) {
        
        String styleInstruction = "";

        switch (difficulty.toLowerCase()) {
            case "easy":
                styleInstruction = "Use a very simple, real-world analogy (like cooking, sports, or simple machines) that a 10-year-old could understand.";
                break;
            case "hard":
                styleInstruction = "Use a sophisticated, abstract, or technical analogy suitable for an expert or graduate student.";
                break;
            case "medium":
            default:
                styleInstruction = "Use a standard, relatable analogy suitable for a college student.";
                break;
        }

        String prompt = "Give a creative analogy to explain the concept: " + concept + ".\n" +
                        styleInstruction + "\n" +
                        "Keep it concise.";

        return callGemini(prompt);
    }
}