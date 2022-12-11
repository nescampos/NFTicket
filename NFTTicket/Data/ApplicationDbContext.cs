using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace NFTTicket.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

        }
    }
}