import { getSoapClient } from "../config/soapClient";
import { parseStringPromise } from 'xml2js';
import dotenv from 'dotenv';

dotenv.config();

export async function verificarClienteService(data) {
    const client = await getSoapClient();

    const peticionInterna = `
    <PeticionVerificarCliente xmlns="http://wsposite.smrey.net/">
      <Flag>00</Flag>
      <Credencial>
        <Usuario>${process.env.USUARIO_SOAP}</Usuario>
        <Clave>${process.env.CLAVE_SOAP}</Clave>
        <Dominio>${process.env.DOMINIO_SOAP}</Dominio>
      </Credencial>
      <TipoTerminal>5</TipoTerminal>
      <Fecha>${data.fecha}</Fecha>
      <NumeroTarjeta></NumeroTarjeta>
      <Ididentificacion>${data.identificacion}</Ididentificacion>
      <TipoIdidentificacion>0</TipoIdidentificacion>
    </PeticionVerificarCliente>
  `;

  const args = { Peticion: peticionInterna };
  const [result] = await client.VerificarClienteAsync(args);
  const responseXml = result.VerificarClienteResult;

    // Parsear la respuesta XML a un objeto JavaScript
    const parsedResponse = await parseStringPromise(responseXml);
    return parsedResponse;
}
