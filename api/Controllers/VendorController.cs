using System.Net.Sockets;
using System.Threading.Tasks;
using api;
using api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendorController : ControllerBase
    {
        // GET: api/<VendorController>
        [HttpGet]
        public async Task<List<Vendor>> GetAllVendorsAsync()
        {
            Database db = new();
            return await db.GetAllVendorsAsync();
        }

        // GET api/<VendorController>/5
        [HttpGet("{id}")]
        public async Task<Vendor> GetVendorAsync(int id)
        {
            Database db = new();
            Vendor vendor =  await db.GetVendorAsync(id);
            return vendor;
        }

        // make sure vendor name and owner email are unique when testing
        // POST api/<VendorController>
        [HttpPost]
        public async Task PostVendorAsync([FromBody] Vendor vendor)
        {
            Database db = new();
            await db.InsertVendorAsync(vendor);
        }
        
        // make sure vendor name and owner email are unique when testing
        //can reuse the email/vendor name attached to that row, but it cannot be changed to an email/vendor name that is featured in another row
        // PUT api/<VendorController>/5
        [HttpPut("{id}")]
        public async Task UpdateVendorAsync(int id, [FromBody] Vendor vendor)
        {
            vendor.ID = id;
            Database db = new();
            await db.UpdateVendorAsync(vendor);
        }

        // DELETE api/<VendorController>/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            Database db = new();
            await db.DeleteVendorAsync(id);
        }
    }
}
