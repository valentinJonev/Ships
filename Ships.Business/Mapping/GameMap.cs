using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using Ships.Business.Models;

namespace Ships.Business.Mapping
{
    public class GameMap : EntityTypeConfiguration<Game>
    {
        public GameMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.Id)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity)
                .IsRequired();

            this.Property(t => t.FirstSideFK)
                .IsRequired();

            this.Property(t => t.SecondSideFK)
                .IsRequired();

            this.Property(t => t.NextMoveSideFK)
                .IsRequired();

            this.Property(t => t.WinnerSideFK)
                .IsOptional();

            this.Property(t => t.CreatedAt)
                .IsRequired();

            this.Property(t => t.StartedAt)
                .IsOptional();

            this.Property(t => t.EndedAt)
                .IsOptional();

            this.ToTable("T_GAME");

            // Navigation properties
            this.HasRequired(t => t.FirstSide)
                .WithMany()
                .HasForeignKey(t => t.FirstSideFK)
                .WillCascadeOnDelete(false);

            this.HasRequired(t => t.SecondSide)
                .WithMany()
                .HasForeignKey(t => t.SecondSideFK)
                .WillCascadeOnDelete(false);

            this.HasRequired(t => t.NextShotSide)
                .WithMany()
                .HasForeignKey(t => t.NextMoveSideFK);

            this.HasOptional(t => t.WinnerSide)
                .WithMany()
                .HasForeignKey(t => t.WinnerSideFK);
        }
    }
}
