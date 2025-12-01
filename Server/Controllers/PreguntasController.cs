using ConsultaPto.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using Microsoft.Data.SqlClient;
using System.Threading.Tasks;

namespace ConsultaPto.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PreguntasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PreguntasController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("test")]
        public IActionResult TestConnection()
        {
            var connectionString = _context.Database.GetConnectionString();
            try
            {
                using var connection = new SqlConnection(connectionString);
                connection.Open();
                return Ok("✅ Conexión exitosa a la base de datos.");
            }
            catch (Exception ex)
            {
                return BadRequest($"❌ Error al conectar: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetPreguntas()
        {
            var preguntas = await _context.PreguntasSeguridad.ToListAsync();
            return Ok(preguntas);
        }
    }
}
