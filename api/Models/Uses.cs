using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Uses
    {
        public int EventId { get; set; }

        public int VendorID { get; set; }

        public int BoothID { get; set; }

        public string EventName { get; set; }

        public string VendorName { get; set; }

        public int BoothNumber { get; set; }

        public string Deleted { get; set; }
    }
}