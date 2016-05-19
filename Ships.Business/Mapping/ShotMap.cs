using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using Ships.Business.Models;

namespace Ships.Business.Mapping
{
    public class ShotMap : EntityTypeConfiguration<Shot>
    {
        public ShotMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.Id)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity)
                .IsRequired();

            this.Property(t => t.GameSideFK)
                .IsRequired();

            this.Property(t => t.X)
                .IsRequired();

            this.Property(t => t.Y)
                .IsRequired();

            this.Property(t => t.DoneAt)
                .IsRequired();

            this.ToTable("T_SHOT");

            // Navigation properties
        }
    }
}
