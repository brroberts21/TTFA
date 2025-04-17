// arrays and url
admin = []
approvals = []
booths = []
deletions = []
events = []
managers = []
users = []
vendors = []
baseUrl = "http://localhost:5246/api/"


async function handleOnLoad()
{
    await getData()
    attendeePage()
}

// attendee home page methods
async function attendeePage()
{
    createNavbar()
    attendeePageDescription()
    vendorTableDescription()
    vendorTable()
}

function createNavbar()
{
    const appDiv = document.getElementById("app")
    const navbar = document.createElement("nav")
    navbar.className = "navbar sticky-top";
    navbar.style.backgroundColor = "rgb(5,20,100)";
    navbar.style.color = "white";
    navbar.innerHTML = `
    <div class="container-fluid">
        <a class="navbar-brand mb-0 h1" style="color: white" href="#">Tuscaloosa Trade Fair Association</a>
        
        <button type="button" class="btn btn-primary" id="main-btn" onclick="handleBecomeAVendor()">Become A Vendor</button>
        <button type="button" class="btn btn-primary" id="main-btn" onclick="handleLogin()">Log-In</button>

    </div>
    `
    appDiv.appendChild(navbar)
}

async function attendeePageDescription()
{
    createAttendeePageContainers()
    createEventCarousel()
    createEventTableModal()
    createMapModal()
}

function createAttendeePageContainers()
{
    const appDiv = document.getElementById("app")
    const space = document.createElement("br")
    appDiv.appendChild(space)
    const containers = document.createElement("div")
    containers.className = "container text-center"
    containers.innerHTML = `
    <div class="row">
            <div class="col" id="attendeeDescription">
                <h3 style="color: rgb(5,20,100)">Welcome to the TTFA website!</h3>
                <br>
                <p>At the Tuscaloosa Trade Fair, we host events featuring local vendors located in and around Tuscloosa County, Alabama.</p>
                <br>
                <h5>Here are some of our upcoming events:</h5>
            </div>
            <div class="col">
                <img src="images/ttfaLogo.png" alt="ttfaLogo" class="mainLogo">
            </div>
        </div>
    `
    appDiv.appendChild(containers)
}

function createEventCarousel()
{
    const conatiner = document.getElementById("attendeeDescription")
    const carousel = document.createElement("div")
    carousel.innerHTML = `
    <div id="carousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner" id="innerCarousel">
        
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
    <br>
    <br>
    <p>For a complete list of our future events, click the "Fair Dates" button below. We also have a map of the fairgrounds that can be accessed by using the "Fair Map" button."
    <br>
    <br>
    <button type="button" class="btn" id="main-btn" data-bs-toggle="modal" data-bs-target="#eventTableModal">Fair Dates</button>
    <button type="button" class="btn" id="main-btn" data-bs-toggle="modal" data-bs-target="#mapModal">Fair Map</button>
    `
    conatiner.appendChild(carousel)
    createEventCards()
}

function createEventCards()
{
    let sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date))
    const carousel = document.getElementById("innerCarousel")
    sortedEvents.forEach((event, index) => {        
        const carouselSlide = document.createElement("div")
        carouselSlide.className = index === 0 ? "carousel-item active" : "carousel-item"

        const card = document.createElement("div")
        card.className = "card"
        card.innerHTML = `
        <div class="card event-card" style="width: 100%; height: 100%;">
            <div class="card-body">
                <h5 class="card-title" style="color: rgb(5,20,100)">${event.name}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">${new Date(event.date).toLocaleDateString()} | ${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h6>
                <p class="card-text">${event.description}</p>
            </div>
        </div>
        `
        carouselSlide.appendChild(card)
        carousel.appendChild(carouselSlide)
    })
}

