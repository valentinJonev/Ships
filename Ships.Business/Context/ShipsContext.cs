using System.Data.Entity;
using Ships.Auth.Core.Context;
using Ships.Business.Mapping;
using Ships.Business.Migrations;
using Ships.Business.Models;

namespace Ships.Business.Context
{
    public class ShipsContext : AuthContext
    {
        public ShipsContext()
            : base("ShipsContext")
        {
            SetInitializer();
            
            Games = Set<Game>();
        }

        public DbSet<Game> Games { get; private set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new GameMap());
            modelBuilder.Configurations.Add(new GameSideMap());
            modelBuilder.Configurations.Add(new ShipMap());
            modelBuilder.Configurations.Add(new PositionMap());
            modelBuilder.Configurations.Add(new ShotMap());

            base.OnModelCreating(modelBuilder);
        }

        public static void SetInitializer()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<ShipsContext, Configuration>());
        }
    }
}
