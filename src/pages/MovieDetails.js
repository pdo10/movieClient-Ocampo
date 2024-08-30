import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Form, Button, ListGroup } from 'react-bootstrap';

const MovieDetails = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/${movieId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch movie details: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Fetched movie data:', data); // Debugging line
                setMovie(data.movie); // Ensure this matches your API response
            } catch (error) {
                console.error('Error fetching movie details:', error);
                setError('Failed to fetch movie details. Please try again later.');
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    const handleAddComment = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/addMovieComment/${movieId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ comment }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to add comment');
            }

            const updatedMovie = await response.json();
            setMovie(updatedMovie.movie);
            setComment('');
            setSuccess('Comment added successfully');
        } catch (error) {
            setError(error.message);
        }
    };

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    if (!movie) {
        return <p>Loading...</p>;
    }

    return (
        <Card>
            <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    {movie.director} - {movie.year}
                </Card.Subtitle>
                <Card.Text>{movie.description}</Card.Text>
                <Card.Text><strong>Genre:</strong> {movie.genre}</Card.Text>

                <h5>Comments</h5>
                <ListGroup variant="flush">
                    {movie.comments && movie.comments.length === 0 ? (
                        <ListGroup.Item>No comments yet.</ListGroup.Item>
                    ) : (
                        movie.comments.map((comment) => (
                            <ListGroup.Item key={comment._id}>
                                {comment.comment}
                            </ListGroup.Item>
                        ))
                    )}
                </ListGroup>

                <Form onSubmit={handleAddComment} className="mt-4">
                    <Form.Group controlId="comment">
                        <Form.Label>Add a Comment</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </Form.Group>
                    {error && <p className="text-danger mt-2">{error}</p>}
                    {success && <p className="text-success mt-2">{success}</p>}
                    <Button variant="primary" type="submit" className="mt-2">
                        Add Comment
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default MovieDetails;
