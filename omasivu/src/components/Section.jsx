import React from "react";

const Section = ({ id, title, background }) => {
  return (
    <section id={id} style={{ background, padding: "100px 20px", minHeight: "100vh" }}>
      <h2>{title}</h2>
    </section>
  );
};

export default Section;
