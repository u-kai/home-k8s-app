import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          HOME K8s <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://kubernetes.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Kubernetes
        </a>
      </header>
    </div>
  );
}

export default App;
