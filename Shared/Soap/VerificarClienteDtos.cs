namespace ConsultaPto.Shared.SoapDtos
{
    // Lo que te manda el front
    public class VerificarClienteRequestDto
    {
        // Cédula o pasaporte
        public string Documento { get; set; } = string.Empty;

        // 0 = Cédula, 1 = Pasaporte (según el WS)
        public int TipoDocumento { get; set; }
    }

    // Lo que devolverá tu API
    public class VerificarClienteResponseDto
    {
        public string Flag { get; set; } = string.Empty;
        public string CodigoRespuesta { get; set; } = string.Empty;
        public string Mensaje { get; set; } = string.Empty;

        public string? NumeroCliente { get; set; }
        public string? NumeroCuenta { get; set; }
        public string? NumeroTarjeta { get; set; }
    }
}
