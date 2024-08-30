import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {

    return (
        <>
        <Row>
            <Col className="p-4 text-center">
                <h1>Welcome To our Movie Catalogue</h1>
                <p>Add, Update, Delete and View Our Movies</p>
                <Link className="btn btn-primary" to={'/movies'}>Check Our Catalogue</Link>
            </Col>
        </Row>
        </>
    )
}