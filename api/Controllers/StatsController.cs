using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api;
using api.Models;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatsController : ControllerBase
    {
        // GET: api/<StatsController>
        [HttpGet("VPE")]
        public async Task<List<Statistic>> VendorsPerEventAsync()
        {
            Database db = new();
            return await db.GetVendorsPerEvent();
        }

        [HttpGet("VPC")]
        public async Task<List<Statistic>> VendorsPerCategoryAsync()
        {
            Database db = new();
            return await db.GetVendorsPerCategory();
        }

        [HttpGet("VAPM")]
        public async Task<List<Statistic>> VendorsPerMonthAsync()
        {
            Database db = new();
            return await db.GetVendorAttendancesPerMonth();
        }

        [HttpGet("VAPY")]
        public async Task<List<Statistic>> VendorsPerYearAsync()
        {
            Database db = new();
            return await db.GetVendorAttendancesPerYear();
        }

        [HttpGet("EPM")]
        public async Task<List<Statistic>> EventsPerMonthAsync()
        {
            Database db = new();
            return await db.GetEventsPerMonth();
        }

        [HttpGet("EPY")]
        public async Task<List<Statistic>> EventsPerYearAsync()
        {
            Database db = new();
            return await db.GetEventsPerYear();
        }

        [HttpGet("EPC")]
        public async Task<List<Statistic>> EventsPerCategoryAsync()
        {
            Database db = new();
            return await db.GetEventsPerCategory();
        }
    }
}
