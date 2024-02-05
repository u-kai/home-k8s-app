import React from "react";
import "./App.css";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { List } from "./components/List";
import { Search } from "./components/Search";

function App() {
  const [text, setText] = React.useState("");

  return (
    <>
      <Header />
      <Search />
      <List></List>
      <Footer></Footer>
    </>
  );
}

export default App;