async function createEventTableModal()
{
    const appDiv = document.getElementById("app")
    const eventTableModal = document.createElement("div")
    eventTableModal.innerHTML =`
    <div class="modal fade" id="eventTableModal" tabindex="-1" aria-labelledby="eventTableModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header" style="background-color: rgb(5, 20, 100); color: white;">
                    <h1 class="modal-title fs-5" id="eventTableModalLabel">All Upcoming Events</h1>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Here is the complete list of upcoming events with our closest events at the top.</p>
                    <select id="event-month-dropdown" onchange="handleEventFilter()" class="dropdown">
                        <option value="">All Months</option>
                    </select>
                    <select id="event-year-dropdown" onchange="handleEventFilter()" class="dropdown">
                        <option value="">All Years</option>
                    </select>
                    <div id="eventModalTable" class=container>

                    </div>
                </div>
            </div>
        </div>
    </div>
    `
    appDiv.appendChild(eventTableModal)
    await EventTable()
    handleEventMonthDropdown()
    handleEventYearDropdown()
    handleEventFilter()
}

function handleEventFilter()
{
    var table, tr, i, selectedMonth
    table = document.getElementById("event-table-modal")
    tr = table.getElementsByTagName("tr")
    selectedMonth = document.getElementById("event-month-dropdown").value
    selectedYear = document.getElementById("event-year-dropdown").value
  
    for (i = 0; i < tr.length; i++) 
    {
        const tds = tr[i].getElementsByTagName("td")

        if (tds.length > 0) {
            const eventDate = new Date(tds[1].textContent)

            const eventMonth = eventDate.getMonth()
            const eventYear = eventDate.getFullYear()

            const matchesMonth = selectedMonth === "" || parseInt(selectedMonth) === eventMonth
            const matchesYear = selectedYear === "" || parseInt(selectedYear) === eventYear

            if (matchesMonth && matchesYear) {
                tr[i].style.display = ""
            } else {
                tr[i].style.display = "none"
            }
        }
    }
}

function handleEventMonthDropdown()
{
    // populate by month
    const months = [...new Set(events.map(e => new Date(e.date).getMonth()))]
    const dropdown = document.getElementById("event-month-dropdown")
    months.sort((a, b) => a - b)
    months.forEach(month => 
        {
            const option = document.createElement("option")
            option.value = month
            option.textContent = new Date(0, month).toLocaleString('default', { month: 'long' })
            dropdown.appendChild(option)
        }
    )
}

function handleEventYearDropdown()
{
    // populate by year
    const years = [...new Set(events.map(e => new Date(e.date).getFullYear()))]
    const dropdown = document.getElementById("event-year-dropdown")
    years.sort((a, b) => a - b)
    years.forEach(year => 
        {
            const option = document.createElement("option")
            option.value = year
            option.textContent = year
            dropdown.appendChild(option)
        }
    )
}

async function EventTable()
{
    let sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date))
    
    const tableDiv = document.getElementById("eventModalTable")
    const space = document.createElement("br")
    tableDiv.appendChild(space)
    
    if(sortedEvents.length > 0)
    {
        const table = document.createElement("table")
        table.id = "event-table-modal"
        table.className = "table table-bordered table-hover"
        table.style.tableLayout = "auto";
        table.style.width = "auto";
        table.style.whiteSpace = "nowrap";
        const thead = document.createElement("thead")
        thead.innerHTML = "<th>Event Name</th><th>Event Date</th><th>Start Time</th><th>End Time</th><th>Vendors</th>"
        table.appendChild(thead)

        const tbody = document.createElement("tbody")
        for(const event of sortedEvents) {
            const count = await getVendorCount(event.id)

            const row = document.createElement("tr")
            row.innerHTML = `
                <td>${event.name}</td><td>${new Date(event.date).toLocaleDateString()}</td>
                <td>${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>${count}</td>`
            tbody.appendChild(row)
        }

        table.appendChild(tbody)
        tableDiv.appendChild(table)
    }
    else
    {
        tableDiv.innerHTML = `<p>There are currently no scheduled events.</p>`
    }
}

