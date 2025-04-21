using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api;
using api.Models;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class PendingController : ControllerBase
    {
        // GET: api/<PendingController>
        [HttpGet]
        public async Task<List<Pending>> GetAllPendingVendorsAsync()
        {   
            Database db = new();
            return await db.GetAllPendingAsync();
        }

        // GET api/<PendingController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<PendingController>
        [HttpPost]
        public async Task InsertPendingVendorAsync([FromBody] Pending pendingVendor)
        {
            Database db = new();
            await db.InsertPendingVendor(pendingVendor);
        }

        // PUT api/<PendingController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<PendingController>/5
        [HttpDelete("{id}")]
        public async Task DeletePendingVendor(int id)
        {
            Database db = new();
            await db.DeletePendingVendor(id);
        }
    }
}
