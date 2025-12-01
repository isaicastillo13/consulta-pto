using System.ComponentModel.DataAnnotations;

namespace ConsultaPto.Shared.Models
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "La cédula es obligatoria.")]
        public string Cedula { get; set; } = string.Empty;

        [Required(ErrorMessage = "Debe ingresar su respuesta de seguridad.")]
        public string Respuesta { get; set; } = string.Empty;
    }
}
