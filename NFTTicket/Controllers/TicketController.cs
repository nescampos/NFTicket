using Microsoft.AspNetCore.Mvc;
using NFTTicket.Data;
using NFTTicket.Models.TicketModel;

namespace NFTTicket.Controllers
{
    public class TicketController : Controller
    {
        private ApplicationDbContext _db;
        public TicketController(ApplicationDbContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Create()
        {
            CreateTicketViewModel model = new CreateTicketViewModel();
            return View(model);
        }

        [HttpPost]
        public IActionResult Create(CreateTicketFormModel Form)
        {
            Ticket ticket = new Ticket
            {
                 Date = Form.Date.Value.Date, Description = Form.Description, Id = Form.Id, IsTransferable = Form.IsTransferable,
                 Name = Form.Name, Place = Form.Place, TransferFee = Form.TransferFee
            };
            _db.Tickets.Add(ticket);
            _db.SaveChanges();
            return RedirectToAction("Details", new { id = Form.Id });
        }

        public IActionResult Details(Guid id)
        {
            Ticket ticket = _db.Tickets.SingleOrDefault(x => x.Id == id);

            return View(ticket);
        }

        public IActionResult List()
        {
            return View();
        }

        public IActionResult SellOffer(string id)
        {
            return View("SellOffer",id);
        }

        [HttpPost]
        public IActionResult SellOffer(string AccountId, float Amount, string Destination, int? Expiration, Guid Id, string NFTokenID, string OfferType)
        {
            Offer offer = new Offer
            {
                 AccountId = AccountId, Amount = Amount, Destination = Destination, Expiration = Expiration, Id = Id, NFTokenID = NFTokenID, OfferType = OfferType
            };
            _db.Offers.Add(offer);
            _db.SaveChanges();
            return RedirectToAction("List");
        }

        public IActionResult BuyOffer(string id)
        {
            IEnumerable<Offer> offers = _db.Offers.Where(x => x.Destination == id);
            return View(offers);
        }
    }
}
