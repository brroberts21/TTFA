using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Manages
    {
        public int AdminID { get; set; }

        public int EventID { get; set; }

        public string AdminName { get; set; }

        public string EventName { get; set; }

        public string Deleted { get; set; }
    }
}