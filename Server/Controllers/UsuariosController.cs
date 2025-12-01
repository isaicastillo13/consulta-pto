using ConsultaPto.Server.Data;
using ConsultaPto.Shared.Models;
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

        public UsuariosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ 1️⃣ REGISTRO de usuario (ya lo usas)
        [HttpPost]
        public async Task<IActionResult> RegistrarUsuario([FromBody] Usuario usuario)
        {
            if (usuario == null)
                return BadRequest("Datos inválidos.");

            // Encriptar la respuesta con hash antes de guardar
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
                return BadRequest("Debe proporcionar una cédula.");

            var usuario = await _context.Usuarios
                .Include(u => u.PreguntaSeguridad)
                .FirstOrDefaultAsync(u => u.Cedula == cedula);

            if (usuario == null)
                return NotFound(new { message = "Usuario no encontrado" });

            // Devolver sin respuesta (por seguridad)
            usuario.Respuesta = string.Empty;
            return Ok(usuario);
        }

        // ✅ 3️⃣ VALIDACIÓN de LOGIN (para el login - Paso 2)
        [HttpPost("validar")]
        public async Task<IActionResult> ValidarLogin([FromBody] LoginRequest login)
        {
            if (login == null || string.IsNullOrEmpty(login.Cedula) || string.IsNullOrEmpty(login.Respuesta))
                return BadRequest("Datos incompletos.");

            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Cedula == login.Cedula);

            if (usuario == null)
                return NotFound(new { message = "Usuario no encontrado" });

            // Verificar hash
            bool respuestaValida = VerificarHash(login.Respuesta!, usuario.Respuesta!);

            if (!respuestaValida)
                return Unauthorized(new { message = "Respuesta incorrecta" });

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
