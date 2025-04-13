using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api;
using api.Models;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApprovesController : ControllerBase
    {
        // GET: api/<ApprovesController>
        [HttpGet]
        public async Task<List<Approval>> GetAllApprovalsAsync()
        {
            Database db = new();
            return await db.GetAllApprovalsAsync();
        }

        // GET api/<ApprovesController>/5
        [HttpGet("{adminID}/{vendorID}")]
        public async Task<Approval> GetApprovalAsync(int adminID, int vendorID)
        {
            Database db = new();
            Approval approval = await db.GetApprovalAsync(adminID, vendorID);
            return approval;
        }

        // POST api/<ApprovesController>
        [HttpPost]
        public async Task PostApprovalAsync([FromBody] Approval approval)
        {
            Database db = new();
            await db.InsertApprovalAsync(approval);
        }

        // PUT api/<ApprovesController>/5
        [HttpPut("{adminID}/{vendorID}")]
        public async Task UpdateApprovalAsync(int adminID, int vendorID, [FromBody] Approval approval)
        {
            Database db = new();
            await db.UpdateApprovalAsync(adminID, vendorID, approval);
        }

        // DELETE api/<ApprovesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
