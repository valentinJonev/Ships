using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using Ships.Business.Models;

namespace Ships.Business.Mapping
{
    public class ShipMap : EntityTypeConfiguration<Ship>
    {
        public ShipMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.Id)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity)
                .IsRequired();

            this.Property(t => t.GameSideFK)
                .IsRequired();

            this.ToTable("T_SHIP");

            // Navigation properties
            this.HasMany(t => t.Positions)
                .WithRequired()
                .HasForeignKey(t => t.ShipFK);
        }
    }
}
