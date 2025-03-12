using Npgsql;

class DbConnectionTest
{
    static async Task Main()
    {
        var connectionString = "Host=db.wytgstsxydpptlxessgb.supabase.co;Database=postgres;Username=postgres;Password=pressingon123;Port=5432;SSL Mode=Require;Trust Server Certificate=true";

        try
        {
            using var conn = new NpgsqlConnection(connectionString);
            Console.WriteLine("Opening connection...");
            await conn.OpenAsync();
            Console.WriteLine("Connection successful!");

            using var cmd = new NpgsqlCommand("SELECT version()", conn);
            var version = await cmd.ExecuteScalarAsync();
            Console.WriteLine($"PostgreSQL version: {version}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            if (ex.InnerException != null)
            {
                Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
            }
        }
    }
}
