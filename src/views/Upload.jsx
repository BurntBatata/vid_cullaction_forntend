import React, {useState} from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Upload(){
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [category,setCategory] = useState("");
  const [externalUrl,setExternalUrl] = useState("");
  const [file,setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(e){
    e.preventDefault();
    if (!title.trim()) {
      setMessage("Title is required");
      return;
    }
    
    if (!file && !externalUrl.trim()) {
      setMessage("Please provide either a video file or external URL");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please login first to upload videos");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("category", category);
    if (externalUrl) fd.append("externalUrl", externalUrl);
    if (file) fd.append("video", file);
    
    try {
      setLoading(true);
      setMessage("");
      const res = await axios.post(`${API}/api/videos/upload`, fd, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("✅ Video uploaded successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setExternalUrl("");
      setFile(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>📤 Upload Video</h2>
      
      {message && (
        <div className={message.includes("✅") ? "success" : "error"}>
          {message}
        </div>
      )}
      
      <form onSubmit={submit}>
        <div>
          <label>Title *</label>
          <input 
            placeholder="Enter video title" 
            value={title} 
            onChange={e=>setTitle(e.target.value)} 
            required
          />
        </div>
        
        <div>
          <label>Category</label>
          <input 
            placeholder="e.g., Music, Gaming, Education" 
            value={category} 
            onChange={e=>setCategory(e.target.value)}
          />
        </div>
        
        <div>
          <label>Description</label>
          <textarea 
            placeholder="Describe your video..." 
            value={description} 
            onChange={e=>setDescription(e.target.value)}
            rows="4"
          />
        </div>
        
        <div>
          <label>External URL (optional)</label>
          <input 
            placeholder="https://example.com/video.mp4" 
            value={externalUrl} 
            onChange={e=>setExternalUrl(e.target.value)} 
          />
          <small>Use this if your video is hosted elsewhere</small>
        </div>
        
        <div>
          <label>Video File (optional if using external URL)</label>
          <input 
            type="file" 
            accept="video/*" 
            onChange={e=>setFile(e.target.files[0])} 
          />
          <small>Supported formats: MP4, WebM, MOV, etc.</small>
        </div>
        
        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "📤 Upload Video"}
          </button>
        </div>
      </form>
    </div>
  );
}
