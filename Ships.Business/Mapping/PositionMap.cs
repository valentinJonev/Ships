using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using Ships.Business.Models;

namespace Ships.Business.Mapping
{
    public class PositionMap : EntityTypeConfiguration<Position>
    {
        public PositionMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.Id)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity)
                .IsRequired();

            this.Property(t => t.ShipFK)
                .IsRequired();

            this.Property(t => t.X)
                .IsRequired();

            this.Property(t => t.Y)
                .IsRequired();

            this.ToTable("T_POSITION");

            // Navigation properties
        }
    }
}
