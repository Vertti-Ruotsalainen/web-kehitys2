import React from "react";

const Navbar = () => {
  const handleScroll = (event, id) => {
    event.preventDefault();
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <a href="#home" onClick={(e) => handleScroll(e, "home")}>Etusivu</a>
        <a href="#about" onClick={(e) => handleScroll(e, "about")}>Tietoa</a>
        <a href="#services" onClick={(e) => handleScroll(e, "services")}>Palvelut</a>
        <a href="#contact" onClick={(e) => handleScroll(e, "contact")}>Yhteystiedot</a>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    background: "#333",
    color: "white",
    padding: "10px 0",
    textAlign: "center",
    position: "fixed",
    width: "100%",
    top: 0,
    left: 0,
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "10px",
  }
};

export default Navbar;
