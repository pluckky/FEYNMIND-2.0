import { useState } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState("idle") // idle, uploading, analyzing, ready, error
  const [topics, setTopics] = useState([])
  const [fileName, setFileName] = useState("")

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setStatus("idle")
  }

  // THE MAIN WORKFLOW
  const handleUpload = async () => {
    if (!file) return;

    try {
      // STEP 1: UPLOAD
      setStatus("uploading")
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("http://localhost:8080/api/documents/upload", {
        method: "POST",
        body: formData
      });

      if (!uploadResponse.ok) throw new Error("Upload failed");
      
      const uploadData = await uploadResponse.json();
      setFileName(uploadData.fileName); // Save filename for step 2

      // STEP 2: ANALYZE (Get Topics)
      setStatus("analyzing")
      
      const analyzeResponse = await fetch("http://localhost:8080/api/study/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: uploadData.fileName })
      });

      if (!analyzeResponse.ok) throw new Error("Analysis failed");

      const topicsData = await analyzeResponse.json();
      setTopics(topicsData); // The AI returns a list of strings
      setStatus("ready");

    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="container">
      <h1>Feynmind 🧠</h1>
      <p>Upload your research paper to start a Feynman study session.</p>

      {/* Upload Section */}
      <div className="card">
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        
        <button 
          onClick={handleUpload} 
          disabled={!file || status === 'uploading' || status === 'analyzing'}
        >
          {status === 'idle' && "Start Analysis"}
          {status === 'uploading' && "Reading PDF..."}
          {status === 'analyzing' && "Extracting Concepts..."}
          {status === 'ready' && "Analyze Another"}
          {status === 'error' && "Error - Try Again"}
        </button>
      </div>

      {/* Results Section */}
      {status === 'ready' && (
        <div className="card">
          <h2>Study Menu for: {fileName}</h2>
          <p>Select a concept to explain:</p>
          
          <div className="topic-list">
            {topics.map((topic, index) => (
              <div key={index} className="topic-item">
                <h3>📚 {topic}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App