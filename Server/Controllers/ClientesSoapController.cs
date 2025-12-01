using ConsultaPto.Server.Services;
using ConsultaPto.Shared.SoapDtos;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace ConsultaPto.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesSoapController : ControllerBase
    {
        private readonly ISoapClientesService _soap;

        public ClientesSoapController(ISoapClientesService soap)
        {
            _soap = soap;
        }

        // ✅ Endpoint JSON limpio
        [HttpPost("verificar-json")]
        public async Task<ActionResult<VerificarClienteResponseDto>> VerificarClienteJson(
            [FromBody] VerificarClienteRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _soap.VerificarClienteAsync(dto);
            return Ok(result);
        }

        // (Opcional) Sigues teniendo el raw para debug
        [HttpPost("verificar")]
        [Consumes("text/plain", "application/xml", "text/xml")]
        public async Task<IActionResult> VerificarCliente()
        {
            using var reader = new StreamReader(Request.Body, Encoding.UTF8);
            var xmlPeticion = await reader.ReadToEndAsync();

            if (string.IsNullOrWhiteSpace(xmlPeticion))
                return BadRequest("El cuerpo de la petición está vacío.");

            var result = await _soap.VerificarClienteRawAsync(xmlPeticion);
            return Content(result, "text/xml");
        }
    }
}
