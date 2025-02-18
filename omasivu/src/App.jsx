import React from "react";
import Navbar from "./components/Navbar";
import Section from "./components/Section";

function App() {
  return (
    <>
      <Navbar />
      <Section id="home" title="Etusivu" background="lightblue" />
      <Section id="about" title="Tietoa" background="lightcoral" />
      <Section id="services" title="Palvelut" background="lightgreen" />
      <Section id="contact" title="Yhteystiedot" background="lightsalmon" />
    </>
  );
}

export default App;
