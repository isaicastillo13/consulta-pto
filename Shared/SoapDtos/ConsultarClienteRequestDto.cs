using System.Collections.Generic;

namespace ConsultaPto.Shared.SoapDtos
{
    public class ConsultarClienteRequestDto
    {
        public string NumeroCliente { get; set; } = string.Empty;
        public string NumeroCuenta { get; set; } = string.Empty;
    }
}
