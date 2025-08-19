import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./views/Home";
import Upload from "./views/Upload";
import Player from "./views/Player";
import Auth from "./views/Auth";
import "./styles.css";

function App(){
  return (
    <BrowserRouter>
      <header>
        <nav>
          <Link to="/">🏠 Home</Link>
          <Link to="/upload">📤 Upload</Link>
          <Link to="/auth">🔐 Login / Signup</Link>
        </nav>
      </header>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/upload" element={<Upload/>} />
          <Route path="/player/:id" element={<Player/>} />
          <Route path="/auth" element={<Auth/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App/>);
