using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace ConsultaPto.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    // 👇 Muy importante: aquí usamos Startup
                    webBuilder.UseStartup<Startup>();
                });
    }
}
