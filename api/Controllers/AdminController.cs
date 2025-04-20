using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api;
using api.Models;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        // GET: api/<AdminController>
        [HttpGet]
        public async Task<List<Admin>> GetAllAdminAsync()
        {
            Database db = new();
            return await db.GetAllAdminAsync();
        }

        // GET api/<AdminController>/5
        [HttpGet("{id}")]
        public async Task<Admin> GetAdminAsync(int id)
        {
            Database db = new();
            Admin admin = await db.GetAdminAsync(id);
            return admin;
        }
        
        //make sure that you use a unique admin_email when testing
        // POST api/<AdminController>
        [HttpPost]
        public async Task PostAdminAsync([FromBody] Admin admin)
        {
            Database db = new();
            await db.InsertAdminAsync(admin);
        }

        //make sure that you use a unique admin_email when testing
        //can reuse the email attached to that row, but it cannot be changed to an email that is featured in another row
        // PUT api/<AdminController>/5
        [HttpPut("{id}")]
        public async Task UpdateAdminAsync(int id, [FromBody] Admin admin)
        {
            admin.ID = id;
            Database db = new();
            await db.UpdateAdminAsync(admin);
        }

        // DELETE api/<AdminController>/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            Database db = new();
            await db.DeleteAdminAsync(id);
        }
    }
}
