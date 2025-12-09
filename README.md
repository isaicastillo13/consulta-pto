# 📌 ConsultaPto – Plataforma de Consulta de Puntos

Aplicación **Blazor WebAssembly + .NET 6 (Hosteado)** para validar usuarios mediante cédula/pasaporte, consultar información de clientes y consumir servicios SOAP del Sistema **Punto de Oro (SPO)** del Grupo Rey.

Este proyecto consolida:

* Autenticación mediante pregunta de seguridad almacenada en BD.
* Backend en .NET que expone REST APIs.
* Conexión a SQL Server con Entity Framework Core.
* Integración con **WebService SOAP** externo para obtener:

  * Número de cliente
  * Número de cuenta
  * Información adicional de usuario
* Arquitectura limpia, separando:

  * **Client (Blazor WASM)**
  * **Server (API + SOAP Proxy)**
  * **Shared (Modelos / DTOs)**

---

# 🏗️ Arquitectura del Proyecto

```
ConsultaPto/
│
├── Client/                # Blazor WebAssembly (UI)
├── Server/                # API REST, SOAP Proxy, EF Core, Controllers
├── Shared/                # Modelos compartidos (Usuario, DTOs, SOAP)
└── README.md
```

---

# 🔐 Flujo de Login

1. El usuario ingresa su **cédula/pasaporte**.
2. El sistema consulta la BD (tabla `PDO.Usuario`).
3. Si la cédula existe:

   * Se muestra la **pregunta de seguridad**.
4. El usuario ingresa la respuesta.
5. La respuesta se valida contra la BD usando **hash SHA256 + salt**.
6. Si la respuesta es correcta → acceso permitido.

---

# 🗄️ Integración con SQL Server

El servidor utiliza EF Core:

```csharp
services.AddDbContext<ApplicationDbContext>(options =>
      options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
```

Tablas:

* `PDO.Usuario`
* `PDO.PreguntaSeguridad`

Relaciones mapeadas en:

```
ApplicationDbContext.cs
```

---

# 🌐 Integración SOAP (Punto de Oro)

El servicio SOAP es consumido por el backend, no por el cliente.

Se utiliza un **HttpClient configurado en Startup**, más un servicio custom:

```csharp
services.AddHttpClient("SoapClientes", client =>
{
    client.BaseAddress = new Uri("http://wpo.smrey.net/wsposite/wsposite.asmx");
});
services.AddScoped<ISoapClientesService, SoapClientesService>();
```

El backend construye el envelope SOAP, lo envía al WS y parsea el XML de respuesta.

El cliente llama a un endpoint REST:

```
POST /api/ClientesSoap/verificar-json
```

con un JSON como:

```json
{
  "documento": "8-925-805",
  "tipoDocumento": 1
}
```

Ejemplo de respuesta:

```json
{
  "flag": "00",
  "codigoRespuesta": "00",
  "mensaje": "Cliente Correcto",
  "numeroCliente": "1778073",
  "numeroCuenta": "9997",
  "numeroTarjeta": "2979997038410"
}
```

---

# 🔧 Tecnologías Utilizadas

| Capa          | Tecnologías                        |
| ------------- | ---------------------------------- |
| Frontend      | Blazor WebAssembly, Bootstrap      |
| Backend       | ASP.NET Core, REST API             |
| SOAP          | HttpClient con SOAP 1.2            |
| BD            | SQL Server + Entity Framework Core |
| Seguridad     | Hash SHA256 + Salt                 |
| Documentación | Swagger                            |

---

# 🚀 ¡Cómo Ejecutar el Proyecto!

## 1️⃣ Clonar el repositorio

```
git clone https://github.com/TU-USUARIO/ConsultaPto.git
cd ConsultaPto
```

## 2️⃣ Configurar la BD en `appsettings.json`

```
"ConnectionStrings": {
  "DefaultConnection": "Server=rtxdbtest;Database=MERC;User Id=usr-rhqdbtest;Password=XXXXX;Encrypt=True;TrustServerCertificate=True;"
}
```

## 3️⃣ Configurar el servicio SOAP

```
"SoapServices": {
  "Clientes": {
    "Url": "http://wpo.smrey.net/wsposite/wsposite.asmx",
    "Usuario": "ugeometry",
    "Clave": "GVRoEKyWFptmo9JRxyUongA=",
    "Dominio": "CREDIREY",
    "TipoTerminal": "5"
  }
}
```

## 4️⃣ Ejecutar

En Visual Studio:

👉 Seleccionar el proyecto **Server** como proyecto de inicio.

Presionar **F5**.

Swagger estará disponible en:

```
https://localhost:xxxx/swagger
```

La app Blazor en:

```
https://localhost:xxxx/
```

---

# 🧪 Endpoints principales

## 🔍 Buscar Usuario por Cédula (BD)

```
GET /api/usuarios/buscar?cedula=8-123-456
```

## 🔐 Validar Pregunta de Seguridad

```
POST /api/usuarios/validar
```

Body:

```json
{
  "cedula": "8-123-456",
  "respuesta": "mi mascota"
}
```

## 🌐 Verificar Cliente en SOAP (Punto de Oro)

REST limpio:

```
POST /api/ClientesSoap/verificar-json
```

SOAP raw (para debug):

```
POST /api/ClientesSoap/verificar
content-type: text/plain / text/xml
```

---

# 📦 Objetivos del Proyecto

* Migrar consulta de Puntos a una plataforma moderna.
* Integrar BD + SOAP desde un backend seguro.
* Proveer API REST limpia para aplicaciones futuras (App Móvil, Web, etc.).
* Centralizar autenticación y consultas de cliente.

---

# 🤝 Contribuciones

¡Bienvenidas con Pull Requests!
Antes de enviar cambios, verificar:

* Que el proyecto compila.
* Que Swagger genera todos los endpoints correctamente.
* Que las llamadas SOAP siguen funcionando con el WS real.

---

# 📄 Licencia

Proyecto interno para **Desarrollo e Implementación – Grupo Rey**.
