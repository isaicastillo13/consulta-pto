using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConsultaPto.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "PDO");

            migrationBuilder.CreateTable(
                name: "PreguntaSeguridad",
                schema: "PDO",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Pregunta = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PreguntaSeguridad", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Usuario",
                schema: "PDO",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Cedula = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IdPregunta = table.Column<int>(type: "int", nullable: false),
                    Respuesta = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    PreguntaSeguridadId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuario", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Usuario_PreguntaSeguridad_PreguntaSeguridadId",
                        column: x => x.PreguntaSeguridadId,
                        principalSchema: "PDO",
                        principalTable: "PreguntaSeguridad",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_PreguntaSeguridadId",
                schema: "PDO",
                table: "Usuario",
                column: "PreguntaSeguridadId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Usuario",
                schema: "PDO");

            migrationBuilder.DropTable(
                name: "PreguntaSeguridad",
                schema: "PDO");
        }
    }
}
