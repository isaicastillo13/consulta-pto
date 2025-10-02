import React, { useState, useEffect, useCallback, useMemo } from "react";
import headerImage from "../assets/Header.png";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import NavLink from "../components/NavLink";
import Button from "../components/Button";
import { userService } from "../services/api";
import { useNavigate } from "react-router-dom";

// Constantes
const VALIDATION_MESSAGES = {
  SUCCESS: "¡Registro exitoso! Redirigiendo...",
  ERROR_GENERIC: "Ha ocurrido un error. Por favor, intenta de nuevo.",
  ERROR_DUPLICATE: "Esta cédula ya está registrada.",
  ERROR_INVALID_DATA: "Por favor, verifica los datos ingresados.",
  LOADING_QUESTIONS: "Cargando preguntas...",
  ERROR_LOADING_QUESTIONS: "Error al cargar preguntas de seguridad."
};

const FORM_FIELDS = {
  NAME: "name",
  CEDULA: "cedula",
  PREGUNTA: "pregunta",
  RESPUESTA: "respuesta"
};

const INITIAL_FORM_STATE = {
  [FORM_FIELDS.NAME]: "",
  [FORM_FIELDS.CEDULA]: "",
  [FORM_FIELDS.PREGUNTA]: "",
  [FORM_FIELDS.RESPUESTA]: ""
};

