const API_BASE_URL = "http://localhost:5001/api";

export const userService = {
  // Obtener preguntas de seguridad
  async getSecurityQuestions() {
    const response = await fetch(`${API_BASE_URL}/security/questions`);
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
  async validateId(data){
    const response = await fetch(`${API_BASE_URL}/auth/validateid`, {
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

  // async generateToken(userData){
  //   const response = await fetch (`${API_BASE_URL}/auth/generate-token`),{
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });

  //   if (!response.ok) {
  //     const errorData = await response.json();
  //     throw new Error(errorData.error || "Error al generar token");
  //   }
  //   return response.json();
  // }
};
