import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		name: "",
		apellido: ""
	});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const navigate = useNavigate();
	const { register, isLoading } = useAuth();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		
		// Validación simple
		if (!form.username || !form.email || !form.password || !form.name || !form.apellido) {
			setError("Todos los campos son obligatorios.");
			return;
		}

		try {
			const result = await register(form);
			
			if (result.success) {
				setSuccess("Usuario registrado correctamente. Redirigiendo...");
				console.log("Usuario registrado:", result.user);
				setTimeout(() => {
					navigate("/");
				}, 1500);
			} else {
				setError(result.error);
			}
		} catch (error) {
			setError("Error inesperado. Intenta nuevamente.");
			console.error("Error en registro:", error);
		}
	};

	return (
		<div className="register-container">
			<h2>Registro de Usuario</h2>
			<form onSubmit={handleSubmit}>
				<input type="text" name="username" placeholder="Nombre de usuario" value={form.username} onChange={handleChange} />
				<input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
				<input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} />
				<input type="text" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
				<input type="text" name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} />
				<button type="submit" disabled={isLoading}>
					{isLoading ? 'Registrando...' : 'Registrarse'}
				</button>
			</form>
			{error && <p className="auth-message error">{error}</p>}
			{success && <p className="auth-message success">{success}</p>}
		</div>
	);
};

export default Register;
