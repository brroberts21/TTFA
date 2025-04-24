using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api;
using api.Models;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        // GET: api/<EventController>
        [HttpGet]
        public async Task<List<Event>> GetAllEventsAsync()
        {
            Database db = new();
            return await db.GetAllEventsAsync();
        }

        // GET api/<EventController>/5
        [HttpGet("{id}")]
        public async Task<Event> GetEventAsync(int id)
        {
            Database db = new();
            Event singleEvent = await db.GetEventAsync(id);
            return singleEvent;
        }

        // These are for the vendor page to show events that vendor is/isn't attending
        // GET api/<Event>/vendor/5
        [HttpGet("vendor/{vendorID}")]
        public async Task<List<Event>> GetVendorEvents(int vendorID)
        {
            Database db = new();
            return await db.GetVendorEvents(vendorID);
        }

        [HttpGet("skip/{vendorID}")]
        public async Task<List<Event>> GetSkippedEvents(int vendorID)
        {
            Database db = new();
            return await db.GetSkippedEvents(vendorID);
        } 

        // POST api/<EventController>
        [HttpPost("{adminID}")]
        public async Task PostEventAsync([FromBody] Event newEvent, int adminID)
        {
            Database db = new();
            int eventID = await db.InsertEventAsync(newEvent);

            Manages manager = new Manages()
            {
                AdminID = adminID,
                EventID = eventID,
                AdminName = "",
                EventName = "",
                Deleted = "n"
            };
            await db.InsertManageAsync(manager);
        }

        // PUT api/<EventController>/5
        [HttpPut("{id}")]
        public async Task UpdateEventAsync(int id, [FromBody] Event updatedEvent)
        {
            updatedEvent.ID = id;
            Database db = new();
            await db.UpdateEventAsync(updatedEvent);
        }

        // DELETE api/<EventController>/5
        [HttpDelete("{id}")]
        public async Task DeleteEventAsync(int id)
        {
            Database db = new();
            await db.DeleteEventAsync(id);
        }
    }
}
