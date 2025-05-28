import React, { useState } from "react";
import Interview from "./Interview";
import DomainSelect from "./DomainSelect";
import VantaBackground from "./VantaBackground";

export default function App() {
  const [domain, setDomain] = useState(null);

  return (
    <>
      <VantaBackground />
      <div className="app-container" style={styles.container}>
        {!domain ? (
          <DomainSelect onSelectDomain={setDomain} />
        ) : (
          <Interview domain={domain} onRestart={() => setDomain(null)} />
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: "auto",
    background: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
    minHeight: "80vh",
  },
};
