import React, {useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Home(){
  const [videos,setVideos] = useState([]);
  const [q,setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(()=>{ 
    fetchVideos(); 
  }, []);

  async function fetchVideos(){
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API}/api/videos`);
      setVideos(res.data);
    } catch (err) {
      setError("Failed to load videos. Please check your connection.");
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  }

  async function search(e){
    e.preventDefault();
    if (!q.trim()) {
      fetchVideos();
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API}/api/videos`, { params: { search: q }});
      setVideos(res.data);
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error("Error searching videos:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Loading videos...</div>;
  }

  return (
    <div>
      <h1>🎬 Video Site</h1>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={search} className="search-form">
        <input 
          placeholder="Search videos by title..." 
          value={q} 
          onChange={e=>setQ(e.target.value)} 
        />
        <button type="submit">🔍 Search</button>
        <button type="button" onClick={fetchVideos}>🔄 Reset</button>
      </form>

      {videos.length === 0 ? (
        <div className="loading">
          {q ? "No videos found matching your search." : "No videos uploaded yet."}
        </div>
      ) : (
        <div className="video-grid">
          {videos.map(v=>(
            <div key={v._id} className="video-card">
              <h3>{v.title}</h3>
              <p>{v.description || "No description available"}</p>
              {v.category && <p><strong>Category:</strong> {v.category}</p>}
              <div>
                <Link to={`/player/${v._id}`}>▶️ Play Video</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
