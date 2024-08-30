import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MoviesCard = ({ movie }) => {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="https://place.dog/300/200" />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>{movie.description}</Card.Text>
        <Card.Text>{movie.year}</Card.Text>
        <Card.Text>{movie.genre}</Card.Text>
        <Button variant="primary" as={Link} to={`/movies/${movie._id}`}>
          Details
        </Button>
      </Card.Body>
    </Card>
  );
};

export default MoviesCard;
