using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using Ships.Business.Models;

namespace Ships.Business.Mapping
{
    public class GameSideMap : EntityTypeConfiguration<GameSide>
    {
        public GameSideMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.Id)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity)
                .IsRequired();

            this.Property(t => t.PlayerFK)
                .IsRequired();

            this.ToTable("T_GAME_SIDE");

            // Navigation properties
            this.HasRequired(x => x.Player)
                .WithMany()
                .HasForeignKey(t => t.PlayerFK);

            this.HasMany(t => t.Ships)
                .WithRequired()
                .HasForeignKey(t => t.GameSideFK);

            this.HasMany(t => t.Shots)
                .WithRequired()
                .HasForeignKey(t => t.GameSideFK);
        }
    }
}
