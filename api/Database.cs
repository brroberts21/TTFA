using api.Models;
using MySqlConnector;

namespace api
{
    public class Database
    {
        private string cs = "Server=ijj1btjwrd3b7932.cbetxkdyhwsb.us-east-1.rds.amazonaws.com;User ID=sb665amfr0pynuyz;Password=wqayxcinhauzfivu;Database=o8gync8ricmopt1y";

        public async Task<List<Vendor>> GetAllVendorsAsync()
        {
            List<Vendor> vendors = [];

            using var connection = new MySqlConnection(cs);
            await connection.OpenAsync();

            using var command = new MySqlCommand("SELECT * FROM o8gync8ricmopt1y.vendors where deleted = 'n';", connection);

            using var reader = await command.ExecuteReaderAsync();
            while(await reader.ReadAsync())
            {
                vendors.Add(new Vendor(){
                    ID = reader.GetInt32(0),
                    VendorName = reader.GetString(1),
                    OwnerFirstName = reader.GetString(2),
                    OwnerLastName = reader.GetString(3),
                    OwnerEmail = reader.GetString(4),
                    OwnerPassword = reader.GetString(5),
                    OwnerPhone = reader.GetString(6),
                    Type = reader.GetString(7),
                    Deleted = reader.GetString(8)
                });
            }

            return vendors;
        }

        public async Task<Vendor> GetVendorAsync(int id)
        {
            try{
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                using var command = new MySqlCommand($"select * from o8gync8ricmopt1y.vendors where vendor_id = {id};", connection);

                using var reader = await command.ExecuteReaderAsync();
                await reader.ReadAsync();

                Vendor vendor = new(){
                    ID = reader.GetInt32(0),
                    VendorName = reader.GetString(1),
                    OwnerFirstName = reader.GetString(2),
                    OwnerLastName = reader.GetString(3),
                    OwnerEmail = reader.GetString(4),
                    OwnerPassword = reader.GetString(5),
                    OwnerPhone = reader.GetString(6),
                    Type = reader.GetString(7),
                    Deleted = reader.GetString(8)
                };
                return vendor;
                
            }
            catch
            {
                return new Vendor();
            }
        }

