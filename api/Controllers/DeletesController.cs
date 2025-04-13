using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api;
using api.Models;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeletesController : ControllerBase
    {
        // GET: api/<DeletesController>
        [HttpGet]
        public async Task<List<Deletion>> GetAllDeletionsAsync()
        {
            Database db = new();
            return await db.GetAllDeletionsAsync();
        }

        // GET api/<DeletesController>/5
        [HttpGet("{adminID}/{vendorID}")]
        public async Task<Approval> GetApprovalAsync(int adminID, int vendorID)
        {
            Database db = new();
            Approval approval = await db.GetApprovalAsync(adminID, vendorID);
            return approval;
        }

        // POST api/<DeletesController>
        [HttpPost]
        public async Task PostDeletionAsync([FromBody] Deletion deletion)
        {
            Database db = new();
            await db.InsertDeletionAsync(deletion);
        }
        // PUT api/<DeletesController>/5
        [HttpPut("{adminID}/{vendorID}")]
        public async Task UpdateDeletionAsync(int adminID, int vendorID, [FromBody] Deletion deletion)
        {
            Database db = new();
            await db.UpdateDeletionAsync(adminID, vendorID, deletion);
        }

        // DELETE api/<DeletesController>/5
        [HttpDelete("{adminID}/{vendorID}")]
        public void Delete(int id)
        {
        }
    }
}
