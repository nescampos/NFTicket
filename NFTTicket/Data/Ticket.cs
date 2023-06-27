using System.ComponentModel.DataAnnotations;

namespace NFTTicket.Data
{
    public class Ticket
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public DateTime? Date { get; set; }

        [Required]
        public string Place { get; set; }


        public bool IsTransferable { get; set; }

        public int? TransferFee { get; set; }

        public string? AccountId { get; set; }
    }
}