        // when testing this method in swagger
        // ensure that for each entry, the vendor name is unique from all other vendor names and the owner email is unique from all other vendor names
        // if there is another entry containing the same vendor name or owner email, the data entry will not work
        public async Task InsertVendorAsync(Vendor vendor)
        {
            try{
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string sql = $"insert into o8gync8ricmopt1y.vendors (vendor_name, owner_first_name, owner_last_name, owner_email, owner_password, owner_phone, vendor_type, deleted) values (@vendor_name, @owner_first_name, @owner_last_name, @owner_email, @owner_password, @owner_phone, @vendor_type, @deleted);";

                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@vendor_name", vendor.VendorName);
                command.Parameters.AddWithValue("@owner_first_name", vendor.OwnerFirstName);
                command.Parameters.AddWithValue("@owner_last_name", vendor.OwnerLastName);
                command.Parameters.AddWithValue("@owner_email", vendor.OwnerEmail);
                command.Parameters.AddWithValue("@owner_password", vendor.OwnerPassword);
                command.Parameters.AddWithValue("@owner_phone", vendor.OwnerPhone);
                command.Parameters.AddWithValue("@vendor_type", vendor.Type);
                command.Parameters.AddWithValue("@deleted", "n");
                command.Prepare();

                await command.ExecuteNonQueryAsync();
                connection.Close();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }

        public async Task DeleteVendorAsync(int id)
        {
            try
            {
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string sql = $"update vendors set deleted = 'y' where (vendor_id = @id);";

                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@id", id);
                command.Prepare();

                await command.ExecuteNonQueryAsync();
                connection.Close();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }

        // when testing this method in swagger
        // ensure that for each entry, the vendor name is unique from all other vendor names and the owner email is unique from all other owner emails
        // if there is another entry containing the same vendor name or owner email, the data entry will not work
        public async Task UpdateVendorAsync(Vendor vendor)
        {
            try
            {
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string sql = "update o8gync8ricmopt1y.vendors set vendor_name = @vendor_name, owner_first_name = @owner_first_name, owner_last_name = @owner_last_name, owner_email = @owner_email, owner_password = @owner_password, owner_phone = @owner_phone, vendor_type = @vendor_type, deleted = @deleted where vendor_id = @id";
                
                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@id", vendor.ID);
                command.Parameters.AddWithValue("@vendor_name", vendor.VendorName);
                command.Parameters.AddWithValue("@owner_first_name", vendor.OwnerFirstName);
                command.Parameters.AddWithValue("@owner_last_name", vendor.OwnerLastName);
                command.Parameters.AddWithValue("@owner_email", vendor.OwnerEmail);
                command.Parameters.AddWithValue("@owner_password", vendor.OwnerPassword);
                command.Parameters.AddWithValue("@owner_phone", vendor.OwnerPhone);
                command.Parameters.AddWithValue("@vendor_type", vendor.Type);
                command.Parameters.AddWithValue("@deleted", vendor.Deleted);
                command.Prepare();

                await command.ExecuteNonQueryAsync();
                connection.Close();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }

        public async Task<List<Event>> GetAllEventsAsync()
        {
            List<Event> events = [];

            using var connection = new MySqlConnection(cs);
            await connection.OpenAsync();

            using var command = new MySqlCommand("SELECT * FROM o8gync8ricmopt1y.events where deleted = 'n';", connection);

            using var reader = await command.ExecuteReaderAsync();
            while(await reader.ReadAsync())
            {
                events.Add(new Event(){
                    ID = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Description = reader.GetString(2),
                    Date = reader.GetDateTime(3),
                    // default dates to avoid error between sql and c#
                    // usuing date 1-1-1 as dummy data to get time
                    StartTime = new DateTime(1, 1, 1, reader.GetTimeSpan(4).Hours, reader.GetTimeSpan(4).Minutes, reader.GetTimeSpan(4).Seconds),
                    EndTime = new DateTime(1, 1, 1, reader.GetTimeSpan(5).Hours, reader.GetTimeSpan(5).Minutes, reader.GetTimeSpan(5).Seconds),
                    Deleted = reader.GetString(6)
                });
            }

            return events;
        }

        public async Task<Event> GetEventAsync(int id)
        {
            try{
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                using var command = new MySqlCommand($"select * from o8gync8ricmopt1y.events where event_id = {id};", connection);

                using var reader = await command.ExecuteReaderAsync();
                await reader.ReadAsync();

                Event singleEvent = new(){
                    ID = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Description = reader.GetString(2),
                    Date = reader.GetDateTime(3),
                    StartTime = new DateTime(1, 1, 1, reader.GetTimeSpan(4).Hours, reader.GetTimeSpan(4).Minutes, reader.GetTimeSpan(4).Seconds),
                    EndTime = new DateTime(1, 1, 1, reader.GetTimeSpan(5).Hours, reader.GetTimeSpan(5).Minutes, reader.GetTimeSpan(5).Seconds),
                    Deleted = reader.GetString(6)
                };
                return singleEvent;
                
            }
            catch
            {
                return new Event();
            }
        }


        /*
        When testing the insert event, make sure your data is formatted like this or it will not work
        {
            "name": "Post test",
            "description": "Testing our post method",
            "date": "2025-12-25T04:15:26.758Z",
            "startTime": "2025-12-25T11:00:00.000Z",
            "endTime": "2025-04-09T15:30:00.000Z",
            "deleted": "n"
        }
        */
        public async Task InsertEventAsync(Event newEvent)
        {
            try{
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string sql = $"insert into o8gync8ricmopt1y.events (event_name, event_description, event_date, event_start_time, event_end_time, deleted) values (@event_name, @event_description, @event_date, @event_start_time, @event_end_time, @deleted);";

                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@event_name", newEvent.Name);
                command.Parameters.AddWithValue("@event_description", newEvent.Description);
                command.Parameters.AddWithValue("@event_date", newEvent.Date.Date);
                command.Parameters.AddWithValue("@event_start_time", newEvent.StartTime.TimeOfDay);
                command.Parameters.AddWithValue("@event_end_time", newEvent.EndTime.TimeOfDay);
                command.Parameters.AddWithValue("@deleted", "n");
                command.Prepare();

                await command.ExecuteNonQueryAsync();
                connection.Close();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }

        public async Task DeleteEventAsync(int id)
        {
            try
            {
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string sql = $"update events set deleted = 'y' where (event_id = @id);";

                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@id", id);
                command.Prepare();

                await command.ExecuteNonQueryAsync();
                connection.Close();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }

        public async Task UpdateEventAsync(Event updatedEvent)
        {
            try
            {
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string sql = "update o8gync8ricmopt1y.events set event_name = @event_name, event_description = @event_description, event_date = @event_date, event_start_time = @event_start_time, event_end_time = @event_end_time, deleted = @deleted where event_id = @id";
                
                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@id", updatedEvent.ID);
                command.Parameters.AddWithValue("@event_name", updatedEvent.Name);
                command.Parameters.AddWithValue("@event_description", updatedEvent.Description);
                command.Parameters.AddWithValue("@event_date", updatedEvent.Date.Date);
                command.Parameters.AddWithValue("@event_start_time", updatedEvent.StartTime.TimeOfDay);
                command.Parameters.AddWithValue("@event_end_time", updatedEvent.EndTime.TimeOfDay);
                command.Parameters.AddWithValue("@deleted", updatedEvent.Deleted);
                command.Prepare();

                await command.ExecuteNonQueryAsync();
                connection.Close();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    
        public async Task<List<Admin>> GetAllAdminAsync()
        {
            List<Admin> admins = [];

            using var connection = new MySqlConnection(cs);
            await connection.OpenAsync();

            using var command = new MySqlCommand("SELECT * FROM o8gync8ricmopt1y.admin where deleted = 'n';", connection);

            using var reader = await command.ExecuteReaderAsync();
            while(await reader.ReadAsync())
            {
                admins.Add(new Admin(){
                    ID = reader.GetInt32(0),
                    FirstName = reader.GetString(1),
                    LastName = reader.GetString(2),
                    Email = reader.GetString(3),
                    Password = reader.GetString(4),
                    PhoneNumber = reader.GetString(5),
                    Deleted = reader.GetString(6)
                });
            }
            return admins;
        }

        public async Task<Admin> GetAdminAsync(int id)
        {
            try{
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                using var command = new MySqlCommand($"select * from o8gync8ricmopt1y.admin where admin_id = {id};", connection);

                using var reader = await command.ExecuteReaderAsync();
                await reader.ReadAsync();

                Admin admin = new(){
                    ID = reader.GetInt32(0),
                    FirstName = reader.GetString(1),
                    LastName = reader.GetString(2),
                    Email = reader.GetString(3),
                    Password = reader.GetString(4),
                    PhoneNumber = reader.GetString(5),
                    Deleted = reader.GetString(6)
                };
                return admin;
            }
            catch
            {
                return new Admin();
            }
        }

        // this will function exactly like the insert vendor where you cannot insert duplicate values for unique attributes
        // the unique attribute is admin_email
        public async Task InsertAdminAsync(Admin admin)
        {
            try{
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string sql = $"insert into o8gync8ricmopt1y.admin (admin_first_name, admin_last_name, admin_email, admin_password, admin_phone, deleted) values (@admin_first_name, @admin_last_name, @admin_email, @admin_password, @admin_phone, @deleted);";

                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@admin_first_name", admin.FirstName);
                command.Parameters.AddWithValue("@admin_last_name", admin.LastName);
                command.Parameters.AddWithValue("@admin_email", admin.Email);
                command.Parameters.AddWithValue("@admin_password", admin.Password);
                command.Parameters.AddWithValue("@admin_phone", admin.PhoneNumber);
                command.Parameters.AddWithValue("@deleted", "n");
                command.Prepare();

                await command.ExecuteNonQueryAsync();
                connection.Close();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }

        public async Task DeleteAdminAsync(int id)
        {
            try
            {
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string sql = $"update admin set deleted = 'y' where (admin_id = @id);";

                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@id", id);
                command.Prepare();

                await command.ExecuteNonQueryAsync();
                connection.Close();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
        
        // this will function exactly like the update vendor where you cannot insert duplicate values for unique attributes
        // the unique attribute is admin_email
        public async Task UpdateAdminAsync(Admin admin)
        {
            try
            {
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string sql = "update o8gync8ricmopt1y.admin set admin_first_name = @admin_first_name, admin_last_name = @admin_last_name, admin_email = @admin_email, admin_password = @admin_password, admin_phone = @admin_phone, deleted = @deleted where admin_id = @id";
                
                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@id", admin.ID);
                command.Parameters.AddWithValue("@admin_first_name", admin.FirstName);
                command.Parameters.AddWithValue("@admin_last_name", admin.LastName);
                command.Parameters.AddWithValue("@admin_email", admin.Email);
                command.Parameters.AddWithValue("@admin_password", admin.Password);
                command.Parameters.AddWithValue("@admin_phone", admin.PhoneNumber);
                command.Parameters.AddWithValue("@deleted", "n");
                command.Prepare();

                await command.ExecuteNonQueryAsync();
                connection.Close();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }

        public async Task<List<Booth>> GetAllBoothsAsync()
        {
            List<Booth> booths = [];

            using var connection = new MySqlConnection(cs);
            await connection.OpenAsync();

            using var command = new MySqlCommand(@"SELECT * FROM o8gync8ricmopt1y.booth where deleted = 'n';", connection);

            using var reader = await command.ExecuteReaderAsync();
            while(await reader.ReadAsync())
            {
                booths.Add(new Booth(){
                    ID = reader.GetInt32(0),
                    BoothNumber = reader.GetInt32(1),
                    BoothAvailability = reader.GetString(2),
                    Deleted = reader.GetString(3)
                });
            }
            return booths;
        }

        public async Task<Booth> GetBoothAsync(int id)
        {
            try{
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                using var command = new MySqlCommand($"select * from o8gync8ricmopt1y.booth where booth_id = {id};", connection);

                using var reader = await command.ExecuteReaderAsync();
                await reader.ReadAsync();

                Booth booth = new(){
                    ID = reader.GetInt32(0),
                    BoothNumber = reader.GetInt32(1),
                    BoothAvailability = reader.GetString(2),
                    Deleted = reader.GetString(3)
                };
                return booth;
            }
            catch
            {
                return new Booth();
            }
        }

        public async Task InsertBoothAsync(Booth booth)
        {
            try{
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string sql = $"insert into o8gync8ricmopt1y.booth (booth_num, booth_avail, deleted) values (@booth_num, @booth_avail, @deleted);";

                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@booth_num", booth.BoothNumber);
                command.Parameters.AddWithValue("@booth_avail", "y");
                command.Parameters.AddWithValue("@deleted", "n");
                command.Prepare();

                await command.ExecuteNonQueryAsync();
                connection.Close();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }

        public async Task DeleteBoothAsync(int id)
        {
            try
            {
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string sql = $"update booth set deleted = 'y' where (booth_id = @id);";

                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@id", id);
                command.Prepare();

                await command.ExecuteNonQueryAsync();
                connection.Close();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }

        public async Task UpdateBoothAsync(Booth booth)
        {
            try
            {
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string sql = "update o8gync8ricmopt1y.booth set booth_num = @booth_num, booth_avail = @booth_avail, deleted = @deleted where booth_id = @id";
                
                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@id", booth.ID);
                command.Parameters.AddWithValue("@booth_num", booth.BoothNumber);
                command.Parameters.AddWithValue("@booth_avail", booth.BoothAvailability);
                command.Parameters.AddWithValue("@deleted", "n");
                command.Prepare();

                await command.ExecuteNonQueryAsync();
                connection.Close();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }

        public async Task<List<Uses>> GetAllUsesAsync()
        {
            List<Uses> uses = [];

            using var connection = new MySqlConnection(cs);
            await connection.OpenAsync();

            using var command = new MySqlCommand(@"
            select u.event_id, u.vendor_id, u.booth_id,
                event_name, vendor_name, booth_num, u.deleted
            from uses u join events e on u.event_id = e.event_id
                join vendors v on v.vendor_id = u.vendor_id
                join booth b on b.booth_id = u.booth_id
            where u.deleted = 'n'
            order by u.event_id, u.booth_id;", connection);

            using var reader = await command.ExecuteReaderAsync();
            while(await reader.ReadAsync())
            {
                uses.Add(new Uses(){
                    EventId = reader.GetInt32(0),
                    VendorID = reader.GetInt32(1),
                    BoothID = reader.GetInt32(2),
                    EventName = reader.GetString(3),
                    VendorName = reader.GetString(4),
                    BoothNumber = reader.GetInt32(5),
                    Deleted = reader.GetString(6)
                });
            }
            return uses;
        }

        public async Task<Uses> GetUseAsync(int eventID, int vendorID, int boothID)
        {
            try{
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                using var command = new MySqlCommand($@"
                select u.event_id, u.vendor_id, u.booth_id,
                    event_name, vendor_name, booth_num, u.deleted
                from uses u join events e on u.event_id = e.event_id
                    join vendors v on v.vendor_id = u.vendor_id
                    join booth b on b.booth_id = u.booth_id
                where u.event_id = {eventID} and u.vendor_id = {vendorID} and u.booth_id = {boothID};", connection);

                using var reader = await command.ExecuteReaderAsync();
                await reader.ReadAsync();

                Uses use = new(){
                    EventId = reader.GetInt32(0),
                    VendorID = reader.GetInt32(1),
                    BoothID = reader.GetInt32(2),
                    EventName = reader.GetString(3),
                    VendorName = reader.GetString(4),
                    BoothNumber = reader.GetInt32(5),
                    Deleted = reader.GetString(6)
                };
                return use;
            }
            catch
            {
                return new Uses();
            }
        }

        public async Task InsertUseAsync(Uses use)
        {
            try{
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string sql = $"insert into o8gync8ricmopt1y.uses (event_id, vendor_id, booth_id, deleted) values (@event_id, @vendor_id, @booth_id, @deleted);";

                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@event_id", use.EventId);
                command.Parameters.AddWithValue("@vendor_id", use.VendorID);
                command.Parameters.AddWithValue("@booth_id", use.BoothID);
                command.Parameters.AddWithValue("@deleted", "n");
                command.Prepare();

                await command.ExecuteNonQueryAsync();
                connection.Close();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }

        public async Task DeleteUseAsync(int eventID, int vendorID, int boothID)
        {
            try
            {
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string sql = $@"
                UPDATE o8gync8ricmopt1y.uses SET deleted = 'y' WHERE event_id = @event_id and vendor_id = @vendor_id and booth_id = @booth_id;
                ";

                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@event_id", eventID);
                command.Parameters.AddWithValue("@vendor_id", vendorID);
                command.Parameters.AddWithValue("@booth_id", boothID);
                command.Prepare();

                await command.ExecuteNonQueryAsync();
                connection.Close();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }

        public async Task UpdateUseAsync(int oldEventID, int oldVendorID, int oldBoothID, Uses use)
        {
            try
            {
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string sql = @"
                UPDATE o8gync8ricmopt1y.uses 
                SET event_id = @new_event_id, 
                    vendor_id = @new_vendor_id, 
                    booth_id = @new_booth_id, 
                    deleted = @deleted 
                WHERE event_id = @old_event_id 
                AND vendor_id = @old_vendor_id 
                AND booth_id = @old_booth_id";

                using var command = new MySqlCommand(sql, connection);
                command.Parameters.AddWithValue("@new_event_id", use.EventId);
                command.Parameters.AddWithValue("@new_vendor_id", use.VendorID);
                command.Parameters.AddWithValue("@new_booth_id", use.BoothID);
                command.Parameters.AddWithValue("@deleted", "n");

                command.Parameters.AddWithValue("@old_event_id", oldEventID);
                command.Parameters.AddWithValue("@old_vendor_id", oldVendorID);
                command.Parameters.AddWithValue("@old_booth_id", oldBoothID);
                command.Prepare();

                await command.ExecuteNonQueryAsync();
                connection.Close();
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }




    }
}