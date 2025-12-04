using ConsultaPto.Shared.Models;
using ConsultaPto.Shared.SoapDtos;
using System.Net;
using System.Net.Http.Json;

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

        // 🔹 Registrar un nuevo usuario (versión simple, si la sigues usando en otros lados)
        public async Task RegistrarUsuario(Usuario usuario)
        {
            var response = await _http.PostAsJsonAsync("api/usuarios", usuario);
            response.EnsureSuccessStatusCode();
        }

        // 🔹 NUEVO: Registrar usuario devolviendo la HttpResponseMessage
        //     para poder inspeccionar StatusCode (409, 200, etc.) en Register.razor
        public async Task<HttpResponseMessage> RegistrarUsuarioResponse(Usuario usuario)
        {
            return await _http.PostAsJsonAsync("api/usuarios", usuario);
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

        // 🔹 Llamar al endpoint actual que tenías para VerificarCliente via JSON
        public async Task<VerificarClienteSoapResult?> VerificarClienteSoapAsync(string documento, int tipoDocumento)
        {
            var requestBody = new
            {
                documento,
                tipoDocumento
            };

            var response = await _http.PostAsJsonAsync("api/ClientesSoap/verificar-json", requestBody);

            if (!response.IsSuccessStatusCode)
            {
                // Podrías loggear aquí si quieres más detalle
                return null;
            }

            return await response.Content.ReadFromJsonAsync<VerificarClienteSoapResult>();
        }

        // 🔹 Nuevo: consumir el endpoint unificado del dashboard
        //      POST api/clientes/dashboard
        public async Task<ConsultaDashboardResponseDto?> ConsultarDashboardAsync(string documento, string tipoDocumento)
        {
            var request = new ConsultaDashboardRequestDto
            {
                Documento = documento,
                TipoDocumento = tipoDocumento
            };

            var response = await _http.PostAsJsonAsync("api/clientes/dashboard", request);

            if (!response.IsSuccessStatusCode)
            {
                // Manejo simple: null = algo falló
                return null;
            }

            return await response.Content.ReadFromJsonAsync<ConsultaDashboardResponseDto>();
        }
    }
}
