import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Login() {
    const { setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setIsActive(email !== "" && password !== "");
    }, [email, password]);

    function authenticate(e) {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log('Login response:', data); // Debugging line

            if (data.access) {
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);
            } else {
                Swal.fire({
                    title: "Login Failed",
                    icon: "error",
                    text: data.error || "Invalid email or password."
                });
            }
        })
        .catch(err => {
            console.error('Login error:', err);
            Swal.fire({
                title: "Login Error",
                icon: "error",
                text: "An error occurred during login. Please try again."
            });
        });

        setEmail('');
        setPassword('');
    }

    const retrieveUserDetails = (token) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log('User details response:', data); // Debugging line

            if (data.user && data.user._id) {
                setUser({
                    id: data.user._id,
                    isAdmin: data.user.isAdmin
                });
            } else {
                console.error('User details are missing or malformed');
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: "Failed to retrieve user details."
                });
            }
        })
        .catch(err => {
            console.error('Error fetching user details:', err);
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "An error occurred while fetching user details. Please try again."
            });
        });
    };

    return (
        <Form onSubmit={(e) => authenticate(e)}>
            <h1 className="my-5 text-center">Login</h1>
            <Form.Group controlId="userEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                    type="text"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>

            {isActive ? 
                <Button variant="primary" type="submit" id="submitBtn">
                    Submit
                </Button>
                : 
                <Button variant="danger" type="submit" id="submitBtn" disabled>
                    Submit
                </Button>
            }
        </Form>
    );
}
