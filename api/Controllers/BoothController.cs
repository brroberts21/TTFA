using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using api;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class BoothController : ControllerBase
    {
        // GET: api/<BoothController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<BoothController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<BoothController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<BoothController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<BoothController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
