using ConsultaPto.Client;
using ConsultaPto.Client.Services;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Net.Http;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");

// ✅ Registrar HttpClient con la base address
//builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
builder.Services.AddScoped(sp => new HttpClient
{
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress)
});


// ✅ Registrar tu servicio personalizado
builder.Services.AddScoped<UsuariosService>();
builder.Services.AddScoped<SesionUsuarioService>();

await builder.Build().RunAsync();
