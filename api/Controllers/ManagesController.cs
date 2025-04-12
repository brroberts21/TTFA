using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagesController : ControllerBase
    {
        // GET: api/<ManagesController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<ManagesController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<ManagesController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<ManagesController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ManagesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
