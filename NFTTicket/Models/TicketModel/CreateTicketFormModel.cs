using System.ComponentModel.DataAnnotations;

namespace NFTTicket.Models.TicketModel
{
    public class CreateTicketFormModel
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


        [Required]
        public bool IsTransferable { get; set; }

        [Required]
        public int? TransferFee { get; set; }
    }
}
