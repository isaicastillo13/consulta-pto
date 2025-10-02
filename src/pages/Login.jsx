import React, { useEffect, useState } from "react";
import InputField from "../components/InputField";
import sideImage from "../assets/banner.png";
import formLogo from "../assets/form_logo.png";
import Button from "../components/Button";
import NavLink from "../components/NavLink";
import imgFooter from "../assets/Footer.png";
import { userService } from "../services/api";
import { useNavigate } from "react-router-dom";

// Constantes para mejorar mantenibilidad
const VALIDATION_MESSAGES = {
  ID_NOT_FOUND: "Cédula no encontrada. Por favor, verifica e intenta de nuevo.",
  DEFAULT_ERROR: "Ha ocurrido un error. Por favor, intenta de nuevo."
};

const FORM_STATES = {
  INITIAL: "initial",
  VALIDATING_ID: "validating_id",
  ID_VALIDATED: "id_validated",
  VALIDATING_ANSWER: "validating_answer",
  ERROR: "error"
};

export default function Login() {
  const [formData, setFormData] = useState({
    cedula: "",
    respuesta: "",
  });

  const [formState, setFormState] = useState(FORM_STATES.INITIAL);
  const [validationMessage, setValidationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Efecto para limpiar mensajes después de un tiempo
  useEffect(() => {
    if (validationMessage) {
      const timer = setTimeout(() => {
        setValidationMessage("");
        if (formState === FORM_STATES.ERROR) {
          resetFormState();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [validationMessage, formState]);

  // Resetear estado del formulario
  const resetFormState = () => {
    setFormState(FORM_STATES.INITIAL);
    setIsSubmitting(false);
  };

  // Determinar clases CSS basado en el estado
  const getInputClasses = () => {
    switch (formState) {
      case FORM_STATES.ID_VALIDATED:
        return "border border-2 border-success-subtle bg-success-subtle focus-none text-success";
      case FORM_STATES.ERROR:
        return "border border-2 border-danger-subtle bg-danger-subtle focus-none text-danger";
      default:
        return "";
    }
  };

  const getLabelClasses = () => {
    switch (formState) {
      case FORM_STATES.ID_VALIDATED:
        return "text-success";
      case FORM_STATES.ERROR:
        return "text-danger";
      default:
        return "";
    }
  };

  // Validar cédula
  const validateCedula = async () => {
    try {
      const response = await userService.validateUserByCedula(formData);
      setFormState(FORM_STATES.ID_VALIDATED);
      setValidationMessage(response.message);
      return true;
    } catch (error) {
      console.error("Error validando cédula:", error);
      setFormState(FORM_STATES.ERROR);
      setValidationMessage(VALIDATION_MESSAGES.ID_NOT_FOUND);
      return false;
    }
  };

  // Validar respuesta de seguridad
  const validateSecurityAnswer = async () => {
    try {
      const response = await userService.validateSecurityAnswer(formData);
      if (response.token) {
        navigate("/Home");
        return true;
      }
      throw new Error("Token no recibido");
    } catch (error) {
      console.error("Error validando respuesta:", error);
      setFormState(FORM_STATES.ERROR);
      setValidationMessage(VALIDATION_MESSAGES.DEFAULT_ERROR);
      return false;
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (formState === FORM_STATES.INITIAL) {
        await validateCedula();
      } else if (formState === FORM_STATES.ID_VALIDATED) {
        await validateSecurityAnswer();
      }
    } catch (error) {
      console.error("Error en el proceso:", error);
      setFormState(FORM_STATES.ERROR);
      setValidationMessage(VALIDATION_MESSAGES.DEFAULT_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Computed values para mejorar legibilidad
  const showAnswerField = formState === FORM_STATES.ID_VALIDATED;
  const isIdValidated = formState === FORM_STATES.ID_VALIDATED;
  const showConsultButton = formState === FORM_STATES.INITIAL;
  const showIngresarButton = formState === FORM_STATES.ID_VALIDATED;
  const buttonText = isSubmitting ? "Consultando..." : "Consultar";

  return (
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
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <form
            className="w-100 px-4"
            style={{ maxWidth: "400px" }}
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="text-center mb-4">
              <img 
                src={formLogo} 
                alt="Logo" 
                className="img-fluid mb-3" 
                style={{ maxHeight: "80px" }}
              />
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
                className={`form-control rounded-pill ${getInputClasses()}`}
                classNameLabel={getLabelClasses()}
                placeholder="Ingrese su cédula"
                value={formData.cedula}
                onChange={(e) =>
                  setFormData(prev => ({ 
                    ...prev, 
                    cedula: e.target.value 
                  }))
                }
                disabled={isIdValidated || isSubmitting}
                required
              />
            </div>

            {/* Campo Respuesta */}
            {showAnswerField && (
              <div className="mb-3">
                <InputField
                  id="respuesta"
                  name="respuesta"
                  label="Respuesta"
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Ingrese su respuesta"
                  value={formData.respuesta}
                  onChange={(e) =>
                    setFormData(prev => ({ 
                      ...prev, 
                      respuesta: e.target.value 
                    }))
                  }
                  disabled={isSubmitting}
                  required
                />
              </div>
            )}

            {/* Mensaje de validación */}
            {validationMessage && (
              <div 
                className={`alert ${
                  formState === FORM_STATES.ERROR ? "alert-danger" : "alert-info"
                } mb-3`}
                role="alert"
              >
                {validationMessage}
              </div>
            )}

            {/* Botones */}
            {showConsultButton && (
              <Button
                id="consultarBtn"
                className="w-100 mt-3"
                type="submit"
                disabled={isSubmitting || !formData.cedula.trim()}
              >
                {buttonText}
              </Button>
            )}

            {showIngresarButton && (
              <Button
                id="ingresarBtn"
                className="w-100 mt-3"
                type="submit"
                disabled={isSubmitting || !formData.respuesta.trim()}
              >
                {isSubmitting ? "Validando..." : "Ingresar"}
              </Button>
            )}

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
        <img 
          className="img-fluid w-100" 
          src={imgFooter} 
          alt="Footer" 
        />
      </div>
    </div>
  );
}