import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const MovieAdminView = () => {
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState({
    title: '',
    director: '',
    year: '',
    description: '',
    genre: ''
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setMovies(data.movies);
      })
      .catch(err => console.error('Failed to fetch movies:', err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovieDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddMovie = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(movieDetails)
    })
      .then(res => res.json())
      .then(data => {
        setMovies([...movies, data.Movie]);
        setShowModal(false);
        setMovieDetails({
          title: '',
          director: '',
          year: '',
          description: '',
          genre: ''
        });
      })
      .catch(err => console.error('Failed to add movie:', err));
  };

  const handleUpdateMovie = (movie) => {
    setSelectedMovie(movie);
    setMovieDetails({
      title: movie.title,
      director: movie.director,
      year: movie.year,
      description: movie.description,
      genre: movie.genre
    });
    setShowModal(true);
  };

  const handleSaveChanges = () => {
    if (!selectedMovie) return;

    fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/${selectedMovie._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(movieDetails)
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Movie updated successfully') {
          setMovies(movies.map(movie =>
            movie._id === selectedMovie._id ? data.updatedMovie : movie
          ));
          setShowModal(false);
        } else {
          console.error('Unexpected response format:', data);
        }
      })
      .catch(err => console.error('Failed to update movie:', err));
  };

  const handleDelete = (movieId) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/${movieId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(() => {
        setMovies(movies.filter(movie => movie._id !== movieId));
      })
      .catch(err => console.error('Failed to delete movie:', err));
  };

  return (
    <>
      <h1>Admin Dashboard</h1>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add New Movie
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Year</th>
            <th>Genre</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map(movie => (
            <tr key={movie._id}>
              <td>{movie.title}</td>
              <td>{movie.description}</td>
              <td>{movie.year}</td>
              <td>{movie.genre}</td>
              <td>
                <Button variant="warning" onClick={() => handleUpdateMovie(movie)}>
                  Update
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(movie._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Adding or Updating Movie */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedMovie ? 'Update Movie' : 'Add New Movie'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={movieDetails.title}
                onChange={handleInputChange}
                placeholder="Enter movie title"
              />
            </Form.Group>
            <Form.Group controlId="formDirector">
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                name="director"
                value={movieDetails.director}
                onChange={handleInputChange}
                placeholder="Enter movie director"
              />
            </Form.Group>
            <Form.Group controlId="formYear">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                name="year"
                value={movieDetails.year}
                onChange={handleInputChange}
                placeholder="Enter movie year"
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={movieDetails.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter movie description"
              />
            </Form.Group>
            <Form.Group controlId="formGenre">
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                name="genre"
                value={movieDetails.genre}
                onChange={handleInputChange}
                placeholder="Enter movie genre"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={selectedMovie ? handleSaveChanges : handleAddMovie}>
            {selectedMovie ? 'Save Changes' : 'Add Movie'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MovieAdminView;
