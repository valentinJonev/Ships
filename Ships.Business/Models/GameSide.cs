using System;
using System.Collections.Generic;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Ships.Business.Models
{
    public class GameSide
    {
        public GameSide()
        {
            Ships = new HashSet<Ship>();
            Shots = new HashSet<Shot>();
        }

        public int Id { get; set; }

        public string PlayerFK { get; set; }

        public IdentityUser Player { get; internal set; }
        public ICollection<Ship> Ships { get; set; }
        public ICollection<Shot> Shots { get; set; }
    }
}
