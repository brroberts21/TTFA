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

        // POST api/<EventController>
        [HttpPost]
        public async Task PostEventAsync([FromBody] Event newEvent)
        {
            Database db = new();
            await db.InsertEventAsync(newEvent);
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
