using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsultaPto.Shared.SoapDtos { public class VerificarClienteSoapResult { public string Flag { get; set; } = string.Empty; public string CodigoRespuesta { get; set; } = string.Empty; public string Mensaje { get; set; } = string.Empty; public string? NumeroCliente { get; set; } public string? NumeroCuenta { get; set; } public string? NumeroTarjeta { get; set; } } }
