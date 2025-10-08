const API_BASE_URL = "http://localhost:5001/api";

export const userService = {
  // Obtener preguntas de seguridad
  async getSecurityQuestions() {
    const response = await fetch(`${API_BASE_URL}/security-questions`);
    if (!response.ok) {
      throw new Error("Error al obtener preguntas de seguridad");
    }
    return response.json();
  },

  // Registrar usuario
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al registrar usuario");
    }
    return response.json();
  },

  // Login usuario
  async validateUserByCedula(data) {
    const response = await fetch(`${API_BASE_URL}/auth/validate-cedula`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al validar cédula");
    }
    return response.json();
  },

  async validateSecurityAnswer(data) {
    const response = await fetch(`${API_BASE_URL}/auth/validate-security`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al validar cédula");
    }

    const dataRes = await response.json();
    localStorage.setItem("token", dataRes.token); // Guardar el token en localStorage
    return dataRes;
  },

  async verifyToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No hay token");
    }

    const response = await fetch(`${API_BASE_URL}/users/verify-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();

      if (errorData.expired) {
        localStorage.removeItem("token");
        throw new Error("Token expirado");
      }

      throw new Error(errorData.error || "Token inválido");
    }

    return response.json();
  },

  async verificarCliente(cedula) {
    const response = await fetch(`${API_BASE_URL}/cliente/verificarcliente`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identificacion: cedula,
        fecha: formatFechaSOAP(),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Error al verificar cliente");
    }

    return data.data; // ✅ devolvemos la data, no la guardamos aquí
  },

  async consultarCliente({ numeroCliente, numeroCuenta }) {
    const response = await fetch(`${API_BASE_URL}/cliente/consultarcliente`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        numeroCliente,
        numeroCuenta,
        fecha: formatFechaSOAP(),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Error al consultar cliente");
    }

    return data.data;
  },
};

function formatFechaSOAP(date = new Date()) {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  const year = date.getFullYear();

  day = day.toString().padStart(2, "0");
  month = month.toString().padStart(2, "0");

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours || 12; // el 0 se transforma en 12
  const formattedHours = hours.toString().padStart(2, "0");

  return `${month}/${day}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
}
