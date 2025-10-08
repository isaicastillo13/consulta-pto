// src/services/cliente.services.js
import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";
import dotenv from "dotenv";
dotenv.config();

/**
 * Construye el XML SOAP completo para VerificarCliente
 */
function buildVerificarClienteXML({ identificacion, fecha }) {
  return `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:wsp="http://wsposite.smrey.net/">
    <soap:Header/>
    <soap:Body>
      <wsp:VerificarCliente>
        <wsp:Peticion>
          <PeticionVerificarCliente xmlns="http://wsposite.smrey.net/">
            <Flag>00</Flag>
            <Credencial>
              <Usuario>${process.env.USUARIO_SOAP}</Usuario>
              <Clave>${process.env.CLAVE_SOAP}</Clave>
              <Dominio>${process.env.DOMINIO_SOAP}</Dominio>
            </Credencial>
            <TipoTerminal>5</TipoTerminal>
            <Fecha>${fecha}</Fecha>
            <NumeroTarjeta></NumeroTarjeta>
            <Ididentificacion>${identificacion}</Ididentificacion>
            <TipoIdidentificacion>0</TipoIdidentificacion>
          </PeticionVerificarCliente>
        </wsp:Peticion>
      </wsp:VerificarCliente>
    </soap:Body>
  </soap:Envelope>`;
}

function buildConsultarClienteXML({ numeroCliente, numeroCuenta, fecha }) {
  console.log("Construyendo XML para ConsultarCliente con:", { numeroCliente, numeroCuenta, fecha });
  return `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:wsp="http://wsposite.smrey.net/">
    <soap:Header/>
    <soap:Body>
      <wsp:ConsultarCliente>
        <wsp:Peticion>
          <PeticionConsultarCliente xmlns="http://wsposite.smrey.net/">
            <Flag>01</Flag>
            <Credencial>
              <Usuario>${process.env.USUARIO_SOAP}</Usuario>
              <Clave>${process.env.CLAVE_SOAP}</Clave>
              <Dominio>${process.env.DOMINIO_SOAP}</Dominio>
            </Credencial>
            <TipoTerminal>5</TipoTerminal>
            <Fecha>${fecha}</Fecha>
            <NumeroCliente>${numeroCliente}</NumeroCliente>
            <NumeroCuenta>${numeroCuenta}</NumeroCuenta>
          </PeticionConsultarCliente>
        </wsp:Peticion>
      </wsp:ConsultarCliente>
    </soap:Body>
  </soap:Envelope>`;
}

/**
 * Envía la petición SOAP y devuelve el objeto parseado
 */
export async function verificarClienteService(data) {
  //Construir XML
  const xml = buildVerificarClienteXML(data);


  //Hacer fetch al servicio SOAP
  const response = await fetch(process.env.SOAP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/soap+xml; charset=utf-8",
      "SOAPAction": "\"http://wsposite.smrey.net/VerificarCliente\"",
    },
    body: xml,
  });

  const responseText = await response.text();
  
  //Parsear la respuesta XML a objeto JS
  const parsed = await parseStringPromise(responseText);

  //Opcional: limpiar y devolver solo los datos útiles
  const result = parsed["soap:Envelope"]["soap:Body"][0]["VerificarClienteResponse"][0]["VerificarClienteResult"][0]["RespuestaVerificarCliente"][0];
  return {
    codigoRespuesta: result.CodigoRespuesta?.[0] || null,
    mensaje: result.Mensaje?.[0] || null,
    numeroCliente: result.NumeroCliente?.[0] || null,
    numeroCuenta: result.NumeroCuenta?.[0] || null,
    raw: result, // por si quieres ver todo
  };
}

export async function consultarClienteService(data) {
  const xml = buildConsultarClienteXML(data);

  console.log("XML ConsultarCliente:\n", xml);

  const response = await fetch(process.env.SOAP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/soap+xml; charset=utf-8",
      "SOAPAction": "\"http://wsposite.smrey.net/ConsultarCliente\"",
    },
    body: xml,
  });

  const responseText = await response.text();
  console.log("Respuesta SOAP ConsultarCliente cruda:\n", responseText);

  const parsed = await parseStringPromise(responseText);

  // Extraemos la parte útil de la respuesta
  const result =
    parsed["soap:Envelope"]["soap:Body"][0]["ConsultarClienteResponse"][0]["ConsultarClienteResult"][0];

  // Puedes mapear campos específicos aquí según lo que devuelva el WSDL real
  return result;
}
