using System.Collections.Generic;

namespace ConsultaPto.Shared.SoapDtos
{
    public class ConsultarClienteResponseDto
    {
        public string Flag { get; set; } = string.Empty;
        public string CodigoRespuesta { get; set; } = string.Empty;
        public string Mensaje { get; set; } = string.Empty;

        public string NumeroCliente { get; set; } = string.Empty;
        public string NumeroCuenta { get; set; } = string.Empty;
        public string NumeroTarjeta { get; set; } = string.Empty;

        // 🔹 Datos del cliente
        public string PrimerNombre { get; set; } = string.Empty;
        public string SegundoNombre { get; set; } = string.Empty;
        public string PrimerApellido { get; set; } = string.Empty;
        public string SegundoApellido { get; set; } = string.Empty;

        public string PuntosCliente { get; set; } = string.Empty;
        public string StickersCliente { get; set; } = string.Empty;

        public string CobCodigo { get; set; } = string.Empty;
        public string CobTarjeta { get; set; } = string.Empty;
        public string CobCliente { get; set; } = string.Empty;

        public Dictionary<string, string> DatosExtras { get; set; } = new();
    }
}
