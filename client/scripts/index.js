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

// this the java for a login from andrew
//  async function register() {
//     const username = document.getElementById('register-username').value;
//     const password = document.getElementById('register-password').value;

//     const response = await fetch(`${baseUrl}/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password })
//     });

//     const result = await response.json();
//     document.getElementById('output').innerText = JSON.stringify(result);
// }
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

// do image later
function createNavbar()
{
    const appDiv = document.getElementById("app")
    const navbar = document.createElement("nav")
    navbar.className = "navbar sticky-top bg-secondary-subtle"
    navbar.innerHTML = `
    <div class="container-fluid">
        <a class="navbar-brand mb-0 h1" href="#">Tuscaloosa Trade Fair Association</a>
        <button type="button" onclick="handleBecomeAVendor()" class="btn btn-primary">Become a Vendor</button>
        <button type="button" onclick="handleLogin()" class="btn btn-primary">Log-In</button>

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
            <div class="col">
                <h3>Welcome to our website!</h3>
                <br>
                <p>Below you can find the list of our fair dates and a map of our booths</p>
                <button type="button" class="btn btn-primary">Fair Dates</button>
                <button type="button" class="btn btn-primary">Fair Map</button>
            </div>
            <div class="col">
                <img src="images/ttfaLogo.png" alt="ttfaLogo" class="mainLogo">
            </div>
        </div>
    `
    appDiv.appendChild(containers)
}

function vendorTableDescription()
{
    const appDiv = document.getElementById("app")
    const space = document.createElement("br")
    appDiv.appendChild(space)
    const container = document.createElement("div")
    container.className = "container"
    container.innerHTML = `
    <h3>Our Vendors</h3>
    <br>
    <p>Here is the list of local companies that are active vendors at our events. 
    For more information on these vendors and the events they attend, click the "More Info" button.
    </p>
    `
    appDiv.appendChild(container)
}

function vendorTable()
{
    let sortedVendors = vendors.sort((a, b) => a.vendorName.localeCompare(b.vendorName))
    console.log(sortedVendors)
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
    thead.innerHTML = "<tr><th></th><th>Vendor Name</th><th>Goods Sold</th></tr>"
    table.appendChild(thead)

    const tbody = document.createElement("tbody")
    sortedVendors.forEach((vendor) => {
        const row = document.createElement("tr")
        row.innerHTML = `<td><button onclick class="btn btn-danger">More Info</button></td><td>${vendor.vendorName}</td><td>${vendor.type}</td>`
        tbody.appendChild(row)
    })

    table.appendChild(tbody)
    container.appendChild(table)
    appDiv.appendChild(container)
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

function eventTable(){
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
        row.innerHTML = `<td><button onclick="handleOnRegister(${event.id})">${event.register ? 'UnRegister' : 'Register'}</button></td>`
        tbody.appendChild(row)
       

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


async function handleOnRegister(shopID) {


    const response = await fetch(url + "/" + shopID,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

   

   await  handleOnLoad();
}

 function handleLogin(){ 
   
        const appDiv = document.getElementById("app");
        const space = document.createElement("br");
        appDiv.appendChild(space);
    
        const container = document.createElement("div");
        container.className = "container";
        container.innerHTML = `
        <form>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1">
  </div>
  <div class="mb-3 form-check">


  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
   
`;

        appDiv.appendChild(container);
         
    }

    function handleBecomeAVendor(){
        const appDiv = document.getElementById("app");
        const space = document.createElement("br");
        appDiv.appendChild(space);
    
        const container = document.createElement("div");
        container.className = "container";
        container.innerHTML = `
        <form>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1">
  </div>
  <div class="mb-3 form-check">


  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
   
`;

        appDiv.appendChild(container);
    }

    