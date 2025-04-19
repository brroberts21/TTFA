using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Vendor
    {
        public int ID { get; set; }

        public string VendorEmail { get; set; }

        public string VendorPhone { get; set; }

        public string VendorSocial { get; set; }

        public string VendorName { get; set; }

        public string OwnerFirstName { get; set; }

        public string OwnerLastName { get; set; }

        public string OwnerEmail { get; set; }

        public string OwnerPassword { get; set; }

        public string OwnerPhone { get; set; }

        public string Type { get; set; }

        public string Deleted { get; set; }
    }
}