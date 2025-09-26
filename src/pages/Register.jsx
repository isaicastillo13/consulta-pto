import React, { useState } from "react";
import headerImage from "../assets/Header.png";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import NavLink from "../components/NavLink";
import Buttom from "../components/Buttom";
import { saveUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    cedula: "",
    pregunta: "",
    respuesta: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    console.log("Escribiendo:", event.target.value);
  };

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await saveUser(formData);
      console.log("Form submitted successfully:", result);
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
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
              to="/login"
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
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

          <SelectField
            id="pregunta"
            name="pregunta"
            value={formData.pregunta}
            onChange={handleChange}
            className="form-select form-select-sm mb-3 rounded-pill py-3"
            ariaLabel="Large select example"
            options={[
              { value: "option1", label: "Opción 1" },
              { value: "option2", label: "Opción 2" },
              { value: "option3", label: "Opción 3" },
            ]}
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

          <Buttom
            id="registerButton"
            children={"Registrarse"}
            className="mt-4 w-100"
          />
        </div>
      </form>
    </div>
  );
}
