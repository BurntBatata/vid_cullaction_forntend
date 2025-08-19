import React, {useState} from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Auth(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [username,setUsername]=useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function signup(e){
    e.preventDefault();
    if (!username || !email || !password) {
      setMessage("Please fill in all fields");
      return;
    }
    
    try {
      setLoading(true);
      setMessage("");
      await axios.post(`${API}/api/auth/signup`, { username, email, password });
      setMessage("✅ Account created successfully! You can now login.");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function login(e){
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please fill in email and password");
      return;
    }
    
    try {
      setLoading(true);
      setMessage("");
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      setMessage("✅ Logged in successfully!");
      setEmail("");
      setPassword("");
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-section">
        <h3>📝 Create Account</h3>
        <form onSubmit={signup}>
          <input 
            placeholder="Username" 
            value={username} 
            onChange={e=>setUsername(e.target.value)} 
            required
          />
          <input 
            placeholder="Email" 
            type="email"
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            required
          />
          <input 
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
      </div>

      <div className="auth-section">
        <h3>🔐 Login</h3>
        <form onSubmit={login}>
          <input 
            placeholder="Email" 
            type="email"
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            required
          />
          <input 
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {message && (
        <div className={message.includes("✅") ? "success" : "error"}>
          {message}
        </div>
      )}
    </div>
  );
}
