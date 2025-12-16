package com.example.Feynmind.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.extractor.WordExtractor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class PdfService {

    public String extractTextFromDocument(MultipartFile file) {
        String contentType = file.getContentType();
        
        try {
            if ("application/pdf".equals(contentType)) {
                return extractTextFromPdf(file);
            } else if ("application/vnd.openxmlformats-officedocument.wordprocessingml.document".equals(contentType) || 
                      file.getOriginalFilename().toLowerCase().endsWith(".docx")) {
                return extractTextFromDocx(file);
            } else if ("application/msword".equals(contentType) || 
                      file.getOriginalFilename().toLowerCase().endsWith(".doc")) {
                return extractTextFromDoc(file);
            } else {
                return "Error: Unsupported file type. Please upload PDF, DOC, or DOCX files.";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error parsing document: " + e.getMessage();
        }
    }

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            
            if (text == null || text.trim().isEmpty()) {
                return "Error: No text found. This PDF might be an image scan.";
            }
            return text.trim();
        }
    }

    private String extractTextFromDocx(MultipartFile file) throws IOException {
        try (XWPFDocument document = new XWPFDocument(file.getInputStream())) {
            XWPFWordExtractor extractor = new XWPFWordExtractor(document);
            String text = extractor.getText();
            
            if (text == null || text.trim().isEmpty()) {
                return "Error: No text found in the Word document.";
            }
            return text.trim();
        }
    }

    private String extractTextFromDoc(MultipartFile file) throws IOException {
        try (HWPFDocument document = new HWPFDocument(file.getInputStream())) {
            WordExtractor extractor = new WordExtractor(document);
            String text = extractor.getText();
            
            if (text == null || text.trim().isEmpty()) {
                return "Error: No text found in the Word document.";
            }
            return text.trim();
        }
    }
}