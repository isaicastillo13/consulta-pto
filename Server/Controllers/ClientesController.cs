using System.Threading.Tasks;
using ConsultaPto.Server.Services;
using ConsultaPto.Shared.SoapDtos;
using Microsoft.AspNetCore.Mvc;

namespace ConsultaPto.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly ISoapClientesService _soapClientesService;

        public ClientesController(ISoapClientesService soapClientesService)
        {
            _soapClientesService = soapClientesService;
        }

        /// <summary>
        /// Endpoint para el dashboard:
        /// 1) Verifica cliente por documento/tipo
        /// 2) Con NumeroCliente y NumeroCuenta llama a ConsultarCliente
        /// 3) Devuelve todo lo necesario para el dashboard.
        /// </summary>
        [HttpPost("dashboard")]
        public async Task<ActionResult<ConsultaDashboardResponseDto>> ConsultarDashboard(
            [FromBody] ConsultaDashboardRequestDto request)
        {
            if (request is null || string.IsNullOrWhiteSpace(request.Documento))
            {
                return BadRequest("Documento es requerido.");
            }

            // 1) Verificar cliente primero (por cédula/tipo)
            // ...
            var verificarReq = new VerificarClienteRequestDto
            {
                Documento = request.Documento,
                TipoDocumento = int.TryParse(request.TipoDocumento, out var tipoDoc) ? tipoDoc : 0
            };
            // ...
            var verificarResp = await _soapClientesService.VerificarClienteAsync(verificarReq);

            // Aquí puedes ajustar la lógica según las reglas reales:
            // asumo que CodigoRespuesta "00" = OK (ajusta si es otro código)
            if (verificarResp.CodigoRespuesta != "00")
            {
                return Ok(new ConsultaDashboardResponseDto
                {
                    Flag = verificarResp.Flag,
                    CodigoRespuesta = verificarResp.CodigoRespuesta,
                    Mensaje = verificarResp.Mensaje,
                    NumeroCliente = verificarResp.NumeroCliente ?? string.Empty,
                    NumeroCuenta = verificarResp.NumeroCuenta ?? string.Empty,
                    NumeroTarjeta = verificarResp.NumeroTarjeta ?? string.Empty
                });
            }

            // Validar que tengamos NumeroCliente / NumeroCuenta
            if (string.IsNullOrWhiteSpace(verificarResp.NumeroCliente) ||
                string.IsNullOrWhiteSpace(verificarResp.NumeroCuenta))
            {
                return Ok(new ConsultaDashboardResponseDto
                {
                    Flag = verificarResp.Flag,
                    CodigoRespuesta = "98",
                    Mensaje = "El servicio VerificarCliente no devolvió Número de Cliente o Cuenta.",
                    NumeroCliente = verificarResp.NumeroCliente ?? string.Empty,
                    NumeroCuenta = verificarResp.NumeroCuenta ?? string.Empty,
                    NumeroTarjeta = verificarResp.NumeroTarjeta ?? string.Empty
                });
            }

            // 2) ConsultarCliente usando NumeroCliente / NumeroCuenta
            var consultarReq = new ConsultarClienteRequestDto
            {
                NumeroCliente = verificarResp.NumeroCliente!,
                NumeroCuenta = verificarResp.NumeroCuenta!
            };

            var consultarResp = await _soapClientesService.ConsultarClienteAsync(consultarReq);

            // 3) Armar la respuesta consolidada para el dash
            var dto = new ConsultaDashboardResponseDto
{
    Flag = consultarResp.Flag,
    CodigoRespuesta = consultarResp.CodigoRespuesta,
    Mensaje = consultarResp.Mensaje,

    NumeroCliente = consultarResp.NumeroCliente,
    NumeroCuenta = consultarResp.NumeroCuenta,
    NumeroTarjeta = consultarResp.NumeroTarjeta,

    PrimerNombre = consultarResp.PrimerNombre,
    PrimerApellido = consultarResp.PrimerApellido,

    PuntosCliente = consultarResp.PuntosCliente,
    StickersCliente = consultarResp.StickersCliente,

    CobCodigo = consultarResp.CobCodigo,
    CobTarjeta = consultarResp.CobTarjeta,
    CobCliente = consultarResp.CobCliente,

    DatosExtras = consultarResp.DatosExtras
};


            return Ok(dto);
        }
    }
}
