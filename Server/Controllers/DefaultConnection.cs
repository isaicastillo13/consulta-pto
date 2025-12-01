namespace ConsultaPto.Server.Controllers
{
    internal class DefaultConnection
    {
        private string connectionString;

        public DefaultConnection(string connectionString)
        {
            this.connectionString = connectionString;
        }
    }
}