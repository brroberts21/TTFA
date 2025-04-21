using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Pending
    {
        public int PendingID { get; set; }

        public int VendorID { get; set; }

        public string deleted { get; set; }
    }
}