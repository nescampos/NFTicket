using System.ComponentModel.DataAnnotations;

namespace NFTTicket.Data
{
    public class Offer
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public string NFTokenID { get; set; }

        [Required]
        public string OfferType { get; set; }

        [Required]
        public float? Amount { get; set; }

        [Required]
        public string Destination { get; set; }


        public int? Expiration { get; set; }

        public string? AccountId { get; set; }
    }
}
