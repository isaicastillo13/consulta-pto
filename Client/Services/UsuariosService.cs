using System.Net;
using System.Net.Http.Json;
using ConsultaPto.Shared.Models;

namespace ConsultaPto.Client.Services
{
    public class UsuariosService
    {
        private readonly HttpClient _http;

        public UsuariosService(HttpClient http)
        {
            _http = http;
        }

        // 🔹 Obtener todas las preguntas de seguridad (para Register.razor)
        public async Task<List<PreguntaSeguridad>> GetPreguntas()
        {
            var result = await _http.GetFromJsonAsync<List<PreguntaSeguridad>>("api/preguntas");
            return result ?? new List<PreguntaSeguridad>();
        }

        // 🔹 Registrar un nuevo usuario (para Register.razor)
        public async Task RegistrarUsuario(Usuario usuario)
        {
            var response = await _http.PostAsJsonAsync("api/usuarios", usuario);
            response.EnsureSuccessStatusCode();
        }

        // 🔹 Buscar usuario por cédula (para login - Paso 1)
        //     Devuelve null si la cédula no existe
        public async Task<Usuario?> BuscarUsuarioPorCedula(string cedula)
        {
            // ⚠️ URL RELATIVA, SIN PUERTO
            var response = await _http.GetAsync($"api/usuarios/buscar?cedula={Uri.EscapeDataString(cedula)}");

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                // usuario no encontrado
                return null;
            }

            // si hay otro error (500, 400, etc.) que explote para verlo en depuración
            response.EnsureSuccessStatusCode();

            // 200 OK
            return await response.Content.ReadFromJsonAsync<Usuario>();
        }

        // 🔹 Validar login (para login - Paso 2)
        public async Task<bool> ValidarLogin(LoginRequest login)
        {
            var response = await _http.PostAsJsonAsync("api/usuarios/validar", login);
            return response.IsSuccessStatusCode;
        }
    }
}
