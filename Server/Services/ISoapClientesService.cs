using System.Threading.Tasks;
using ConsultaPto.Shared.SoapDtos;

namespace ConsultaPto.Server.Services
{
    public interface ISoapClientesService
    {
        Task<VerificarClienteResponseDto> VerificarClienteAsync(VerificarClienteRequestDto request);
        Task<string> VerificarClienteRawAsync(string soapEnvelope);

        // Nuevo:
        Task<ConsultarClienteResponseDto> ConsultarClienteAsync(ConsultarClienteRequestDto request);
    }

}
