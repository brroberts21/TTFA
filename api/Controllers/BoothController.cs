using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api;
using System.Data.Common;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class BoothController : ControllerBase
    {
        // GET: api/<BoothController>
        [HttpGet]
        public async Task<List<Booth>> GetAllBoothsAsync()
        {
            Database db = new();
            return await db.GetAllBoothsAsync();
        }

        // GET api/<BoothController>/5
        [HttpGet("{id}")]
        public async Task<Booth> GetBoothAsync(int id)
        {
            Database db = new();
            Booth booth = await db.GetBoothAsync(id);
            return booth;
        }

        // POST api/<BoothController>
        [HttpPost]
        public async Task PostBoothAsync([FromBody] Booth booth)
        {
            Database db = new();
            await db.InsertBoothAsync(booth);
        }

        // PUT api/<BoothController>/5
        [HttpPut("{id}")]
        public async Task UpdateBoothAsync(int id, [FromBody] Booth booth)
        {
            booth.ID = id;
            Database db = new();
            await db.UpdateBoothAsync(booth);
        }

        // DELETE api/<BoothController>/5
        [HttpDelete("{id}")]
        public async Task DeleteBoothAsync(int id)
        {
            Database db = new();
            await db.DeleteBoothAsync(id);
        }
    }
}
