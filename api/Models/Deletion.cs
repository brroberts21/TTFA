using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Deletion
    {
        public int AdminID { get; set; }

        public int VendorID { get; set; }

        public string AdminName { get; set; }

        public string VendorName { get; set; }

        public DateTime DeletionDate { get; set; }
    }
}