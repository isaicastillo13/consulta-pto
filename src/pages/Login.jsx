import React, { use, useEffect, useState } from "react";
import InputField from "../components/InputField";
import sideImage from "../assets/banner.png";
import formLogo from "../assets/form_logo.png";
import Buttom from "../components/Buttom";
import NavLink from "../components/NavLink";
import imgFooter from "../assets/Footer.png";
import { userService } from "../services/api";  // ← Asegúrate de que esta importación es correcta

export default function Login() {

  const [formData, setFormData] = useState({
    cedula: "",
    respuesta: "",
  });

  const [visible, setVisible] = useState(false);
  const [idValidated, setIdValidated] = useState(false);
  const [validateMessage, setValidateMessage] = useState("");

  useEffect(() => {
    if(validateMessage){
        const timer = setTimeout(() => {
            setValidateMessage("");
        }, 5000);
        return () => clearTimeout(timer);
    }
  }, [validateMessage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Aquí puedes agregar la lógica para manejar el envío del formulario
   try {
     const response = await userService.validateId(formData);
     console.log("Usuario autenticado:", response);
     setVisible(true);
     setIdValidated(true);
   } catch (error) {
     console.error("Error consultando usuario:", error);
    setValidateMessage("Cédula no encontrada. Por favor, verifica e intenta de nuevo.");
   }
  }

  return (
    <>
      <div className="container-fluid min-vh-100 d-flex flex-column">
        <div className="row flex-grow-1">
          {/* Columna izquierda con imagen */}
          <div className="col-md-6 d-none d-md-flex align-items-center p-0">
            <img src={sideImage} alt="Imagen lateral" className="img-fluid h-100 object-fit-cover" />
          </div>

          {/* Columna derecha con formulario */}
          <div className="col-12 col-md-6 d-flex align-items-center">
            <form className="w-100 px-4" style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>
              <div className="text-center mb-4">
                <img src={formLogo} alt="Logo" className="img-fluid mb-3" />
                <h3 className="fw-bold" style={{ color: "#3559a1" }}>
                  Consulta tus Puntos
                </h3>
                <p className="text-muted">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>

              {/* Campo Cédula */}
              <div className="mb-3">
                <InputField
                  id="cedula"
                  name="cedula"
                  label="Cédula"
                  type="text"
                  className={`form-control rounded-pill ${validateMessage ? 'border border-2 border-danger bg-danger' : ''}`}
                  placeholder="Ingrese su cédula"
                  value={formData.cedula}
                  onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                  disabled={idValidated}
                />
              </div>

              {/* Campo Respuesta */}
              <div className={`mb-3 ${visible ? '' : 'd-none'}`}>
                <InputField
                  id="respuesta"
                  name="respuesta"
                  label="Respuesta"
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Ingrese su respuesta"
                  value={formData.respuesta}
                  onChange={(e) => setFormData({ ...formData, respuesta: e.target.value })}
                />
              </div>

              <div className={`alert alert-danger ${validateMessage ? '' : 'd-none'}`} role="alert">
                {validateMessage && <p className="text-danger">{validateMessage}</p>}
              </div>

              {/* Botón */}
              <Buttom id="consultarBtn" className={`w-100 mt-3 ${visible ? 'd-none' : ''}`} type="submit">
                Consultar
              </Buttom>
              <Buttom id="ingresarBtn" className={`w-100 mt-3 ${visible ? '' : 'd-none'}`} type="submit">
                Ingresar
              </Buttom>

              {/* Link de registro */}
              <p className="text-center mt-4 text-secondary">
                ¿No tienes una cuenta?{" "}
                <NavLink
                  to="/Register"
                  className="text-decoration-none fw-bold text-secondary"
                >
                  Registrarse
                </NavLink>
              </p>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="w-100 mt-auto">
          <img className="img-fluid" src={imgFooter} alt="Footer" />
        </div>
      </div>
    </>
  );
}
