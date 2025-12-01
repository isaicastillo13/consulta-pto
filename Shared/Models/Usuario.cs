using System.ComponentModel.DataAnnotations;

namespace ConsultaPto.Shared.Models
{
    public class Usuario
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(100, ErrorMessage = "El nombre no debe superar los 100 caracteres.")]
        public string? Nombre { get; set; }

        [Required(ErrorMessage = "La cédula es obligatoria.")]
        [StringLength(50, ErrorMessage = "La cédula no debe superar los 50 caracteres.")]
        public string? Cedula { get; set; }

        [Required(ErrorMessage = "Debe seleccionar una pregunta de seguridad.")]
        public int? IdPregunta { get; set; }

        [Required(ErrorMessage = "Debe ingresar una respuesta.")]
        [StringLength(150, ErrorMessage = "La respuesta no debe superar los 150 caracteres.")]
        public string? Respuesta { get; set; }

        public PreguntaSeguridad? PreguntaSeguridad { get; set; }
    }
}
