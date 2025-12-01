using ConsultaPto.Shared.Models;
using Microsoft.EntityFrameworkCore;

namespace ConsultaPto.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<PreguntaSeguridad> PreguntasSeguridad { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 🔹 Tablas reales
            modelBuilder.Entity<Usuario>()
                .ToTable("usuarios", schema: "PDO");

            modelBuilder.Entity<PreguntaSeguridad>()
                .ToTable("PreguntasSeguridad", schema: "PDO");

            // 🔹 Configuración de la FK IdPregunta
            modelBuilder.Entity<Usuario>(entity =>
            {
                // La columna se llama IdPregunta en la BD
                entity.Property(u => u.IdPregunta)
                      .HasColumnName("IdPregunta");

                // Esta es la relación correcta:
                entity.HasOne(u => u.PreguntaSeguridad)
                      .WithMany()                 // si PreguntaSeguridad no tiene lista de usuarios
                      .HasForeignKey(u => u.IdPregunta);
            });
        }
    }
}
