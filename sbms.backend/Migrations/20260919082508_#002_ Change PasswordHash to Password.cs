using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace sbms.backend.Migrations
{
    /// <inheritdoc />
    public partial class _002_ChangePasswordHashtoPassword : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PasswordHash",
                table: "AppUsers",
                newName: "Password");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Password",
                table: "AppUsers",
                newName: "PasswordHash");
        }
    }
}
