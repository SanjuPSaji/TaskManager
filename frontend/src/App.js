import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const API_BASE_URL = "https://taskbackend-3ppk.onrender.com";

    useEffect(() => {
        const storedToken = localStorage.getItem('token'); // Check for token in localStorage
        if(storedToken == 'undefined'){
            localStorage.removeItem('token');
            setToken('');
            setTasks([]);
        }else if (storedToken) {
            setToken(storedToken); // Set token if found
        }
    }, []);

    useEffect(() => {
        if (token) {
            console.log("Fetching tasks with token:", token); // Debug: Check the token before fetching
            fetchTasks(); // Fetch tasks only when token is valid
        }
    }, [token]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/tasks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Fetched tasks:", response.data); // Check the fetched tasks
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error.response ? error.response.data : error.message);
        }
    };

    const addTask = async () => {
        if (task) {
            const response = await axios.post(`${API_BASE_URL}/api/tasks`, { name: task }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks([...tasks, response.data]);
            setTask('');
        }
    };

    const deleteTask = async (id) => {
        if (!id) {
            console.error('Task ID is undefined');
            return;
        }
        await axios.delete(`${API_BASE_URL}/api/tasks/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setTasks(tasks.filter((task) => task._id !== id));
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/login`, { username, password });
            localStorage.setItem('token', response.data.token); // Store token in localStorage
            setToken(response.data.token); // Set token in state
            setUsername('');
            setPassword('');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleRegister = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/register`, { username, password });
            alert('Registration successful. Please log in.');
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        setToken(''); // Clear token in state
        setTasks([]); // Optionally clear tasks
    };

    return (
        <div>
            <nav className="navbar">
                <div className="navin">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2490/2490402.png"
                        alt="Task Manager Logo"
                        className="logo"
                    />
                    <h1 className="title">Task Manager App</h1>
                </div>
                {token && (
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                )}
            </nav>
            <div className="App">
                {!token ? (
                    <div>
                        {isLogin ? (
                            <div>
                                <h2>Login</h2>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    style={{marginBottom:"20px"}}
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    style={{marginBottom:"10px"}}
                                />
                                <button onClick={handleLogin} style={{marginRight:"20px"}}>Login</button>
                                <button onClick={toggleForm}>Switch to Register</button>
                            </div>
                        ) : (
                            <div>
                                <h2>Register</h2>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    style={{marginBottom:"20px"}}
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    style={{marginBottom:"10px"}}
                                />
                                <button onClick={handleRegister} style={{marginRight:"20px"}}>Register</button>
                                <button onClick={toggleForm}>Switch to Login</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className="introimg">
                            <p className="intro">
                                Welcome to the Task Manager app! This application allows you to
                                easily manage your tasks. You can add new tasks, view all your
                                tasks, and delete tasks when they are no longer needed. Stay
                                organized and enhance your productivity with this simple yet
                                effective tool.
                            </p>
                            <img
                                className="introimage"
                                src="https://st2.depositphotos.com/1532932/11808/v/450/depositphotos_118086462-stock-illustration-agility-is-reached-by-effective.jpg"
                                alt="Intro"
                            />
                        </div>
                        <input
                            type="text"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            placeholder="Add a new task"
                        />
                        <button onClick={addTask}>Add Task</button>
                        <ul>
                            {tasks.map((task) => (
                                <li key={task._id}>
                                    {task.name}
                                    <button onClick={() => deleteTask(task._id)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
