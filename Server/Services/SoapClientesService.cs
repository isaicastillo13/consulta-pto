using System;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using ConsultaPto.Shared.SoapDtos;
using Microsoft.Extensions.Configuration;

namespace ConsultaPto.Server.Services
{
    public class SoapClientesService : ISoapClientesService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;

        public SoapClientesService(IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _httpClientFactory = httpClientFactory;
            _config = config;
        }

        /// <summary>
        /// Llama al método VerificarCliente del WS usando un envelope ya construido.
        /// </summary>
        public async Task<string> VerificarClienteRawAsync(string soapEnvelope)
        {
            var client = _httpClientFactory.CreateClient("SoapClientes");

            var content = new StringContent(soapEnvelope, Encoding.UTF8, "application/soap+xml");
            content.Headers.ContentType.CharSet = "utf-8";
            content.Headers.ContentType.Parameters.Add(
                new NameValueHeaderValue("action", "http://wsposite.smrey.net/VerificarCliente"));

            var response = await client.PostAsync("", content);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }

        /// <summary>
        /// Lógica de alto nivel para VerificarCliente (por cédula).
        /// </summary>
        public async Task<VerificarClienteResponseDto> VerificarClienteAsync(VerificarClienteRequestDto request)
        {
            // 1) Datos fijos desde config
            var usuario = _config["SoapServices:Clientes:Usuario"];
            var clave = _config["SoapServices:Clientes:Clave"];
            var dominio = _config["SoapServices:Clientes:Dominio"];
            var tipoTerminal = _config["SoapServices:Clientes:TipoTerminal"] ?? "5";

            // 2) Fecha con el formato que pide el WS
            var fecha = DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss tt", CultureInfo.InvariantCulture);

            // 3) Construimos la parte <PeticionVerificarCliente>...
            var innerXml = $@"
<PeticionVerificarCliente xmlns=""http://wsposite.smrey.net/"">
  <Flag>00</Flag>
  <Credencial>
    <Usuario>{usuario}</Usuario>
    <Clave>{clave}</Clave>
    <Dominio>{dominio}</Dominio>
  </Credencial>
  <TipoTerminal>{tipoTerminal}</TipoTerminal>
  <Fecha>{fecha}</Fecha>
  <NumeroTarjeta>0</NumeroTarjeta>
  <Ididentificacion>{request.Documento}</Ididentificacion>
  <TipoIdidentificacion>{request.TipoDocumento}</TipoIdidentificacion>
</PeticionVerificarCliente>";

            // 4) Lo envolvemos en el envelope SOAP 1.2
            var soapEnvelope = $@"
<soap:Envelope xmlns:soap=""http://www.w3.org/2003/05/soap-envelope"" xmlns:wsp=""http://wsposite.smrey.net/"">
  <soap:Header/>
  <soap:Body>
    <wsp:VerificarCliente>
      <wsp:Peticion>
        {innerXml}
      </wsp:Peticion>
    </wsp:VerificarCliente>
  </soap:Body>
</soap:Envelope>";

            // 5) Enviamos al WS (reutilizamos el método raw)
            var responseXml = await VerificarClienteRawAsync(soapEnvelope);

            // 6) Parseamos la respuesta
            return ParseVerificarClienteResponse(responseXml);
        }

        /// <summary>
        /// Segunda llamada: ConsultarCliente, usando NúmeroCliente y NúmeroCuenta.
        /// </summary>
        public async Task<ConsultarClienteResponseDto> ConsultarClienteAsync(ConsultarClienteRequestDto request)
        {
            var usuario = _config["SoapServices:Clientes:Usuario"];
            var clave = _config["SoapServices:Clientes:Clave"];
            var dominio = _config["SoapServices:Clientes:Dominio"];
            var tipoTerminal = _config["SoapServices:Clientes:TipoTerminal"] ?? "5";

            var fecha = DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss tt", CultureInfo.InvariantCulture);

            var innerXml = $@"
<PeticionConsultarCliente xmlns=""http://wsposite.smrey.net/"">
  <Flag>01</Flag>
  <Credencial>
    <Usuario>{usuario}</Usuario>
    <Clave>{clave}</Clave>
    <Dominio>{dominio}</Dominio>
  </Credencial>
  <TipoTerminal>{tipoTerminal}</TipoTerminal>
  <Fecha>{fecha}</Fecha>

  <NumeroCliente>{request.NumeroCliente}</NumeroCliente>
  <NumeroCuenta>{request.NumeroCuenta}</NumeroCuenta>
  <NumeroTarjeta>0</NumeroTarjeta>

</PeticionConsultarCliente>";

            var soapEnvelope = $@"
<soap:Envelope xmlns:soap=""http://www.w3.org/2003/05/soap-envelope"" xmlns:wsp=""http://wsposite.smrey.net/"">
  <soap:Header/>
  <soap:Body>
    <wsp:ConsultarCliente>
      <wsp:Peticion>
        {innerXml}
      </wsp:Peticion>
    </wsp:ConsultarCliente>
  </soap:Body>
</soap:Envelope>";

            var client = _httpClientFactory.CreateClient("SoapClientes");

            var content = new StringContent(soapEnvelope, Encoding.UTF8, "application/soap+xml");
            content.Headers.ContentType.CharSet = "utf-8";
            content.Headers.ContentType.Parameters.Add(
                new NameValueHeaderValue("action", "http://wsposite.smrey.net/ConsultarCliente"));

            var response = await client.PostAsync("", content);
            response.EnsureSuccessStatusCode();

            var responseXml = await response.Content.ReadAsStringAsync();

            return ParseConsultarClienteResponse(responseXml);
        }

