import React from "react";
import "./App.css";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { List } from "./components/List";
import { Search } from "./components/Search";

const synth = window.speechSynthesis;
console.log(synth.getVoices());
const voice = synth.getVoices()[1];
function App() {
  const [text, setText] = React.useState("");

  return (
    <>
      <Header />
      <Search />
      <List></List>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.voice = voice;
          synth.speak(utterance);
        }}
      >
        Speak
      </button>
      <Footer></Footer>
    </>
  );
}

export default App;
