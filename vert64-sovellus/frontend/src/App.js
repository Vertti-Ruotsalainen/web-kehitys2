import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

function App() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:3000/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  const addUser = () => {
    if (!username || !age || !city) {
      alert("Täytä kaikki kentät!");
      return;
    }

    axios
      .post("http://localhost:3000/users", { username, age, city })
      .then(() => {
        fetchUsers();
        setUsername("");
        setAge("");
        setCity("");
      })
      .catch((error) => console.error("Error adding user:", error));
  };

  const handleShowModal = (id) => {
    setUserIdToDelete(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUserIdToDelete(null);
  };

  const confirmDeleteUser = () => {
    if (!userIdToDelete) return;

    axios
      .delete(`http://localhost:3000/users/${userIdToDelete}`)
      .then(() => {
        fetchUsers();
        handleCloseModal();
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Käyttäjähallinta</h2>

      {/* Lomake uuden käyttäjän lisäämiseen */}
      <div className="card p-4 shadow mt-4">
        <h4>Lisää käyttäjä</h4>
        <div className="row">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Käyttäjänimi"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Ikä"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Kaupunki"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-primary w-100" onClick={addUser}>
              Lisää käyttäjä
            </button>
          </div>
        </div>
      </div>

      {/* Käyttäjälista */}
      <h4 className="mt-4">Käyttäjät</h4>
      <table className="table table-striped mt-3">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Käyttäjänimi</th>
            <th>Ikä</th>
            <th>Kaupunki</th>
            <th>Toiminnot</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.age}</td>
                <td>{user.city}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleShowModal(user.id)}
                  >
                    Poista
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Ei käyttäjiä
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Bootstrap Modal for Confirmation */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Vahvista poisto</Modal.Title>
        </Modal.Header>
        <Modal.Body>Oletko varma, että haluat poistaa tämän käyttäjän?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Peruuta
          </Button>
          <Button variant="danger" onClick={confirmDeleteUser}>
            Poista
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
