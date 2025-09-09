import React, { useState } from "react";
import './Auth.css';

const Register = () => {
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		nombre: "",
		apellido: ""
	});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		// Validación simple
		if (!form.username || !form.email || !form.password || !form.nombre || !form.apellido) {
			setError("Todos los campos son obligatorios.");
			return;
		}
		try {
			const res = await fetch("http://localhost:3000/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form)
			});
			if (res.ok) {
				setSuccess("Usuario registrado correctamente.");
				setForm({ username: "", email: "", password: "", nombre: "", apellido: "" });
			} else {
				setError("Error al registrar usuario.");
			}
		} catch {
			setError("No se pudo conectar al servidor.");
		}
	};

	return (
		<div className="register-container">
			<h2>Registro de Usuario</h2>
			<form onSubmit={handleSubmit}>
				<input type="text" name="username" placeholder="Nombre de usuario" value={form.username} onChange={handleChange} />
				<input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
				<input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} />
				<input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
				<input type="text" name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} />
				<button type="submit">Registrarse</button>
			</form>
			{error && <p className="auth-message error">{error}</p>}
			{success && <p className="auth-message success">{success}</p>}
		</div>
	);
};

export default Register;
