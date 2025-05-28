import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./DomainSelect.css";

const domains = [
  { 
    name: "Java", 
    value: "java",
    icon: "☕",
    description: "Enterprise applications & backend development",
    color: "#f89820"
  },
  { 
    name: "Python", 
    value: "python",
    icon: "🐍",
    description: "Data science, AI & web development",
    color: "#3776ab"
  },
  { 
    name: "React", 
    value: "react",
    icon: "⚛️",
    description: "Modern frontend & user interfaces",
    color: "#61dafb"
  },
  { 
    name: "JavaScript", 
    value: "javascript",
    icon: "🚀",
    description: "Full-stack web development",
    color: "#f7df1e"
  }
];

export default function DomainSelect({ onSelectDomain }) {
  const [selected, setSelected] = useState("");
  const [hoveredDomain, setHoveredDomain] = useState(null);

  const handleDomainSelect = (domainValue) => {
    setSelected(domainValue);
  };

  const handleStartInterview = () => {
    if (selected) {
      onSelectDomain(selected);
    }
  };

  return (
    <div className="domain-select-container">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="header-section"
      >
        <div className="logo-container">
          <motion.div
            className="logo-icon"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🤖
          </motion.div>
          <h1 className="main-title">
            <span className="title-gradient">AI Interviewer</span>
          </h1>
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="subtitle"
        >
          Choose your expertise and let's begin your technical interview journey
        </motion.p>
      </motion.div>

      {/* Domain Selection */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="selection-section"
      >
        <h2 className="selection-title">Select Your Domain</h2>
        
        <div className="domains-grid">
          <AnimatePresence>
            {domains.map((domain, index) => (
              <motion.div
                key={domain.value}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: 0.6 + index * 0.1, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100 
                }}
                className={`domain-card ${selected === domain.value ? 'selected' : ''}`}
                onClick={() => handleDomainSelect(domain.value)}
                onHoverStart={() => setHoveredDomain(domain.value)}
                onHoverEnd={() => setHoveredDomain(null)}
                whileHover={{ 
                  scale: 1.05,
                  y: -8,
                  transition: { type: "spring", stiffness: 300 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="card-inner">
                  <motion.div
                    className="domain-icon"
                    animate={{
                      scale: hoveredDomain === domain.value ? 1.2 : 1,
                      rotate: hoveredDomain === domain.value ? [0, -10, 10, 0] : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {domain.icon}
                  </motion.div>
                  
                  <h3 className="domain-name">{domain.name}</h3>
                  <p className="domain-description">{domain.description}</p>
                  
                  <div className="selection-indicator">
                    <motion.div
                      className="radio-outer"
                      animate={{
                        borderColor: selected === domain.value ? domain.color : '#d1d5db',
                        backgroundColor: selected === domain.value ? domain.color : 'transparent'
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        className="radio-inner"
                        initial={false}
                        animate={{
                          scale: selected === domain.value ? 1 : 0,
                          opacity: selected === domain.value ? 1 : 0
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    </motion.div>
                  </div>
                </div>
                
                {/* Hover Effect Background */}
                <motion.div
                  className="card-glow"
                  initial={false}
                  animate={{
                    opacity: hoveredDomain === domain.value ? 0.1 : 0,
                    scale: hoveredDomain === domain.value ? 1 : 0.8
                  }}
                  style={{ backgroundColor: domain.color }}
                />
                
                {/* Selection Effect */}
                {selected === domain.value && (
                  <motion.div
                    className="selection-border"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ borderColor: domain.color }}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Start Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="button-section"
      >
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="selected-info"
            >
              <span className="selected-text">
                Ready to start your {domains.find(d => d.value === selected)?.name} interview?
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          className={`start-button ${selected ? 'enabled' : 'disabled'}`}
          disabled={!selected}
          onClick={handleStartInterview}
          whileHover={selected ? { 
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(102, 126, 234, 0.4)"
          } : {}}
          whileTap={selected ? { scale: 0.95 } : {}}
          animate={{
            backgroundColor: selected ? "#667eea" : "#9ca3af",
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="button-content"
            animate={{
              x: selected ? [0, 5, 0] : 0
            }}
            transition={{
              duration: 2,
              repeat: selected ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <span>Start Interview</span>
            <motion.span
              className="button-arrow"
              animate={{
                x: selected ? [0, 3, 0] : 0,
                opacity: selected ? [0.7, 1, 0.7] : 0.3
              }}
              transition={{
                duration: 1.5,
                repeat: selected ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              →
            </motion.span>
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Floating Elements */}
      <div className="floating-elements">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-dot"
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut"
            }}
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 2) * 60}%`
            }}
          />
        ))}
      </div>
    </div>
  );
}