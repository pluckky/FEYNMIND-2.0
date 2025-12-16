package com.example.Feynmind.repository;

import com.example.Feynmind.model.DocumentAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentAnalysisRepository extends JpaRepository<DocumentAnalysis, Long> {
    List<DocumentAnalysis> findByFileName(String fileName);
    List<DocumentAnalysis> findAllByOrderByProcessedAtDesc();
}