export default function Register() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  // Cargar preguntas de seguridad al montar el componente
  useEffect(() => {
    let isMounted = true;

    const loadQuestions = async () => {
      try {
        const response = await userService.getSecurityQuestions();
        if (isMounted) {
          setSecurityQuestions(response);
          setLoadingQuestions(false);
        }
      } catch (error) {
        console.error("Error cargando preguntas:", error);
        if (isMounted) {
          setError(VALIDATION_MESSAGES.ERROR_LOADING_QUESTIONS);
          setLoadingQuestions(false);
        }
      }
    };

    loadQuestions();

    return () => {
      isMounted = false;
    };
  }, []);

  // Convertir preguntas al formato de SelectField (memoizado)
  const questionOptions = useMemo(() => {
    return securityQuestions.map(question => ({
      value: question.id,
      label: question.preguntas
    }));
  }, [securityQuestions]);

  // Validación de formato de cédula
  const isValidCedulaFormat = useCallback((cedula) => {
    // Ajusta según el formato de tu país (ej: Panamá: 8-123-4567)
    return cedula.trim().length >= 6 && /^[0-9-]+$/.test(cedula);
  }, []);

  // Validación de campos individuales
  const validateField = useCallback((name, value) => {
    switch (name) {
      case FORM_FIELDS.NAME:
        if (!value.trim()) return "El nombre es requerido";
        if (value.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "El nombre solo debe contener letras";
        return null;

      case FORM_FIELDS.CEDULA:
        if (!value.trim()) return "La cédula es requerida";
        if (!isValidCedulaFormat(value)) return "Formato de cédula inválido";
        return null;

      case FORM_FIELDS.PREGUNTA:
        if (!value) return "Debes seleccionar una pregunta de seguridad";
        return null;

      case FORM_FIELDS.RESPUESTA:
        if (!value.trim()) return "La respuesta es requerida";
        if (value.trim().length < 2) return "La respuesta debe tener al menos 2 caracteres";
        return null;

      default:
        return null;
    }
  }, [isValidCedulaFormat]);

  // Validar formulario completo
  const validateForm = useCallback(() => {
    const errors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, validateField]);

  // Manejar cambios en los campos (memoizado)
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo al escribir
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Limpiar mensaje de error general
    if (error) setError(null);
  }, [fieldErrors, error]);

  // Manejar envío del formulario (memoizado)
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    
    // Prevenir múltiples envíos
    if (loading) return;

    // Validar formulario
    if (!validateForm()) {
      setError(VALIDATION_MESSAGES.ERROR_INVALID_DATA);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await userService.register(formData);
      console.log("Usuario registrado exitosamente:", result);
      
      setSuccess(true);
      setError(null);
      
      // Redirigir después de mostrar mensaje de éxito
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
      
    } catch (error) {
      console.error("Error en registro:", error);
      
      // Manejo específico de errores
      let errorMessage = VALIDATION_MESSAGES.ERROR_GENERIC;
      
      if (error.response?.status === 409 || error.response?.data?.message?.includes("existe")) {
        errorMessage = VALIDATION_MESSAGES.ERROR_DUPLICATE;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [loading, validateForm, formData, navigate]);

  // Computed values
  const isFormValid = useMemo(() => {
    return Object.values(formData).every(value => value.trim() !== "") &&
           Object.keys(fieldErrors).length === 0;
  }, [formData, fieldErrors]);

  const submitButtonDisabled = loading || !isFormValid || loadingQuestions || success;
  const submitButtonText = loading ? "Registrando..." : success ? "¡Registrado!" : "Registrarse";

  return (
    <div className="container py-5" style={{ color: "#454545" }}>
      <div className="mb-4 text-center">
        <img
          className="img-fluid"
          src={headerImage}
          alt="Logo Punto de Oro"
          loading="lazy"
          style={{ maxHeight: "120px" }}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="row g-4 rounded-4 p-4 border-secondary-subtle shadow-sm"
        noValidate
        aria-label="Formulario de registro"
      >
        {/* Mensaje de éxito/error global */}
        {(error || success) && (
          <div className="col-12">
            <div 
              className={`alert ${success ? "alert-success" : "alert-danger"} mb-0`}
              role="alert"
              aria-live="polite"
            >
              {success ? VALIDATION_MESSAGES.SUCCESS : error}
            </div>
          </div>
        )}

        {/* Columna izquierda */}
        <div className="col-12 col-md-6">
          <h1 className="h4 fw-bold" style={{ color: "#3559a1" }}>
            Registro
          </h1>
          <p className="mb-4">
            ¿Ya estás registrado?{" "}
            <NavLink
              to="/"
              className="text-decoration-none fw-bold"
            >
              Iniciar sesión
            </NavLink>
          </p>

          <div className="mb-3">
            <InputField
              id="name"
              name={FORM_FIELDS.NAME}
              value={formData.name}
              label="Nombre Completo"
              className="form-control rounded-pill"
              placeholder="Ej: Juan Pérez"
              required
              onChange={handleChange}
              disabled={loading || success}
              autoComplete="name"
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
            />
            {fieldErrors.name && (
              <div id="name-error" className="text-danger small mt-1">
                {fieldErrors.name}
              </div>
            )}
          </div>

          <div className="mb-3">
            <InputField
              id="cedula"
              name={FORM_FIELDS.CEDULA}
              value={formData.cedula}
              label="Cédula"
              className="form-control rounded-pill"
              placeholder="Ej: 8-123-4567"
              required
              onChange={handleChange}
              disabled={loading || success}
              autoComplete="off"
              aria-invalid={!!fieldErrors.cedula}
              aria-describedby={fieldErrors.cedula ? "cedula-error" : undefined}
            />
            {fieldErrors.cedula && (
              <div id="cedula-error" className="text-danger small mt-1">
                {fieldErrors.cedula}
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha */}
        <div className="col-12 col-md-6">
          <h2 className="h4 fw-bold" style={{ color: "#3559a1" }}>
            Pregunta de Seguridad
          </h2>
          <p className="mb-4">
            Selecciona una pregunta y proporciona tu respuesta.
          </p>

          <div className="mb-3">
            <SelectField
              id="pregunta"
              name={FORM_FIELDS.PREGUNTA}
              value={formData.pregunta}
              onChange={handleChange}
              className="form-select form-select-sm rounded-pill py-3"
              ariaLabel="Seleccionar pregunta de seguridad"
              options={questionOptions}
              defaultOption={
                loadingQuestions 
                  ? VALIDATION_MESSAGES.LOADING_QUESTIONS 
                  : "Seleccione su pregunta de seguridad"
              }
              disabled={loading || loadingQuestions || success}
              required
              aria-invalid={!!fieldErrors.pregunta}
              aria-describedby={fieldErrors.pregunta ? "pregunta-error" : undefined}
            />
            {fieldErrors.pregunta && (
              <div id="pregunta-error" className="text-danger small mt-1">
                {fieldErrors.pregunta}
              </div>
            )}
          </div>

          <div className="mb-3">
            <InputField
              id="respuesta"
              name={FORM_FIELDS.RESPUESTA}
              value={formData.respuesta}
              onChange={handleChange}
              label="Respuesta"
              className="form-control rounded-pill"
              placeholder="Ingrese su respuesta"
              required
              disabled={loading || !formData.pregunta || success}
              autoComplete="off"
              aria-invalid={!!fieldErrors.respuesta}
              aria-describedby={fieldErrors.respuesta ? "respuesta-error" : undefined}
            />
            {fieldErrors.respuesta && (
              <div id="respuesta-error" className="text-danger small mt-1">
                {fieldErrors.respuesta}
              </div>
            )}
          </div>

          <Button
            id="registerButton"
            className="mt-4 w-100"
            disabled={submitButtonDisabled}
            type="submit"
            aria-busy={loading}
          >
            {submitButtonText}
          </Button>

          {!isFormValid && !loading && (
            <p className="text-muted small text-center mt-2">
              Completa todos los campos para continuar
            </p>
          )}
        </div>
      </form>
    </div>
  );
}