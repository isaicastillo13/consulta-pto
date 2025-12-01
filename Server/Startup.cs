using ConsultaPto.Server.Data;
using ConsultaPto.Server.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace ConsultaPto.Server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // Este método se llama en tiempo de ejecución. Aquí registras servicios.
        public void ConfigureServices(IServiceCollection services)
        {
            // 🔹 DbContext con tu connection string
            services.AddDbContext<ApplicationDbContext>(options =>
                 options.UseSqlServer("Server=rtxdbtest;Database=MERC;User Id=usr-rhqdbtest;Password=LaMupE03x;Encrypt=True;TrustServerCertificate=True;"));

            services.AddHttpClient("SoapClientes", (sp, client) =>
            {
                var config = sp.GetRequiredService<IConfiguration>();
                var baseUrl = config["SoapServices:Clientes:Url"]; // viene de appsettings.json
                client.BaseAddress = new Uri(baseUrl!);
                // Opcional:
                // client.Timeout = TimeSpan.FromSeconds(30);
            });
            // 🔹 Soporte para controladores y páginas (Blazor hosted)
           
            services.AddScoped<ISoapClientesService, SoapClientesService>();

            services.AddControllersWithViews();
            services.AddRazorPages();

            // 🔹 Swagger (opcional pero muy útil)
            services.AddSwaggerGen();
        }

        // Este método se llama en tiempo de ejecución. Aquí configuras el pipeline HTTP.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebAssemblyDebugging();

                // 🔹 Activar Swagger en desarrollo
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ConsultaPto API V1");
                });
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseBlazorFrameworkFiles();
            app.UseStaticFiles();

            app.UseRouting();

            // Si luego agregas auth, aquí iría app.UseAuthentication(), app.UseAuthorization()

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapControllers();              // 👈 IMPORTANTE para /api/...
                endpoints.MapFallbackToFile("index.html");
            });
        }
    }
}
