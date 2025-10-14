import React, { useEffect, useState, useCallback, useMemo } from "react";
import InputField from "../components/InputField";
import sideImage from "../assets/banner.png";
import formLogo from "../assets/form_logo.png";
import Button from "../components/Button";
import NavLink from "../components/NavLink";
import imgFooter from "../assets/Footer.png";
import { userService } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useCliente } from "../context/ClienteContext";


// Constantes
const VALIDATION_MESSAGES = {
  ID_NOT_FOUND: "Cédula no encontrada. Por favor, verifica e intenta de nuevo.",
  DEFAULT_ERROR: "Ha ocurrido un error. Por favor, intenta de nuevo.",
  INVALID_ANSWER: "Respuesta incorrecta. Por favor, intenta de nuevo.",
  EMPTY_FIELD: "Por favor, completa todos los campos requeridos."
};

const FORM_STATES = {
  INITIAL: "initial",
  VALIDATING_ID: "validating_id",
  ID_VALIDATED: "id_validated",
  VALIDATING_ANSWER: "validating_answer",
  ERROR: "error"
};

const MESSAGE_TIMEOUT = 3000;

export default function Login() {
  const [formData, setFormData] = useState({
    cedula: "",
    respuesta: "",
  });

  const [formState, setFormState] = useState(FORM_STATES.INITIAL);
  const [validationMessage, setValidationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { guardarCliente } = useCliente();

  const navigate = useNavigate();

  // Limpiar mensajes con cleanup apropiado
  useEffect(() => {
    if (validationMessage) {
      const timer = setTimeout(() => {
        setValidationMessage("");
        if (formState === FORM_STATES.ERROR) {
          setFormState(FORM_STATES.INITIAL);
          setIsSubmitting(false);
        }
      }, MESSAGE_TIMEOUT);
      
      return () => clearTimeout(timer);
    }
  }, [validationMessage, formState]);

  // Memoizar clases CSS
  const inputClasses = useMemo(() => {
    const baseClasses = "form-control rounded-pill";
    switch (formState) {
      case FORM_STATES.ID_VALIDATED:
        return `${baseClasses} border border-2 border-success-subtle bg-success-subtle focus-none text-success`;
      case FORM_STATES.ERROR:
        return `${baseClasses} border border-2 border-danger-subtle bg-danger-subtle focus-none text-danger`;
      default:
        return baseClasses;
    }
  }, [formState]);

  const labelClasses = useMemo(() => {
    switch (formState) {
      case FORM_STATES.ID_VALIDATED:
        return "text-success";
      case FORM_STATES.ERROR:
        return "text-danger";
      default:
        return "";
    }
  }, [formState]);

  // Validar formato de cédula
  const isValidCedulaFormat = useCallback((cedula) => {
    // Ajusta esta regex según el formato de cédula de tu país
    return cedula.trim().length >= 6 && /^[0-9-]+$/.test(cedula);
  }, []);

  // Handlers memoizados
  const handleCedulaChange = useCallback((e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, cedula: value }));
    // Limpiar errores al escribir
    if (formState === FORM_STATES.ERROR) {
      setFormState(FORM_STATES.INITIAL);
      setValidationMessage("");
    }
  }, [formState]);

  const handleRespuestaChange = useCallback((e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, respuesta: value }));
    if (formState === FORM_STATES.ERROR) {
      setValidationMessage("");
    }
  }, [formState]);

  // Validar cédula con mejor manejo de errores
  const validateCedula = useCallback(async () => {
    
    if (!isValidCedulaFormat(formData.cedula)) {
      setFormState(FORM_STATES.ERROR);
      setValidationMessage("Formato de cédula inválido");
      return false;
    }

    setFormState(FORM_STATES.VALIDATING_ID);
    
    try {
      const response = await userService.validateUserByCedula(formData);
      setFormState(FORM_STATES.ID_VALIDATED);
      setValidationMessage(response.message || "Cédula válida. Ingresa tu respuesta.");
      setError(null);
      return true;

    } catch (error) {
      console.error("Error validando cédula:", error);
      setFormState(FORM_STATES.ERROR);
      setError(error);
      
      // Manejo de diferentes tipos de error
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          VALIDATION_MESSAGES.ID_NOT_FOUND;
      setValidationMessage(errorMessage);
      return false;
    }
  }, [formData, isValidCedulaFormat]);

  // Validar respuesta con mejor manejo de errores
  const validateSecurityAnswer = useCallback(async () => {
    setFormState(FORM_STATES.VALIDATING_ANSWER);
    
    try {
      const response = await userService.validateSecurityAnswer(formData);
      if (response.token) {
     
        // Guardar token si es necesario
        // localStorage.setItem('authToken', response.token);
       
        const cliente = await userService.verificarCliente(formData.cedula);
        guardarCliente(cliente);
        localStorage.setItem("cliente", JSON.stringify(cliente));
        navigate("/Home", { replace: true });
        return true;
      }
      
      throw new Error("Token no recibido");
    } catch (error) {
      console.error("Error validando respuesta:", error);
      setFormState(FORM_STATES.ERROR);
      setError(error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          VALIDATION_MESSAGES.INVALID_ANSWER;
      setValidationMessage(errorMessage);
      return false;
    }
  }, [formData, navigate]);

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    
    // Prevenir múltiples envíos
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setValidationMessage("");

    try {
      if (formState === FORM_STATES.INITIAL) {
        if (!formData.cedula.trim()) {
          setValidationMessage(VALIDATION_MESSAGES.EMPTY_FIELD);
          setFormState(FORM_STATES.ERROR);
          return;
        }
        await validateCedula();
      } else if (formState === FORM_STATES.ID_VALIDATED) {
        if (!formData.respuesta.trim()) {
          setValidationMessage(VALIDATION_MESSAGES.EMPTY_FIELD);
          setFormState(FORM_STATES.ERROR);
          return;
        }
        await validateSecurityAnswer();
      }
    } catch (error) {
      console.error("Error en el proceso:", error);
      setFormState(FORM_STATES.ERROR);
      setValidationMessage(VALIDATION_MESSAGES.DEFAULT_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  }, [formState, formData, isSubmitting, validateCedula, validateSecurityAnswer]);

  // Computed values
  const showAnswerField = formState === FORM_STATES.ID_VALIDATED;
  const isIdValidated = formState === FORM_STATES.ID_VALIDATED;
  const showConsultButton = formState === FORM_STATES.INITIAL;
  const showIngresarButton = formState === FORM_STATES.ID_VALIDATED;
  const isConsultButtonDisabled = isSubmitting || !formData.cedula.trim();
  const isIngresarButtonDisabled = isSubmitting || !formData.respuesta.trim();

  const consultButtonText = isSubmitting ? "Consultando..." : "Consultar";
  const ingresarButtonText = isSubmitting ? "Validando..." : "Ingresar";

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column">
      <div className="row flex-grow-1">
        {/* Columna izquierda con imagen */}
        <div className="col-md-6 d-none d-md-flex align-items-center p-0">
          <img
            src={sideImage}
            alt="Imagen lateral del formulario"
            className="img-fluid h-100 object-fit-cover"
            loading="lazy"
          />
        </div>

        {/* Columna derecha con formulario */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <form
            className="w-100 px-4"
            style={{ maxWidth: "400px" }}
            onSubmit={handleSubmit}
            noValidate
            aria-label="Formulario de inicio de sesión"
          >
            <div className="text-center mb-4">
              <img 
                src={formLogo} 
                alt="Logo de la empresa" 
                className="img-fluid mb-3" 
                style={{ maxHeight: "80px" }}
                loading="lazy"
              />
              <h1 className="h3 fw-bold" style={{ color: "#3559a1" }}>
                Consulta tus Puntos
              </h1>
              <p className="text-muted">
                Ingresa tu cédula para consultar tu saldo de puntos
              </p>
            </div>

            {/* Campo Cédula */}
            <div className="mb-3">
              <InputField
                id="cedula"
                name="cedula"
                label="Cédula"
                type="text"
                className={inputClasses}
                classNameLabel={labelClasses}
                placeholder="Ej: 8-123-4567"
                value={formData.cedula}
                onChange={handleCedulaChange}
                disabled={isIdValidated || isSubmitting}
                required
                autoComplete="username"
                aria-describedby={validationMessage ? "validation-message" : undefined}
              />
            </div>

            {/* Campo Respuesta */}
            {showAnswerField && (
              <div className="mb-3">
                <InputField
                  id="respuesta"
                  name="respuesta"
                  label="Respuesta de Seguridad"
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Ingrese su respuesta"
                  value={formData.respuesta}
                  onChange={handleRespuestaChange}
                  disabled={isSubmitting}
                  required
                  autoComplete="off"
                  autoFocus
                  aria-describedby={validationMessage ? "validation-message" : undefined}
                />
              </div>
            )}

            {/* Mensaje de validación */}
            {validationMessage && (
              <div 
                id="validation-message"
                className={`alert rounded-pill ${
                  formState === FORM_STATES.ERROR ? "alert-danger" : "alert-success"
                } mb-3`}
                role="alert"
                aria-live="polite"
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
                disabled={isConsultButtonDisabled}
                aria-busy={isSubmitting}
              >
                {consultButtonText}
              </Button>
            )}

            {showIngresarButton && (
              <Button
                id="ingresarBtn"
                className="w-100 mt-3"
                type="submit"
                disabled={isIngresarButtonDisabled}
                aria-busy={isSubmitting}
              >
                {ingresarButtonText}
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
      <footer className="w-100 mt-auto">
        <img 
          className="img-fluid w-100" 
          src={imgFooter} 
          alt="Pie de página" 
          loading="lazy"
        />
      </footer>
    </div>
  );
}