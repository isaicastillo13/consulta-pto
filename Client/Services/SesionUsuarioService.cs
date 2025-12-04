using System;

namespace ConsultaPto.Client.Services
{
    /// <summary>
    /// Guarda en memoria del cliente los datos básicos del usuario logueado.
    /// (Vive mientras el navegador tenga la app abierta).
    /// </summary>
    public class SesionUsuarioService
    {
        public string? Cedula { get; private set; }
        public string? TipoDocumento { get; private set; }

        public bool EstaLogueado =>
            !string.IsNullOrWhiteSpace(Cedula) &&
            !string.IsNullOrWhiteSpace(TipoDocumento);

        public void IniciarSesion(string? documento, string? tipoDocumento)
        {
            Cedula = documento?.Trim();
            TipoDocumento = tipoDocumento?.Trim();
        }

        public void CerrarSesion()
        {
            Cedula = null;
            TipoDocumento = null;
        }
    }
}
