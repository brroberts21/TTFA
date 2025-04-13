using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api;
using api.Models;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagesController : ControllerBase
    {
        // GET: api/<ManagesController>
        [HttpGet]
        public async Task<List<Manages>> GetAllManagesAsync()
        {
            Database db = new();
            return await db.GetAllManagesAsync();
        }

        // GET api/<ManagesController>/5
        [HttpGet("{adminID}/{eventID}")]
        public async Task<Manages> GetManageAsync(int adminID, int eventID)
        {
            Database db = new();
            Manages manage = await db.GetManageAsync(adminID, eventID);
            return manage;
        }

        // POST api/<ManagesController>
        [HttpPost]
        public async Task PostManageAsync([FromBody] Manages manage)
        {
            Database db = new();
            await db.InsertManageAsync(manage);
        }

        // PUT api/<ManagesController>/5
        [HttpPut("{adminID}/{eventID}")]
        public async Task UpdateManageAsync(int adminID, int eventID, [FromBody] Manages manage)
        {
            Database db = new();
            await db.UpdateManageAsync(adminID, eventID, manage);
        }

        // DELETE api/<ManagesController>/5
        [HttpDelete("{adminID}/{eventID}")]
        public async Task DeleteManageAsync(int adminID, int eventID)
        {
            Database db = new();
            await db.DeleteManageAsync(adminID, eventID);
        }
    }
}
