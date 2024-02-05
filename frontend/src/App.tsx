import React from "react";
import "./App.css";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { List } from "./components/List";
import { Registers } from "./components/Registers";
import { Search } from "./components/Search";

function App() {
  return (
    <>
      <Header />
      <Search />
      <List></List>
      <Registers></Registers>
      <Footer />
    </>
  );
}

export default App;
