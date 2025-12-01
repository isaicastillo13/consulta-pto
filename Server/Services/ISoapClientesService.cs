using System.Threading.Tasks;
using ConsultaPto.Shared.SoapDtos;

namespace ConsultaPto.Server.Services
{
    public interface ISoapClientesService
    {
        // Versión tipada
        Task<VerificarClienteResponseDto> VerificarClienteAsync(VerificarClienteRequestDto request);

        // (Opcional) La versión raw que ya tenías
        Task<string> VerificarClienteRawAsync(string soapEnvelope);
    }
}
