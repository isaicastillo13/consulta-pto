using System.ComponentModel.DataAnnotations;

namespace ConsultaPto.Shared.Models
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "La cédula es obligatoria.")]
        public string Cedula { get; set; } = string.Empty;

        [Required(ErrorMessage = "La respuesta es obligatoria.")]
        public string Respuesta { get; set; } = string.Empty;

        // 🔹 Correo que el usuario digita en el login
        [Required(ErrorMessage = "El correo es obligatorio.")]
        [EmailAddress(ErrorMessage = "El correo no tiene un formato válido.")]
        public string Correo { get; set; } = string.Empty;

        // 🔹 Tipo de documento ya calculado en el cliente (0 = cédula, 1 = pasaporte)
        public string TipoDocumento { get; set; } = "0";
    }
}
