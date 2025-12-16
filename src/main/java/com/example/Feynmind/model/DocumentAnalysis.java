package com.example.Feynmind.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "document_analyses")
@Data
@NoArgsConstructor
public class DocumentAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String fileType; // "pdf", "doc", "docx"

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String extractedText;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String topics; // JSON array of topics

    private String qualityAnalysis; // SVM quality check result
    private LocalDateTime processedAt;

    // Constructor
    public DocumentAnalysis(String fileName, String fileType, String extractedText, String topics, String qualityAnalysis) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.extractedText = extractedText;
        this.topics = topics;
        this.qualityAnalysis = qualityAnalysis;
        this.processedAt = LocalDateTime.now();
    }
}