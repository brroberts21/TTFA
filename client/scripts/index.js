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
function attendeePage()
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

function attendeePageDescription()
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
                <p>Below you can find the list of our current fair dates and a map of our booths.</p>
                <button type="button" class="btn" id="main-btn">Fair Dates</button>
                <button type="button" class="btn" id="main-btn" data-bs-toggle="modal" data-bs-target="#mapModal">Fair Map</button>
            </div>
            <div class="col">
                <img src="images/ttfaLogo.png" alt="ttfaLogo" class="mainLogo">
            </div>
        </div>
    `
    appDiv.appendChild(containers)

    const modal = document.createElement("div")
    modal.innerHTML =`
    <div class="modal fade" id="mapModal" tabindex="-1" aria-labelledby="mapModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="mapModalLabel">Map of the Tuscaloosa Trade Fair</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <img src="images/map.png" alt="ttfaMap" class="tffaMap">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    `
    appDiv.appendChild(modal)
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
    <h4 style="color: rgb(5,20,100)">Search for a Vendor:</h4>
    <div style="display: flex; align-items: center; gap: 10px;">
        <input type="text" id="searchbar" onkeyup="handleSearch()" placeholder="Search for vendors here...">
        <select id="vendor-dropdown" onchange="handleSearch()">
            <option value="">All Types</option>
        </select>
    </div>
    `
    appDiv.appendChild(container)
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
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    `
    appDiv.appendChild(modal)

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

function vendorInfo(vendor)
{
    const vendorModalHeader = document.getElementById("vendorInfoLabel")
    vendorModalHeader.innerHTML = `Vendor Profile`
    const vendorModalBody = document.getElementById("vendorInfoBody")
    vendorModalBody.innerHTML = `
    <h5>About ${vendor.vendorName}</h5>
    <ul>
        <li>Owner Name: ${vendor.ownerFirstName} ${vendor.ownerLastName}</li>
        <li>Email: ${vendor.email || "N/A"}</li>
        <li>Phone Number: ${vendor.phone || "N/A"}</li>
        <li>Social Media: ${vendor.social || "N/A"}</li>
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
        sortedEvents.forEach((event) => {
            const row = document.createElement("tr")
            row.innerHTML = `<td>${event.name}</td><td>${new Date(event.date).toLocaleDateString()}</td><td>${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td><td>${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td><td>placeholder}</td>`
            tbody.appendChild(row)
        })

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
    vendorPageDescription();
    eventTable();
}

function vendorPageDescription(){
    const appDiv = document.getElementById("app")
    const space = document.createElement("br")
    appDiv.appendChild(space)
    const container = document.createElement("div")
    container.className = "container"
    container.innerHTML = `
    <h3>Upcoming Events</h3>
    <br>
    
    `
    appDiv.appendChild(container)


}

function eventTable(event){
    let sortedEvents = events.sort((a, b) => a.eventName.localeCompare(b.eventName))
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

function handleLogin(){ 
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
       

        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;

        if (username === "admin" && password === "password") {
            modal.hide(); 
            handleOnAdmin(); 
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
                    <form id="vendor-form">
                      <div class="mb-3">
                        <label for="vendor-username" class="form-label">Username</label>
                        <input type="text" class="form-control" id="vendor-username" required>
                      </div>
                      <div class="mb-3">
                        <label for="vendor-password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="vendor-password" required>
                      </div>
                      <div class="mb-3">
                        <label for="vendor-description" class="form-label">Describe Your Company</label>
                        <textarea class="form-control" id="vendor-description" rows="4" placeholder="What items would you like to sell and any information you would like visible to our customers..."></textarea>
                      </div>
                      <div id="vendor-output" class="text-danger mb-2"></div>
                      <button type="submit" class="btn btn-primary">Become a Vendor</button>
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
       
        
        
        async function handleOnAdmin() {
            document.body.innerHTML = `
                <h1>Admin Page</h1>
                <p>Upcoming Events</p>
                <table class="table">
  <thead class="thead-dark">
    <tr>
      <th scope="col">#</th>
      <th scope="col">Name</th>
      <th scope="col">Business</th>
      <th scope="col">Phone Number</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>John Smith</td>
      <td>Crimson Harvest </td>
      <td>(205)-555-101</td>
      <td>
      <button class="btn btn-danger toggle-btn">Denied</button>
  </td>
      
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Sarah Williams</td>
      <td>Druid City Delight</td>
      <td>(205)555-0104</td>
      <td>
       <button class="btn btn-success toggle-btn">Approved</button>
                    </td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Green Thimb Gardens</td>
      <td>Plants</td>
      <td>(205)-555-0107</td>
      <td>
      <button class="btn btn-danger toggle-btn">Denied</button>
  </td>
    </tr>
  </tbody>
</table>


</table>
            `;
            const buttons = document.querySelectorAll('.toggle-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.textContent === 'Approved') {
                button.textContent = 'Deniedd';
                button.classList.remove('btn-success');
                button.classList.add('btn-danger');
            } else {
                button.textContent = 'Approved';
                button.classList.remove('btn-danger');
                button.classList.add('btn-success');
            }
        });
    });
        }
           