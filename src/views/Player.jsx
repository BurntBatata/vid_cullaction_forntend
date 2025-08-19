import React, {useEffect, useState, useRef} from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Player(){
  const { id } = useParams();
  const [meta,setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const videoRef = useRef();

  useEffect(()=>{
    async function load(){
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${API}/api/videos/${id}/meta`);
        setMeta(res.data);
      } catch (err) {
        setError("Failed to load video. Please check the URL.");
        console.error("Error loading video:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  },[id]);

  if (loading) {
    return <div className="loading">Loading video...</div>;
  }

  if (error || !meta) {
    return (
      <div className="error">
        {error || "Video not found"}
        <br />
        <Link to="/">← Back to Home</Link>
      </div>
    );
  }

  // stream endpoint: /api/videos/:id/stream
  const src = `${API}/api/videos/${id}/stream`;

  return (
    <div className="video-player">
      <h2>{meta.title}</h2>
      
      <video 
        ref={videoRef} 
        src={src} 
        controls 
        style={{width:"100%",maxWidth:800}}
        onError={() => setError("Failed to load video stream")}
      />
      
      <div style={{marginTop: "1rem"}}>
        {meta.description && (
          <p><strong>Description:</strong> {meta.description}</p>
        )}
        {meta.category && (
          <p><strong>Category:</strong> {meta.category}</p>
        )}
        <p><strong>Uploaded:</strong> {new Date(meta.createdAt).toLocaleDateString()}</p>
      </div>
      
      <div style={{marginTop: "2rem"}}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