function createMapModal()
{
    const appDiv = document.getElementById("app")
    const mapModal = document.createElement("div")
    mapModal.innerHTML =`
    <div class="modal fade" id="mapModal" tabindex="-1" aria-labelledby="mapModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header" style="background-color: rgb(5, 20, 100); color: white;">
                    <h1 class="modal-title fs-5" id="mapModalLabel">Map of the Tuscaloosa Trade Fair</h1>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <img src="images/map.png" alt="ttfaMap" class="tffaMap">
                </div>
            </div>
        </div>
    </div>
    `
    appDiv.appendChild(mapModal)
}

function vendorTableDescription()
{
    const appDiv = document.getElementById("app")
    const space = document.createElement("br")
    appDiv.appendChild(space)
    const container = document.createElement("div")
    container.className = "container"
    container.innerHTML = `
    <h3 style="color: rgb(5,20,100)">Our Vendors</h3>
    <p id="venTabDescrip">Here is the list of local companies that are active vendors at our events. 
    For more information on these vendors and the events they attend, click the "More Info" button. If you're looking for a specific vendor, feel free to use
    the searchbar to see if they are registered as vendors with the TTFA. You can also filter our vendors by their goods sold using the dropdown menu by the search bar.
    </p>
    <h5 style="color: rgb(5,20,100)">Search for a Vendor:</h5>
    <div style="display: flex; align-items: center; gap: 10px;">
        <input type="text" id="searchbar" onkeyup="handleSearch()" placeholder="Enter the vendor's name here...">
        <select id="vendor-dropdown" onchange="handleSearch()" class="dropdown">
            <option value="">All Types</option>
        </select>
    </div>
    `
    appDiv.appendChild(container)
    handleVendorTypeDropdown()
}

function handleSearch()
{
    var input, filter, table, tr, i, selectedType
    input = document.getElementById("searchbar")
    filter = input.value.toUpperCase()
    table = document.getElementById("vendor-table-main")
    tr = table.getElementsByTagName("tr")
    selectedType = document.getElementById("vendor-dropdown").value
  
    for (i = 0; i < tr.length; i++) 
    {
        const nameTD = tr[i].getElementsByTagName("td")[1]
        const typeTD = tr[i].getElementsByTagName("td")[2]

        if (nameTD && typeTD) 
        {
            const nameValue = nameTD.textContent || nameTD.innerText
            const typeValue = typeTD.textContent || typeTD.innerText

            let matchesName = false
            let matchesType = false

            if (nameValue.toUpperCase().indexOf(filter) > -1) 
            {
                matchesName = true
            }

            if (!selectedType || typeValue === selectedType) 
            {
                matchesType = true
            }

            if (matchesName && matchesType) 
            {
                tr[i].style.display = ""
            } 
            else 
            {
                tr[i].style.display = "none"
            }
        }
    }
}

function handleVendorTypeDropdown()
{
    const goodsTypes = [... new Set(vendors.map(v => v.type))]
    const dropdown = document.getElementById("vendor-dropdown")
    goodsTypes.forEach(type => 
        {
            const option = document.createElement("option")
            option.value = type
            option.textContent = type
            dropdown.appendChild(option)
        }
    )
}

function vendorTable()
{
    let sortedVendors = vendors.sort((a, b) => a.vendorName.localeCompare(b.vendorName))
    console.log(sortedVendors)
    const appDiv = document.getElementById("app")

    const container = document.createElement("div")
    container.className = "container"
    const table = document.createElement("table")
    table.id = "vendor-table-main"
    table.className = "table table-bordered table-hover"
    const thead = document.createElement("thead")
    thead.innerHTML = "<tr><th></th><th>Vendor Name</th><th>Goods Sold</th></tr>"
    table.appendChild(thead)

    const tbody = document.createElement("tbody")
    sortedVendors.forEach((vendor) => {
        const row = document.createElement("tr")
        
        const button = document.createElement("button")
        button.id = "main-btn"
        button.className = "btn"
        button.textContent = "More Info"
        button.setAttribute("data-bs-toggle", "modal")
        button.setAttribute("data-bs-target", "#vendorInfoModal")
        button.addEventListener("click", () => vendorInfo(vendor))
        row.appendChild(document.createElement("td")).appendChild(button)

        const vendorName = document.createElement("td")
        vendorName.innerHTML = `${vendor.vendorName}`
        row.appendChild(vendorName)
        const vendorType = document.createElement("td")
        vendorType.innerHTML = `${vendor.type}`
        row.appendChild(vendorType) 
        tbody.appendChild(row)
    })

    table.appendChild(tbody)
    container.appendChild(table)
    appDiv.appendChild(container)

    const modal = document.createElement("div")
    modal.innerHTML =`
    <div class="modal fade" id="vendorInfoModal" tabindex="-1" aria-labelledby="vendorInfoLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header" style="background-color: rgb(5, 20, 100); color: white;">
                    <h1 class="modal-title fs-5" id="vendorInfoLabel" ></h1>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="vendorInfoBody">
                    
                </div>
            </div>
        </div>
    </div>
    `
    appDiv.appendChild(modal)
}

