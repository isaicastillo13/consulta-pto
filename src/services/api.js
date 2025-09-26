const API_BASE_URL = 'http://localhost:3000/api'

export const userService = {
  // Registrar usuario
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al registrar usuario')
    }

    return response.json()
  },

  // Obtener preguntas de seguridad
  async getSecurityQuestions() {
    const response = await fetch(`${API_BASE_URL}/users/security-questions`)
    if (!response.ok) {
      throw new Error('Error al obtener preguntas de seguridad')
    }
    return response.json()
  }
}