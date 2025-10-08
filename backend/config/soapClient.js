import soap from 'soap';

// URL al WSDL
const wsdlUrl = 'http://wpo.smrey.net/wsposite/wsposite.asmx?WSDL';

let client = null;

export async function getSoapClient() {
    if(!client){
        client = await soap.createClientAsync(wsdlUrl);
        console.log("SOAP client creado");
    }

    return client;
}