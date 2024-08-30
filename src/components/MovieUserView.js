import React, { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import MovieCard from '../components/MovieCard';

const MovieUserView = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json()) // Parse the response as JSON
      .then(data => {
        // Check if the movies data is present and set it
        if (data.movies) {
          setMovies(data.movies);
        } else {
          console.error('Movies data is not available in the response:', data);
        }
      })
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  return (
    <Row>
      {movies.map(movie => (
        <div key={movie._id} className="col-md-4">
          <MovieCard movie={movie} />
        </div>
      ))}
    </Row>
  );
};

export default MovieUserView;
