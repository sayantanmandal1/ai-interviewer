import React, { useState } from "react";
import { motion } from "framer-motion";

const domains = ["Java", "Python", "React", "JavaScript"];

export default function DomainSelect({ onSelectDomain }) {
  const [selected, setSelected] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ textAlign: "center" }}
    >
      <h1>Welcome to AI Interviewer</h1>
      <p>Please select your area of expertise to start:</p>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{ padding: 10, fontSize: 18, borderRadius: 6 }}
      >
        <option value="">Select domain</option>
        {domains.map((d) => (
          <option key={d} value={d.toLowerCase()}>
            {d}
          </option>
        ))}
      </select>
      <br />
      <button
        disabled={!selected}
        onClick={() => onSelectDomain(selected)}
        style={{
          marginTop: 20,
          padding: "10px 30px",
          fontSize: 18,
          cursor: selected ? "pointer" : "not-allowed",
          borderRadius: 6,
          backgroundColor: "#4f46e5",
          color: "white",
          border: "none",
        }}
      >
        Start Interview
      </button>
    </motion.div>
  );
}
