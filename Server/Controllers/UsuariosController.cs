using ConsultaPto.Server.Data;
using ConsultaPto.Server.Services;
using ConsultaPto.Shared.Models;
using ConsultaPto.Shared.SoapDtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace ConsultaPto.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ISoapClientesService _soapClientesService;

        public UsuariosController(
            ApplicationDbContext context,
            ISoapClientesService soapClientesService)
        {
            _context = context;
            _soapClientesService = soapClientesService;
        }

        // ✅ 1️⃣ REGISTRO de usuario
        [HttpPost]
        public async Task<IActionResult> RegistrarUsuario([FromBody] Usuario usuario)
        {
            if (usuario == null)
                return BadRequest("Datos inválidos.");

            // 1️⃣ Validar si la cédula ya existe
            var existe = await _context.Usuarios.AnyAsync(u => u.Cedula == usuario.Cedula);

            if (existe)
            {
                return Conflict(new { message = "La cédula ya está registrada." });
            }

            // 2️⃣ Encriptar la respuesta
            usuario.Respuesta = HashConSalt(usuario.Respuesta!);

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuario registrado correctamente" });
        }

        // ✅ 2️⃣ CONSULTA por CÉDULA (para el login - Paso 1)
        [HttpGet("buscar")]
        public async Task<IActionResult> BuscarUsuario([FromQuery] string cedula)
        {
            if (string.IsNullOrEmpty(cedula))
                return BadRequest("Debe proporcionar un documento.");

            var usuario = await _context.Usuarios
                .Include(u => u.PreguntaSeguridad)
                .FirstOrDefaultAsync(u => u.Cedula == cedula);

            if (usuario == null)
                return NotFound(new { message = "Usuario no encontrado" });

            // Devolver sin respuesta (por seguridad)
            usuario.Respuesta = string.Empty;
            return Ok(usuario);
        }

        // ✅ 3️⃣ VALIDACIÓN de LOGIN (respuesta + correo vs SOAP)
        [HttpPost("validar")]
        public async Task<IActionResult> ValidarLogin([FromBody] LoginRequest login)
        {
            if (login == null ||
                string.IsNullOrWhiteSpace(login.Cedula) ||
                string.IsNullOrWhiteSpace(login.Respuesta) ||
                string.IsNullOrWhiteSpace(login.Correo))
            {
                return BadRequest("Datos incompletos.");
            }

            // 1) Validar contra la base de datos (pregunta de seguridad)
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Cedula == login.Cedula);

            if (usuario == null)
                return NotFound(new { message = "Usuario no encontrado" });

            bool respuestaValida = VerificarHash(login.Respuesta!, usuario.Respuesta!);

            if (!respuestaValida)
                return Unauthorized(new { message = "Respuesta incorrecta." });

            // 2) Validación adicional contra el WS de Punto de Oro (correo)
            //    login.TipoDocumento viene del cliente: "0" = cédula, "1" = pasaporte
            int tipoDocumento;
            if (!int.TryParse(login.TipoDocumento, out tipoDocumento))
            {
                tipoDocumento = 0; // por defecto, cédula
            }

            // 2.1) VerificarCliente (por documento)
            var verificarReq = new VerificarClienteRequestDto
            {
                Documento = login.Cedula,
                TipoDocumento = tipoDocumento
            };

            var verificarResp = await _soapClientesService.VerificarClienteAsync(verificarReq);

            if (verificarResp.CodigoRespuesta != "00")
            {
                return Unauthorized(new
                {
                    message = "No se pudo validar el cliente en Punto de Oro.",
                    codigo = verificarResp.CodigoRespuesta,
                    detalle = verificarResp.Mensaje
                });
            }

            if (string.IsNullOrWhiteSpace(verificarResp.NumeroCliente) ||
                string.IsNullOrWhiteSpace(verificarResp.NumeroCuenta))
            {
                return Unauthorized(new
                {
                    message = "El servicio VerificarCliente no devolvió número de cliente o cuenta."
                });
            }

            // 2.2) ConsultarCliente (para obtener datos completos, incluido el correo)
            var consultarReq = new ConsultarClienteRequestDto
            {
                NumeroCliente = verificarResp.NumeroCliente!,
                NumeroCuenta = verificarResp.NumeroCuenta!
            };

            var consultarResp = await _soapClientesService.ConsultarClienteAsync(consultarReq);

            if (consultarResp.CodigoRespuesta != "00")
            {
                return Unauthorized(new
                {
                    message = "No se pudo obtener la información del cliente desde Punto de Oro.",
                    codigo = consultarResp.CodigoRespuesta,
                    detalle = consultarResp.Mensaje
                });
            }

            // 2.3) Obtener el correo desde la respuesta SOAP
            string? correoWs = null;

            // Si en tu DTO ya agregas Correo como propiedad, úsala:
            // correoWs = consultarResp.Correo;

            // Como lo tenemos en DatosExtras:
            if (consultarResp.DatosExtras != null &&
                consultarResp.DatosExtras.TryGetValue("Correo", out var correoExtra))
            {
                correoWs = correoExtra;
            }

            var correoFormulario = (login.Correo ?? "").Trim().ToLowerInvariant();
            var correoWsNormalizado = (correoWs ?? "").Trim().ToLowerInvariant();

            if (string.IsNullOrEmpty(correoWsNormalizado) ||
                correoWsNormalizado != correoFormulario)
            {
                return Unauthorized(new
                {
                    message = "El correo no coincide con el registrado en el sistema Punto de Oro."
                });
            }

            // ✅ Si llegamos aquí: respuesta correcta + correo coincide + cliente válido en WS
            return Ok(new { message = "Login exitoso" });
        }

        // 🧩 FUNCIONES AUXILIARES (hash con salt)
        private string HashConSalt(string input)
        {
            using var sha256 = SHA256.Create();
            var salt = "CONSULTAPTO-2025"; // puedes mover esto a configuración
            var bytes = Encoding.UTF8.GetBytes(input + salt);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        private bool VerificarHash(string input, string hashGuardado)
        {
            var nuevoHash = HashConSalt(input);
            return nuevoHash == hashGuardado;
        }
    }
}
