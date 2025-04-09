using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Event
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime Date { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public string Deleted { get; set; }
    }
}