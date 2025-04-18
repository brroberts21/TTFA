using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api;
using api.Models;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsesController : ControllerBase
    {
        // GET: api/<UsesController>
        [HttpGet]
        public async Task<List<Uses>> GetAllUsesAsync()
        {
            Database db = new();
            return await db.GetAllUsesAsync();
        }

        // GET api/<UsesController>/5/5/5
        [HttpGet("{eventID}/{vendorID}/{boothID}")]
        public async Task<Uses> GetUsesAsync(int eventID, int vendorID, int boothID)
        {
            Database db = new();
            Uses use = await db.GetUseAsync(eventID, vendorID, boothID);
            return use;
        }

        [HttpGet("{eventID}")]
        public async Task<int> GetVendorCount(int eventID)
        {
            Database db = new();
            return await db.GetVendorCount(eventID);
        }

        [HttpGet("{eventId}/{vendorID}")]
        public async Task<int> GetBoothNumber(int eventId, int vendorID)
        {
            Database db = new();
            return await db.GetBoothNumber(eventId, vendorID);
        }

        // POST api/<UsesController>
        [HttpPost]
        public async Task PostUseAsync([FromBody] Uses use)
        {
            Database db = new();
            await db.InsertUseAsync(use);
        }

        // PUT api/<UsesController>/5
        [HttpPut("{eventID}/{vendorID}/{boothID}")]
        public async Task UpdateUseAsync(int eventID, int vendorID, int boothID, [FromBody] Uses use)
        {
            Database db = new();
            await db.UpdateUseAsync(eventID, vendorID, boothID, use);
        }

        // DELETE api/<UsesController>/5
        [HttpDelete("{eventID}/{vendorID}/{boothID}")]
        public async Task DeleteUseAsync(int eventID, int vendorID, int boothID)
        {
            Database db = new();
            await db.DeleteUseAsync(eventID, vendorID, boothID);
        }
    }
}
