using System.Threading.Tasks;
using ConsultaPto.Server.Services;
using ConsultaPto.Shared.SoapDtos;
using Microsoft.AspNetCore.Mvc;

namespace ConsultaPto.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesSoapController : ControllerBase
    {
        private readonly ISoapClientesService _soapClientesService;

        public ClientesSoapController(ISoapClientesService soapClientesService)
        {
            _soapClientesService = soapClientesService;
        }

        // DTO local para recibir el JSON desde el front
        public class SoapVerificarRequest
        {
            public string Documento { get; set; } = string.Empty;
            public int TipoDocumento { get; set; }
        }

        /// <summary>
        /// Endpoint viejo que verifica cliente por documento/tipo y devuelve VerificarClienteSoapResult.
        /// Lo dejamos funcionando para que UsuariosService.VerificarClienteSoapAsync siga sirviendo.
        /// </summary>
        [HttpPost("verificar-json")]
        public async Task<ActionResult<VerificarClienteSoapResult>> VerificarJson([FromBody] SoapVerificarRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Documento))
            {
                return BadRequest("Documento es requerido.");
            }

            // Mapeamos al DTO que usa el servicio SOAP tipado
            var verificarReq = new VerificarClienteRequestDto
            {
                Documento = request.Documento,
                TipoDocumento = request.TipoDocumento
            };



            var resp = await _soapClientesService.VerificarClienteAsync(verificarReq);

            // Mapeamos al DTO simple que ya usas en el cliente
            var result = new VerificarClienteSoapResult
            {
                Flag = resp.Flag,
                CodigoRespuesta = resp.CodigoRespuesta,
                Mensaje = resp.Mensaje,
                NumeroCliente = resp.NumeroCliente,
                NumeroCuenta = resp.NumeroCuenta,
                NumeroTarjeta = resp.NumeroTarjeta
            };

            return Ok(result);
        }
    }
}
