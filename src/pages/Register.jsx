import React, { useState, useEffect } from "react";
import headerImage from "../assets/Header.png";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import NavLink from "../components/NavLink";
import Button from "../components/Button";
import { userService } from "../services/api";  // ← Cambia esta importación
import { useNavigate } from "react-router-dom";


export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    cedula: "",
    pregunta: "",
    respuesta: "",
  });

  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Cargar preguntas de seguridad al montar el componente
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await userService.getSecurityQuestions();
        setSecurityQuestions(response);
        console.log("Preguntas de seguridad cargadas:", response);
      } catch (error) {
        console.error("Error cargando preguntas:", error);
      }
    };
    loadQuestions();
  }, []);

    // Convertir preguntas al formato de SelectField
  const questionOptions = securityQuestions.map(question => ({
    value: question.id,
    label: question.preguntas
  }));

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await userService.register(formData);
      console.log("Usuario registrado exitosamente:", result);
      alert('¡Registro exitoso!');
      navigate("/");
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container py-5" style={{ color: "#454545" }}>
      <div className="mb-4 text-center">
        <img
          className="img-fluid"
          src={headerImage}
          alt="imagen de punto de oro"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="row g-4 rounded-4 p-4 border-secondary-subtle shadow-sm"
      >
        {/* Columna izquierda */}
        <div className="col-12 col-md-6">
          <h4 className="fw-bold" style={{ color: "#3559a1" }}>
            Registro
          </h4>
          <p>
            ¿Ya estás registrado?{" "}
            <NavLink
              to="/"
              children={"Iniciar sesión"}
              className="text-decoration-none fw-bold"
            />
          </p>

          <InputField
            id="name"
            name="name"
            value={formData.name}
            label="Nombre"
            className="form-control rounded-pill mb-3"
            placeholder="Ingrese su nombre"
            required={true}
            onChange={handleChange}
          />

          <InputField
            id="cedula"
            name="cedula"
            value={formData.cedula}
            label="Cédula"
            className="form-control rounded-pill"
            placeholder="Ingrese su cédula"
            required={true}
            onChange={handleChange}
          />
        </div>

        {/* Columna derecha */}
        <div className="col-12 col-md-6">
          <h4 className="fw-bold" style={{ color: "#3559a1" }}>
            Escoge 1 pregunta de seguridad
          </h4>
          <p>Selecciona una pregunta y proporciona tu respuesta.</p>

          <SelectField
            id="pregunta"
            name="pregunta"
            value={formData.pregunta}
            onChange={handleChange}
            className="form-select form-select-sm mb-3 rounded-pill py-3"
            ariaLabel="Seleccionar pregunta de seguridad"
            options={questionOptions}
            defaultOption="Seleccione su pregunta de seguridad"
          />

          <InputField
            id="respuesta"
            name="respuesta"
            value={formData.respuesta}
            onChange={handleChange}
            label="Respuesta"
            className="form-control rounded-pill"
            placeholder="Ingrese su respuesta"
            required={true}
          />

          <Button
            id="registerButton"
            children={loading ? "Registrando..." : "Registrarse"}
            className="mt-4 w-100"
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
}