function vendorInfo(vendor)
{
    const vendorModalHeader = document.getElementById("vendorInfoLabel")
    vendorModalHeader.innerHTML = `Vendor Profile`
    const vendorModalBody = document.getElementById("vendorInfoBody")
    vendorModalBody.innerHTML = `
    <h5>About ${vendor.vendorName}</h5>
    <ul>
        <li>Owner Name: ${vendor.ownerFirstName} ${vendor.ownerLastName}</li>
        <li>Email: ${vendor.vendorEmail || "N/A"}</li>
        <li>Phone Number: ${vendor.vendorPhone || "N/A"}</li>
        <li>Social Media: ${vendor.vendorSocial ? `@${vendor.vendorSocial}` : "N/A"}</li>
    </ul>
    <h5>${vendor.vendorName}'s Events:</h5>
    <div id="vendorModalTable" class=container>

    </div>
    `
    vendorEventsTable(vendor.id)
}

async function vendorEventsTable(vendorID)
{
    vendor = await getVendor(vendorID)
    vendorEvents = await getAllVendorEvents(vendorID)
    let sortedEvents = vendorEvents.sort((a, b) => new Date(a.date) - new Date(b.date))
    
    const tableDiv = document.getElementById("vendorModalTable")
    if(vendorEvents.length > 0)
    {
        const table = document.createElement("table")
        table.id = "vendor-table-modal"
        table.className = "table table-bordered table-hover"
        table.style.tableLayout = "auto";
        table.style.width = "auto";
        table.style.whiteSpace = "nowrap";
        const thead = document.createElement("thead")
        thead.innerHTML = "<th>Event Name</th><th>Event Date</th><th>Start Time</th><th>End Time</th><th>Booth Number</th>"
        table.appendChild(thead)

        const tbody = document.createElement("tbody")
        for (const event of sortedEvents) {
            const boothNum = await getBoothNumber(event.id, vendorID);
            const row = document.createElement("tr");
            row.innerHTML = `<td>${event.name}</td><td>${new Date(event.date).toLocaleDateString()}</td><td>${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td><td>${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td><td>${boothNum}</td>`;
            tbody.appendChild(row);
        }

        table.appendChild(tbody)
        tableDiv.appendChild(table)
    }
    else
    {
        tableDiv.innerHTML = `<p>${vendor.vendorName} is currently not scheduled for any events.</p>`
    }
}

// vendor home page methods
function vendorPage(){
    const app = document.getElementById("app");
    app.innerHTML = ""; 

    vendorPageDescription();
    eventTable();
}

function vendorPageDescription(){
    const app = document.getElementById("app"); 
    app.innerHTML = "";  

    const table = document.createElement("table");
    table.className = "table table-bordered";

    const thead = document.createElement("thead");
    thead.innerHTML =  `
        <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Business</th>
            <th>Email</th>
            <th>Status</th>
        </tr>`;  
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    let sortedEvents = events.sort((a, b) => a.eventName.localeCompare(b.eventName));

    sortedEvents.forEach((event) => {
        const row = document.createElement("tr");
        row.innerHTML =  `
            <td>${event.eventName}</td>
            <td>${event.eventDescription }</td>
            <td>${vendor.vendorName}</td>
            <td>${vendor.email}</td>
          <td><button onclick="handleOnApprove(${vendor.id})">${vendor.approvev? 'Deny ' : 'Approve'}</button></td>
           
        `;
        tbody.appendChild(row);
    });


    table.appendChild(tbody);
    app.appendChild(table); 



}
   

