using System.ComponentModel.DataAnnotations;

namespace ConsultaPto.Shared.Models
{
    public class CedulaRequest
    {
        [Required(ErrorMessage = "La cédula es obligatoria.")]
        public string Cedula { get; set; } = string.Empty;
    }
}