        private VerificarClienteResponseDto ParseVerificarClienteResponse(string xml)
        {
            var doc = XDocument.Parse(xml);
            XNamespace svcNs = "http://wsposite.smrey.net/";

            // Vamos al nodo <VerificarClienteResult>...
            var resultNode = doc
                .Descendants(svcNs + "VerificarClienteResult")
                .FirstOrDefault();

            if (resultNode == null)
            {
                return new VerificarClienteResponseDto
                {
                    Flag = "??",
                    CodigoRespuesta = "99",
                    Mensaje = "No se pudo interpretar la respuesta del servicio."
                };
            }

            // Dentro puede venir <RespuestaVerificarCliente> (OK) o <RespuestaMetodo> (error)
            var respuestaNode = resultNode
                .Descendants()
                .FirstOrDefault(x =>
                    x.Name.LocalName == "RespuestaVerificarCliente" ||
                    x.Name.LocalName == "RespuestaMetodo");

            if (respuestaNode == null)
            {
                return new VerificarClienteResponseDto
                {
                    Flag = "??",
                    CodigoRespuesta = "99",
                    Mensaje = "Formato inesperado de respuesta."
                };
            }

            string Get(string name) =>
                respuestaNode.Elements().FirstOrDefault(e => e.Name.LocalName == name)?.Value ?? "";

            return new VerificarClienteResponseDto
            {
                Flag = Get("Flag"),
                CodigoRespuesta = Get("CodigoRespuesta"),
                Mensaje = Get("Mensaje"),
                NumeroCliente = Get("NumeroCliente"),
                NumeroCuenta = Get("NumeroCuenta"),
                NumeroTarjeta = Get("NumeroTarjeta")
            };
        }

        private ConsultarClienteResponseDto ParseConsultarClienteResponse(string xml)
        {
            var doc = XDocument.Parse(xml);
            XNamespace svcNs = "http://wsposite.smrey.net/";

            var resultNode = doc
                .Descendants(svcNs + "ConsultarClienteResult")
                .FirstOrDefault();

            if (resultNode == null)
            {
                return new ConsultarClienteResponseDto
                {
                    Flag = "??",
                    CodigoRespuesta = "99",
                    Mensaje = "No se pudo interpretar la respuesta del servicio."
                };
            }

            var respuestaNode = resultNode
                .Descendants()
                .FirstOrDefault(x =>
                    x.Name.LocalName == "RespuestaConsultarCliente" ||
                    x.Name.LocalName == "RespuestaMetodo");

            if (respuestaNode == null)
            {
                return new ConsultarClienteResponseDto
                {
                    Flag = "??",
                    CodigoRespuesta = "99",
                    Mensaje = "Formato inesperado de respuesta."
                };
            }

            string Get(string name) =>
                respuestaNode.Elements()
                             .FirstOrDefault(e => e.Name.LocalName == name)?.Value ?? "";

            var dto = new ConsultarClienteResponseDto
            {
                Flag = Get("Flag"),
                CodigoRespuesta = Get("CodigoRespuesta"),
                Mensaje = Get("Mensaje"),

                NumeroCliente = Get("NumeroCliente"),
                NumeroCuenta = Get("NumeroCuenta"),
                NumeroTarjeta = Get("NumeroTarjeta"),

                PrimerNombre = Get("PrimerNombre"),
                SegundoNombre = Get("SegundoNombre"),
                PrimerApellido = Get("PrimerApellido"),
                SegundoApellido = Get("SegundoApellido"),

                PuntosCliente = Get("PuntosCliente"),
                StickersCliente = Get("StickersCliente"),

                CobCodigo = Get("CobCodigo"),
                CobTarjeta = Get("CobTarjeta"),
                CobCliente = Get("CobCliente")
            };

            // Guardamos TODO en DatosExtras para referencia
            foreach (var element in respuestaNode.Elements())
            {
                var key = element.Name.LocalName;

                if (key is "Flag" or "CodigoRespuesta" or "Mensaje"
                         or "NumeroCliente" or "NumeroCuenta" or "NumeroTarjeta"
                         or "PrimerNombre" or "SegundoNombre"
                         or "PrimerApellido" or "SegundoApellido"
                         or "PuntosCliente" or "StickersCliente"
                         or "CobCodigo" or "CobTarjeta" or "CobCliente")
                    continue;

                dto.DatosExtras[key] = element.Value;
            }

            return dto;
        }

    }
}
