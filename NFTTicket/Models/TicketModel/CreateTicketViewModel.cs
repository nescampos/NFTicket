using Microsoft.AspNetCore.Mvc.Rendering;

namespace NFTTicket.Models.TicketModel
{
    public class CreateTicketViewModel
    {
        public CreateTicketFormModel Form { get; set; }
        public List<SelectListItem> IsTransferable { get; set; }

        public CreateTicketViewModel()
        {
            IsTransferable = new List<SelectListItem>();
            IsTransferable.Add(new SelectListItem { Text = "Yes",Value = true.ToString() });
            IsTransferable.Add(new SelectListItem { Text = "No", Value = false.ToString() });
        }
    }
}
