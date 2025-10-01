import React, { use, useEffect, useState } from "react";
import InputField from "../components/InputField";
import sideImage from "../assets/banner.png";
import formLogo from "../assets/form_logo.png";
import Button from "../components/Button";
import NavLink from "../components/NavLink";
import imgFooter from "../assets/Footer.png";
import { userService } from "../services/api"; // ← Asegúrate de que esta importación es correcta
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [formData, setFormData] = useState({
    cedula: "",
    respuesta: "",
  });

  const [showAnswerField , setshowAnswerField ] = useState(false);
  const [isIdValidated , setisIdValidated ] = useState(false);
  const [validationMessage , setvalidationMessage ] = useState("");
  const [textButton, setTextButton] = useState("Consultar");
  const [isSuccess, setIsSuccess] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (validationMessage ) {
      const timer = setTimeout(() => {
        setvalidationMessage ("");
        if (isSuccess === false && isIdValidated  === false) {
          setIsSuccess(null);
          setisIdValidated (null);
          addClassToInput();
          addClassToLabel();
        }
        
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [validationMessage ]);

  const addClassToInput = () => {
    if (
      isSuccess === true &&
      isIdValidated  === true
    ) {
      return "border border-2 border-success-subtle bg-success-subtle focus-none text-success";
    } else if (
      isSuccess === true &&
      isIdValidated  === true
    ) {
      return "border border-2 border-success-subtle bg-success-subtle focus-none text-success";
    } else if (
      isSuccess === false &&
      isIdValidated  === false
    ) {
      return "border border-2 border-danger-subtle bg-danger-subtle focus-none text-danger";
    } else {
      return "";
    }
  };
  const addClassToLabel = () => {
    if (isSuccess === true &&
      isIdValidated  === true) {
      return "text-success";
    } else if (isSuccess === true &&
      isIdValidated  === true) {
      return "text-success";
    } else if (isSuccess === false &&
      isIdValidated  === false) {
      return "text-danger";
    } else {
      return "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTextButton("Consultando...");
    // Aquí puedes agregar la lógica para manejar el envío del formulario
    try {
      const response = await userService.validateId(formData);

      setshowAnswerField (true);
      setisIdValidated (true);
      setvalidationMessage (response.message);
      setIsSuccess(true);
    

      if (isSuccess === true &&
      isIdValidated  === true) {
        const response = await userService.generateToken();
        navigate("/Home");
P
      }
    } catch (error) {
      setIsSuccess(false);
      setvalidationMessage (
        "Cédula no encontrada. Por favor, verifica e intenta de nuevo."
      );
      setTextButton("Consultar");
    }
  };

  return (
    <>
      <div className="container-fluid min-vh-100 d-flex flex-column">
        <div className="row flex-grow-1">
          {/* Columna izquierda con imagen */}
          <div className="col-md-6 d-none d-md-flex align-items-center p-0">
            <img
              src={sideImage}
              alt="Imagen lateral"
              className="img-fluid h-100 object-fit-cover"
            />
          </div>

          {/* Columna derecha con formulario */}
          <div className="col-12 col-md-6 d-flex align-items-center">
            <form
              className="w-100 px-4"
              style={{ maxWidth: "400px" }}
              onSubmit={handleSubmit}
            >
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
                  className={`form-control rounded-pill ${addClassToInput()}`}
                  classNameLabel={addClassToLabel()}
                  placeholder="Ingrese su cédula"
                  value={formData.cedula}
                  onChange={(e) =>
                    setFormData({ ...formData, cedula: e.target.value })
                  }
                  disabled={isIdValidated }
                />
              </div>

              {/* Campo Respuesta */}
              <div className={`mb-3 ${showAnswerField  ? "" : "d-none"}`}>
                <InputField
                  id="respuesta"
                  name="respuesta"
                  label="Respuesta"
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Ingrese su respuesta"
                  value={formData.respuesta}
                  onChange={(e) =>
                    setFormData({ ...formData, respuesta: e.target.value })
                  }
                />
              </div>

              <div
                className={`alert alert-danger ${
                  validationMessage  ? "" : "d-none"
                }`}
                role="alert"
              >
                {validationMessage  && (
                  <p className="text-danger">{validationMessage }</p>
                )}
              </div>

              {/* Botón */}
              <Button
                id="consultarBtn"
                className={`w-100 mt-3 ${showAnswerField  ? "d-none" : ""}`}
                type="submit"
              >
                {textButton}
                {/* <span className={`spinner-grow spinner-grow-sm mx-2 ${textButton == "Consultando..." ? "d-inline-block" : "d-none"}`} aria-hidden="true"></span> */}
              </Button>
              <Button
                id="ingresarBtn"
                className={`w-100 mt-3 ${showAnswerField  ? "" : "d-none"}`}
                type="submit"
              >
                Ingresar
              </Button>

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