function eventTable(events){
   
    console.log(sortedEvents)
    const appDiv = document.getElementById("app")

    const space = document.createElement("br")
    appDiv.appendChild(space)

    const container = document.createElement("div")
    container.className = "container"
    const table = document.createElement("table")
    table.className = "table table-striped table-bordered table-primary table-hover"
    table.style.tableLayout = "auto";
    table.style.width = "auto";
    table.style.whiteSpace = "nowrap";
    const thead = document.createElement("thead")
    thead.innerHTML = "<tr><th></th><th>Event Name</th><th></tr>"
    table.appendChild(thead)

    const tbody = document.createElement("tbody")
    sortedEvents.forEach((event) => {
        
        const row = document.createElement("tr")
        row.innerHTML = `
            <td>
                <button class="btn btn-primary" onclick="handleOnRegister(${event.id})">
                    ${event.register ? 'Unregister' : 'Register'}
                </button>
            </td>
            <td>${event.eventName}</td>
        `
        tbody.appendChild(row)
    })

    table.appendChild(tbody)
    container.appendChild(table)
    appDiv.appendChild(container)
}

// admin home page methods
async function handleOnAdmin(vendors) {
    const app = document.getElementById("app"); 
    app.innerHTML = "";  

    const table = document.createElement("table");
    table.className = "table table-bordered";

    const thead = document.createElement("thead");
    thead.innerHTML =  `
        <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Business</th>
            <th>Email</th>
            <th>Status</th>
        </tr>`;  
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    let sortedVendors = vendors.sort((a, b) => a.vendorName.localeCompare(b.vendorName));

    sortedVendors.forEach((vendor) => {
        const row = document.createElement("tr");
        row.innerHTML =  `
            <td>${vendor.ownerFirstName} ${vendor.ownerLastName}</td>
            <td>${vendor.phone}</td>
            <td>${vendor.vendorName}</td>
            <td>${vendor.email}</td>
          <td><button onclick="handleOnApprove(${vendor.id})">${vendor.approvev? 'Deny ' : 'Approve'}</button></td>
           
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    app.appendChild(table); 
} 
   
async function handleOnApprove(vendorID) {
    const response = await fetch(url + "/" + vendorID,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

   await  handleOnLoad();
}


// data methods
async function getData()
{
    await getAllAdmin()
    await getAllApprovals()
    await getAllBooths()
    await getAllDeletions()
    await getAllEvents()
    await getAllManagers()
    await getAllUsers()
    await getAllVendors()
}
// admin data methods
async function getAllAdmin()
{
    url = baseUrl + "Admin"
    let response = await fetch(url)
    admins = await response.json()
    console.log(admins)
}

// approval data methods
async function getAllApprovals()
{
    url = baseUrl + "Approves"
    let response = await fetch(url)
    approvals = await response.json()
    console.log(approvals)
}

// booth data methods
async function getAllBooths()
{
    url = baseUrl + "Booth"
    let response = await fetch(url)
    booths = await response.json()
    console.log(booths)
}

// deletion data methods
async function getAllDeletions()
{
    url = baseUrl + "Deletes"
    let response = await fetch(url)
    deletions = await response.json()
    console.log(deletions)
}

// event data methods
async function getAllEvents()
{
    url = baseUrl + "Event"
    let response = await fetch(url)
    events = await response.json()
    console.log(events)
}

async function getAllVendorEvents(vendorID)
{
    url = baseUrl + `Event/vendor/${vendorID}`
    let response = await fetch(url)
    const data = await response.json()
    return data
}

// manager data methods
async function getAllManagers()
{
    url = baseUrl + "Manages"
    let response = await fetch(url)
    managers = await response.json()
    console.log(managers)
}

// users data methods
async function getAllUsers()
{
    url = baseUrl + "Uses"
    let response = await fetch(url)
    booths = await response.json()
    console.log(booths)
}

async function getVendorCount(eventID)
{
    url = baseUrl + `Uses/${eventID}`
    let response = await fetch(url)
    count = await response.json()
    return count
}

async function getBoothNumber(eventID, vendorID)
{
    url = baseUrl + `Uses/${eventID}/${vendorID}`
    let response = await fetch(url)
    booth = await response.json()
    return booth
}


// vendor data methods
async function getAllVendors()
{
    url = baseUrl + "Vendor"
    let response = await fetch(url)
    vendors = await response.json()
    console.log(vendors)
}

async function getVendor(vendorID)
{
    url = baseUrl + `Vendor/${vendorID}`
    let response = await fetch(url)
    return await response.json()
}

async function handleOnRegister(eventID) {


    const response = await fetch(url + "/" + eventID,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

   await  handleOnLoad();
}

function handleLogin(vendor){ 
    
        const appDiv = document.getElementById("app"); 
    
        const loginModal = document.createElement("div");
        loginModal.innerHTML = `
        <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header" style="background-color: rgb(5,20,100); color: white;">
                <h1 class="modal-title fs-5" id="loginModalLabel">User Login</h1>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="login-form">
                  <div class="mb-3">
                    <label for="login-username" class="form-label">Username</label>
                    <input type="text" class="form-control" id="login-username" required>
                  </div>
                  <div class="mb-3">
                    <label for="login-password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="login-password" required>
                  </div>
                  <div id="login-output" class="text-danger mb-2"></div>
                  <button type="submit" class="btn btn-primary">Login</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        `;
    
        appDiv.appendChild(loginModal);
    
        const modal = new bootstrap.Modal(document.getElementById('loginModal'));
        modal.show();
    
        const loginForm = document.getElementById("login-form");
        loginForm.addEventListener("submit", function (event) {
            
    
            const username = document.getElementById("login-username").value.trim();
            const password = document.getElementById("login-password").value.trim();
    
            
            if (username === "admin" && password === "password") {
                modal.hide(); 
                handleOnAdmin(vendors); 
                return;
            }
    
        
            const matchingVendor = vendors.find(v => v.vendorName.toLowerCase() === username.toLowerCase());
    
            if (matchingVendor && password === "mis321") {
                modal.hide(); 
                vendorPage(); 
            } else {
                document.getElementById("login-output").textContent = "Invalid username or password.";
            }
        });
    }
    function handleBecomeAVendor() {
        const appDiv = document.getElementById("app");
    
        const vendorModal = document.createElement("div");
        vendorModal.innerHTML = `
        <div class="modal fade" id="vendorModal" tabindex="-1" aria-labelledby="vendorModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header" style="background-color: rgb(5,20,100); color: white;">
                <h1 class="modal-title fs-5" id="vendorModalLabel">Become a Vendor</h1>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p class="mb-3">
                  Describe your company, including the items you sell and any information you'd like to be visible to our customers.
                </p>
                <div class="mb-3">
                  <label for="vendor-description" class="form-label">Company Description</label>
                  <textarea class="form-control" id="vendor-description" rows="4" placeholder="Tell us about your business..."></textarea>
                </div>
                <form id="login-form">
                  <div class="mb-3">
                    <label for="login-username" class="form-label">Username</label>
                    <input type="text" class="form-control" id="login-username" required>
                  </div>
                  <div class="mb-3">
                    <label for="login-password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="login-password" required>
                  </div>
                  <div id="login-output" class="text-danger mb-2"></div>
                  <button type="submit" class="btn btn-primary">Apply</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        `;
    
        appDiv.appendChild(vendorModal);
    
        const modal = new bootstrap.Modal(document.getElementById('vendorModal'));
        modal.show();
    }