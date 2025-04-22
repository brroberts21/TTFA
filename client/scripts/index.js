// arrays and url
let currentAdmin = null
let currentVendor = null
admin = []
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
    appDiv.innerHTML = ""
    const navbar = document.createElement("nav")
    navbar.className = "navbar sticky-top";
    navbar.style.backgroundColor = "rgb(5,20,100)";
    navbar.style.color = "white";
    navbar.innerHTML = `
    <div class="container-fluid">
        <a class="navbar-brand mb-0 h1" style="color: white" href="#" onclick="handleOnLoad()">Tuscaloosa Trade Fair Association</a>
        <div class="ms-auto d-flex gap-2">
            <a href="#" style="color: white; text-decoration: underline;" onclick="handleBecomeAVendor()">Become A Vendor</a>
            <a href="#" style="color: white; text-decoration: underline;" onclick="handleLogin()">Log-In</a>
        </div>
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
    
    const topFiveEvents = sortedEvents.slice(0, 5)

    topFiveEvents.forEach((event, index) => {        
        const carouselSlide = document.createElement("div")
        carouselSlide.className = index === 0 ? "carousel-item active" : "carousel-item"

        const card = document.createElement("div")
        card.className = "card"
        card.innerHTML = `
        <div class="card event-card" style="width: 100%; height: 100%;">
            <div class="card-body">
                <h5 class="card-title" style="color: rgb(5,20,100)">${event.name}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">
                    ${new Date(event.date).toLocaleDateString()} | ${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to 
                    ${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </h6>
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
                    <div id="eventModalTableDiv" class=container>

                    </div>
                </div>
            </div>
        </div>
    </div>
    `
    appDiv.appendChild(eventTableModal)
    await EventTable("eventModalTableDiv")
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

async function EventTable(divID)
{
    let sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date))
    
    const tableDiv = document.getElementById(`${divID}`)
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

async function vendorTableDescription()
{
    const approvedVendors = await getAllApprovedVendors()
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
    Here is the list of goods our vendors are currently selling:
    </p>
    <ul id=typeList> </ul>
    <h5 style="color: rgb(5,20,100)">Search for a Vendor:</h5>
    <div style="display: flex; align-items: center; gap: 10px;">
        <input type="text" id="searchbar" onkeyup="handleSearch('vendor-table-main')" placeholder="Enter the vendor's name here...">
        <select id="vendor-dropdown" onchange="handleSearch('vendor-table-main')" class="dropdown">
            <option value="">All Types</option>
        </select>
    </div>
    `
    appDiv.appendChild(container)
    populateTypeList()
    handleVendorTypeDropdown(approvedVendors)
}

async function populateTypeList()
{
    const approvedVendors = await getAllApprovedVendors()
    list = document.getElementById("typeList")
    const goodsTypes = [... new Set(approvedVendors.map(v => v.type))]
    goodsTypes.forEach(type =>{
        const item = document.createElement("li")
        item.textContent = type
        list.appendChild(item)
    })
}

function handleSearch(tableName)
{
    var input, filter, table, tr, i, selectedType
    input = document.getElementById("searchbar")
    filter = input.value.toUpperCase()
    table = document.getElementById(`${tableName}`)
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

function handleVendorTypeDropdown(list)
{
    const goodsTypes = [... new Set(list.map(v => v.type))]
    const dropdown = document.getElementById("vendor-dropdown")
    dropdown.innerHTML = '<option value="">All Types</option>'
    goodsTypes.forEach(type => 
        {
            const option = document.createElement("option")
            option.value = type
            option.textContent = type
            dropdown.appendChild(option)
        }
    )
}

async function vendorTable()
{
    const approvedVendors = await getAllApprovedVendors()
    let sortedVendors = approvedVendors.sort((a, b) => a.vendorName.localeCompare(b.vendorName))
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
    for(const vendor of sortedVendors)
    {
        const row = document.createElement("tr")

        const link = document.createElement("a")
        link.id = "main-link"
        link.href = "#"
        link.textContent = "More Info"
        link.style.color = "#1414D2"
        link.setAttribute("data-bs-toggle", "modal")
        link.setAttribute("data-bs-target", "#vendorInfoModal")
        link.addEventListener("click", async (event) => {
            event.preventDefault()
            await vendorInfo(vendor)
        })

        const linkTd = document.createElement("td")
        linkTd.appendChild(link)
        row.appendChild(linkTd)

        const vendorName = document.createElement("td")
        vendorName.innerHTML = `${vendor.vendorName}`
        row.appendChild(vendorName)

        const vendorType = document.createElement("td")
        vendorType.innerHTML = `${vendor.type}`
        row.appendChild(vendorType)

        tbody.appendChild(row);
    }

    table.appendChild(tbody)
    container.appendChild(table)
    appDiv.appendChild(container)

    createVendorInfoModal()
}

function createVendorInfoModal()
{
    const appDiv = document.getElementById("app")
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

async function vendorInfo(vendor)
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

    await vendorEventsTable(vendor.id)
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
        sortedEvents.forEach((event, index) => {
            const row = document.createElement("tr")
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${new Date(event.date).toLocaleDateString()}</td>
                <td>${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td class="booth-number-entry">Loading...</td>`
            tbody.appendChild(row)

            const boothCell = row.querySelector(".booth-number-entry")
            
            getBoothNumber(event.id, vendorID)
                .then((boothNumber) => {
                    boothCell.textContent = boothNumber || "N/A"
                })
                .catch(() => {
                    boothCell.textContent = "Error"
                })
        })

        table.appendChild(tbody)
        tableDiv.appendChild(table)
    }
    else
    {
        tableDiv.innerHTML = `<p>${vendor.vendorName} is currently not scheduled for any events.</p>`
    }
}

// account creation methods
function handleBecomeAVendor() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = ""
    AccountCreationNav()
    AccountCreationHeader()
    AccountCreationForm()
}

function AccountCreationNav()
{
    const appDiv = document.getElementById("app")
    appDiv.innerHTML = ""
    const navbar = document.createElement("nav")
    navbar.className = "navbar sticky-top"
    navbar.style.backgroundColor = "rgb(5,20,100)"
    navbar.style.color = "white"
    navbar.innerHTML = `
    <div class="container-fluid">
        <a class="navbar-brand mb-0 h1" style="color: white" href="#" onclick="handleOnLoad()">Tuscaloosa Trade Fair Association</a>
        <div class="ms-auto d-flex gap-2">
            <a href="#" style="color: white; text-decoration: underline;" onclick="handleOnLoad()">Go Home</a>
        </div>
    </div>
    `
    appDiv.appendChild(navbar)

    
}

function AccountCreationHeader()
{
    const appDiv = document.getElementById("app")
    const container = document.createElement("div")
    container.className = "container py-4"
    container.id = "login-form-container"

    const header = document.createElement("h2")
    header.className = "text-center mb-4"
    header.style.color = "rgb(5,20,100)"
    header.innerText = "Thanks for choosing the TTFA! Create your vendor account below."

    container.appendChild(header)
    appDiv.appendChild(container)
}

function AccountCreationForm()
{
    const container = document.getElementById("login-form-container")
    const form = document.createElement("div")
    form.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow p-4">
                <form onsubmit="handleAddVendor(event)">
                    <div class="mb-3">
                        <label for="vendorName" class="form-label">Vendor Name:</label>
                        <input type="text" class="form-control" id="vendorName" name="vendorName" required>
                    </div>

                    <div class="mb-3">
                        <label for="vendorType" class="form-label">Goods Sold</label>
                        <select class="form-select" id="vendorType" name="vendorType" required>
                            <option value="" selected disabled hidden>Choose goods type</option>
                            <option value="Groceries">Groceries</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Art">Art</option>
                            <option value="Food">Food</option>
                            <option value="Home Items">Home Items</option>
                            <option value="Music">Music</option>
                            <option value="Plants">Plants</option>
                        </select>
                    </div>
                    <br>
                    <div class="mb-3">
                        <label for="vendorEmail" class="form-label">Vendor Email:</label>
                        <input type="email" class="form-control" id="vendorEmail" name="vendorEmail" required>
                    </div>

                    <div class="mb-3">
                        <label for="vendorPhone" class="form-label">Vendor Phone Number:</label>
                        <input type="text" class="form-control" id="vendorPhone" name="VendorPhone" required>
                    </div>

                    <div class="mb-3">
                        <label for="socialMedia" class="form-label">Social Media (optional):</label>
                        <div class="input-group">
                            <span class="input-group-text">@</span>
                            <input type="text" class="form-control" id="socialMedia" name="socialMedia">
                        </div>
                    </div>

                    <div class="row mb-3">
                    <div class="col">
                        <label for="ownerFirst" class="form-label">Owner First Name:</label>
                        <input type="text" class="form-control" id="ownerFirst" name="ownerFirst">
                    </div>
                    <div class="col">
                        <label for="ownerLast" class="form-label">Owner Last Name:</label>
                        <input type="text" class="form-control" id="ownerLast" name="ownerLast">
                    </div>
                    </div>

                    <div class="mb-3">
                        <label for="ownerPhone" class="form-label">Owner Phone:</label>
                        <input type="text" class="form-control" id="ownerPhone" name="ownerPhone" required>
                    </div>

                    <div class="mb-3">
                        <label for="ownerEmail" class="form-label">Owner Email (Account Username):</label>
                        <input type="email" class="form-control" id="ownerEmail" name="ownerEmail" required>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Account Password:</label>
                        <input type="password" class="form-control" id="password" required>
                    </div>

                    <button type="submit" class="btn btn-primary w-100" id="main-btn">Create account</button>
                </form>
                </div>
            </div>
        </div>
    `
    container.appendChild(form)
}

async function handleAddVendor(event){
    event.preventDefault()

    const name = document.getElementById("vendorName").value
    const type = document.getElementById("vendorType").value
    const vendorEmail = document.getElementById("vendorEmail").value
    const vendorPhone = document.getElementById("vendorPhone").value
    const vendorSocialInput = document.getElementById("socialMedia").value
    const vendorSocial = vendorSocialInput.trim() === "" ? null : vendorSocialInput.trim()
    const ownerFirst = document.getElementById("ownerFirst").value
    const ownerLast = document.getElementById("ownerLast").value
    const ownerPhone = document.getElementById("ownerPhone").value
    const ownerEmail = document.getElementById("ownerEmail").value
    const password = document.getElementById("password").value

    const newVendor = {
        vendorEmail: vendorEmail,
        vendorPhone: vendorPhone,
        vendorSocial: vendorSocial,
        vendorName: name,
        ownerFirstName: ownerFirst,
        ownerLastName: ownerLast,
        ownerEmail: ownerEmail,
        ownerPassword: password,
        ownerPhone: ownerPhone,
        type: type,
        deleted: "n"
    }
    
    const url = baseUrl + "Vendor"
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }, 
        body: JSON.stringify(newVendor),
    })

    if (response.ok) 
    {
        alert("Vendor account created successfully!")
        handleOnLoad()
    } 
    else 
    {
        alert("Failed to create vendor account.")
    }
}

async function handleAddPendingVendor(vendorID)
{
    const newPendingVendor = {
        vendorID: vendorID,
        deleted: "n"
    }
    
    const url = baseUrl + "Pending"
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }, 
        body: JSON.stringify(newPendingVendor),
    }) 

    if(!response.ok)
    {
        alert("Failed to input vendor into database")
    }
}

function handleLogin()
{ 
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
                <button type="submit" class="btn btn-primary" id="main-btn">Login</button>
            </form>
            </div>
        </div>
        </div>
    </div>
    `;

    appDiv.appendChild(loginModal);

    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();

    const modalElement = document.getElementById('loginModal');
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault()

        const username = document.getElementById("login-username").value.trim();
        const password = document.getElementById("login-password").value.trim();

        
        const admin = admins.find(a => a.email === username && a.password === password)

        if (admin) {
            modal.hide()
            modalElement.addEventListener('hidden.bs.modal', () => {
                modal.dispose()
                adminPage(admin)
            });
            return;

        }

    
        const matchingVendor = vendors.find(v => v.ownerEmail === username && v.ownerPassword === password);

        if (matchingVendor) {
            modal.hide(); 
            vendorPage(matchingVendor); 
        } 
        else {
            document.getElementById("login-output").textContent = "Invalid username or password.";
        }

    });
}

// vendor home page methods
async function vendorPage(vendor)
{
    const pendingVendors = await getAllPendingVendors()
    const approvedVendors = await getAllApprovedVendors()
    currentVendor = vendor
    const app = document.getElementById("app");
    app.innerHTML = ""; 
    console.log(approvedVendors)



    vendorPageNavbar(vendor)
    vendorPageHeader(vendor, pendingVendors, approvedVendors)
    vendorPageContainers()
    notAttendingTable(vendor, pendingVendors, approvedVendors)
    attendingTable(vendor)
}

function vendorPageNavbar(vendor)
{
    const appDiv = document.getElementById("app")
    appDiv.innerHTML = ""
    const navbar = document.createElement("nav")
    navbar.className = "navbar sticky-top";
    navbar.style.backgroundColor = "rgb(5,20,100)";
    navbar.style.color = "white";
    navbar.innerHTML = `
    <div class="container-fluid">
        <a class="navbar-brand mb-0 h1" style="color: white" href="#" onclick="handleOnLoad()">Tuscaloosa Trade Fair Association</a>
        <div class="ms-auto d-flex gap-3 align-items-center">
            <a href="#" style="color: white; text-decoration: underline;" data-bs-toggle="modal" data-bs-target="#accountModal">Edit Account</a>
            <a href="#" style="color: white; text-decoration: underline;" onclick="handleOnLoad()">Sign Out</a>
        </div>
    </div>
    `
    appDiv.appendChild(navbar)
    vendorAccountModal(vendor)
}

function vendorPageHeader(vendor, pendingVendors, approvedVendors)
{
    const appDiv = document.getElementById("app")
    const container = document.createElement("div")
    container.className = "container-fluid"
    container.innerHTML = ""; 

    const header = document.createElement("h2")
    header.textContent = `Welcome to the vendor portal, ${vendor.ownerFirstName}!`
    header.style.color = "rgb(5,20,100)"
    container.appendChild(header)

    const status = document.createElement("h5")
    let vendorStatus = "Unknown"
    let statusColor = "rgb(5, 20, 100)"

    const vendorId = vendor.vendorID || vendor.id

    const isApproved = approvedVendors.some(v => (v.vendorID || v.id) === vendorId && v.deleted === 'n')
    const isPending = pendingVendors.some(v => (v.vendorID || v.id) === vendorId && v.deleted === 'n')

    if (isApproved) 
    {
        vendorStatus = "Approved"
        statusColor = "green"
    } 
    else if (isPending) 
    {
        vendorStatus = "Pending"
        statusColor = "goldenrod"
    } 
    else 
    {
        vendorStatus = "Rejected"
        statusColor = "red"
    }

    status.textContent = `Vendor Status: ${vendorStatus}`
    status.style.color = statusColor
    container.appendChild(status)

    appDiv.appendChild(container)
}

function vendorPageContainers()
{
    const appDiv = document.getElementById("app")
    const space = document.createElement("br")
    appDiv.appendChild(space)
    const containers = document.createElement("div")
    containers.className = "container text-center"
    containers.innerHTML = `
    <div class="row" id="portalContainer">
            <div class="col">
                <h3 style="color: rgb(5,20,100)">Upcoming Events</h3>
                <p style="color: rgb(5,20,100)">
                    Below you will see events that you are not attending. 
                    If you want to attend the event, just click "Sign Up" and find a booth!
                </p>
                <div id="notAttending">

                </div>
            </div>
            <div class="col">
                <h3 style="color: rgb(5,20,100)">Your Events</h3>
                <p style="color: rgb(5,20,100)">
                    Here you will see all the events your are attending.
                    If for some reason you can no longer attend an event, just click "Cancel" to cancel your reservation.
                </p>
                <div id="attending">

                </div>
            </div>
        </div>
    `
    appDiv.appendChild(containers)
}

async function attendingTable(vendor)
{
    const vendorID = vendor.id
    vendorEvents = await getAllVendorEvents(vendorID)
    let sortedEvents = vendorEvents.sort((a, b) => new Date(a.date) - new Date(b.date))
    
    const tableDiv = document.getElementById("attending")
    
    if(vendorEvents.length > 0)
    {
        const table = document.createElement("table")
        table.id = "vendor-table-modal"
        table.className = "table table-bordered table-hover"
        table.style.tableLayout = "auto";
        table.style.width = "auto";
        table.style.whiteSpace = "nowrap";
        const thead = document.createElement("thead")
        thead.innerHTML = "<th>Event Name</th><th>Event Date</th><th>Start Time</th><th>End Time</th><th>Booth Number</th><th></th>"
        table.appendChild(thead)

        const tbody = document.createElement("tbody")
        sortedEvents.forEach((event, index) => {
            const row = document.createElement("tr")
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${new Date(event.date).toLocaleDateString()}</td>
                <td>${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td class="booth-number-entry">Loading...</td>
                <td class="cancel-button-entry"></td>
                `
                
            tbody.appendChild(row)

            const boothCell = row.querySelector(".booth-number-entry")
            const buttonCell = row.querySelector(".cancel-button-entry")
        
            getBoothNumber(event.id, vendorID)
                .then((boothNumber) => {
                    boothCell.textContent = boothNumber || "N/A"
        
                    const cancelButton = document.createElement("button")
                    cancelButton.className = "btn btn-danger"
                    cancelButton.textContent = "Cancel"
                    cancelButton.onclick = () => cancelSignUp(event.id, vendorID, boothNumber)
        
                    buttonCell.appendChild(cancelButton)
                })
                .catch(() => {
                    boothCell.textContent = "Error"
                    buttonCell.innerHTML = "Error"
                })
        })

        table.appendChild(tbody)
        tableDiv.appendChild(table)
    }
    else
    {
        tableDiv.innerHTML = `<p>${vendor.vendorName} is currently not scheduled for any events.</p>`
    }
}

async function notAttendingTable(vendor, pendingVendors, approvedVendors)
{
    const vendorID = vendor.id
    skips = await getSkippedEvents(vendorID)
    let sortedEvents = skips.sort((a, b) => new Date(a.date) - new Date(b.date))
    
    const tableDiv = document.getElementById("notAttending")

    const vendorId = vendor.vendorID || vendor.id;
    const isApproved = approvedVendors.some(v => (v.vendorID || v.id) === vendorId && v.deleted === 'n')
    const isPending = pendingVendors.some(v => (v.vendorID || v.id) === vendorId && v.deleted === 'n')

    const disableButton = !isApproved
    
    if(skips.length > 0)
    {
        const table = document.createElement("table")
        table.id = "vendor-table-modal"
        table.className = "table table-bordered table-hover"
        table.style.tableLayout = "auto";
        table.style.width = "auto";
        table.style.whiteSpace = "nowrap";
        const thead = document.createElement("thead")
        thead.innerHTML = "<th>Event Name</th><th>Event Date</th><th>Start Time</th><th>End Time</th><th></th>"
        table.appendChild(thead)

        const tbody = document.createElement("tbody")
        sortedEvents.forEach((event, index) => {
            const row = document.createElement("tr")
            const disabledAttr = disableButton ? 'disabled' : ''
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${new Date(event.date).toLocaleDateString()}</td>
                <td>${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td><button class="btn btn-primary" id="main-btn" onclick="generateSignUpModal(${vendorID}, ${event.id})" ${disabledAttr}>Sign Up</button></td>
                `
            tbody.appendChild(row)
        })

        table.appendChild(tbody)
        tableDiv.appendChild(table)
    }
    else
    {
        tableDiv.innerHTML = `<p>You're currently scheduled for every event.</p>`
    }
}

function generateSignUpModal(vendorID, eventID)
{
    signUpModal(vendorID, eventID)
    const modalElement = document.getElementById('signUpModal')
    const modal = new bootstrap.Modal(modalElement)
    modal.show()
}

function signUpModal(vendorID, eventID)
{
    const appDiv = document.getElementById("app")

    const oldModal = document.getElementById("signUpModal")
    if (oldModal) 
    {
        oldModal.remove()
    }

    const modal = document.createElement("div")
    modal.innerHTML =`
    <div class="modal fade" id="signUpModal" tabindex="-1" aria-labelledby="accountLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header" style="background-color: rgb(5, 20, 100); color: white;">
                    <h1 class="modal-title fs-5" id="accountLabel">Pick Your Booth</h1>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row justify-content-center">
                        <div class="col-md-10">
                            <form onsubmit="signUp(event, ${eventID}, ${vendorID})">
                                <div class="mb-3">
                                    <label for="boothNumber" class="form-label">Booth Number:</label>
                                    <select class="form-control" id="boothNumber" name="boothNumber" required>

                                    </select>
                                </div>
                                <button type="submit" class="btn btn-success w-100">Sign Up</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
    appDiv.appendChild(modal)
    availableBooths(eventID)
}

async function availableBooths(eventID)
{
    const available = await getAllBooths(eventID)
    const boothSelect = document.getElementById("boothNumber")
    boothSelect.innerHTML = ""

    const defaultOption = document.createElement("option")
    defaultOption.value = ""
    defaultOption.text = "Select Booth"
    boothSelect.appendChild(defaultOption)

    available.forEach(booth => {
        const option = document.createElement("option")
        option.value = booth.boothNumber
        option.text = `Booth ${booth.boothNumber}`
        boothSelect.appendChild(option)
    });
}

async function signUp(event, eventID, vendorID)
{
    event.preventDefault()
    const boothNumber = document.getElementById("boothNumber").value;

    const newUse = {
        "EventID": eventID,
        "VendorID": vendorID,
        "BoothID": boothNumber,
        "eventName": "",
        "vendorName": "",
        "boothNumber": 0,
        "deleted": "n"
    }
    
    const url = baseUrl + "Uses"
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUse),
    })
 
    if (response.ok)
    {
        alert("You're now signed up!")
        const modalElement = document.getElementById('signUpModal')
        const modal = bootstrap.Modal.getInstance(modalElement)
        if (modal) 
        {
            modal.hide()
        }
        reloadVendorPage()
    }
    else
    {
        alert("Failed to sign up.")
    }

}

async function cancelSignUp(eventID, vendorID, boothNumber)
{
    if(confirm("Are you sure you want to cancel your attendance?")){
        console.log(boothNumber)
    }

    const url = baseUrl + "Uses" + "/" + eventID + "/" + vendorID + "/" + boothNumber

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    })
    if (response.ok)
        {
            alert("Attendance was cancelled successfully!")
            reloadVendorPage()
            
        }
        else
        {
            alert("Failed to cancel attendance.")
        }
}

function vendorAccountModal(vendor)
{
    const appDiv = document.getElementById("app")

    const oldModal = document.getElementById("accountModal")
    if (oldModal) 
    {
        oldModal.remove()
    }

    const vendorID = vendor.id

    const modal = document.createElement("div")
    modal.innerHTML =`
    <div class="modal fade" id="accountModal" tabindex="-1" aria-labelledby="accountLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header" style="background-color: rgb(5, 20, 100); color: white;">
                    <h1 class="modal-title fs-5" id="accountLabel">Account Details</h1>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row justify-content-center">
                        <div class="col-md-10">
                            <form onsubmit="handleSaveVendor(event, ${vendorID})">
                                <div class="mb-3">
                                    <label for="vendorNameE" class="form-label">Vendor Name:</label>
                                    <input type="text" class="form-control" id="vendorNameE" name="vendorName" required>
                                </div>

                                <div class="mb-3">
                                    <label for="vendorTypeE" class="form-label">Goods Sold</label>
                                    <select class="form-select" id="vendorTypeE" name="vendorType" required>
                                        <option value="" selected disabled hidden>Choose goods type</option>
                                        <option value="Groceries">Groceries</option>
                                        <option value="Clothing">Clothing</option>
                                        <option value="Art">Art</option>
                                        <option value="Food">Food</option>
                                        <option value="Home Items">Home Items</option>
                                        <option value="Music">Music</option>
                                        <option value="Plants">Plants</option>
                                    </select>
                                </div>
                                <br>
                                <div class="mb-3">
                                    <label for="vendorEmailE" class="form-label">Vendor Email:</label>
                                    <input type="email" class="form-control" id="vendorEmailE" name="vendorEmail" required>
                                </div>

                                <div class="mb-3">
                                    <label for="vendorPhoneE" class="form-label">Vendor Phone Number:</label>
                                    <input type="text" class="form-control" id="vendorPhoneE" name="VendorPhone" required>
                                </div>

                                <div class="mb-3">
                                    <label for="socialMediaE" class="form-label">Social Media (optional):</label>
                                    <div class="input-group">
                                        <span class="input-group-text">@</span>
                                        <input type="text" class="form-control" id="socialMediaE" name="socialMedia">
                                    </div>
                                </div>

                                <div class="row mb-3">
                                <div class="col">
                                    <label for="ownerFirstE" class="form-label">Owner First Name:</label>
                                    <input type="text" class="form-control" id="ownerFirstE" name="ownerFirst">
                                </div>
                                <div class="col">
                                    <label for="ownerLastE" class="form-label">Owner Last Name:</label>
                                    <input type="text" class="form-control" id="ownerLastE" name="ownerLast">
                                </div>
                                </div>

                                <div class="mb-3">
                                    <label for="ownerPhoneE" class="form-label">Owner Phone:</label>
                                    <input type="text" class="form-control" id="ownerPhoneE" name="ownerPhone" required>
                                </div>

                                <div class="mb-3">
                                    <label for="ownerEmailE" class="form-label">Owner Email (Account Username):</label>
                                    <input type="email" class="form-control" id="ownerEmailE" name="ownerEmail" required>
                                </div>

                                <div class="mb-3">
                                    <label for="passwordE" class="form-label">Account Password:</label>
                                    <input type="password" class="form-control" id="passwordE" required>
                                </div>

                                <button type="submit" class="btn btn-success w-100">Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
    appDiv.appendChild(modal)
}

async function handleSaveVendor(event, vendorID)
{
    event.preventDefault()

    const name = document.getElementById("vendorNameE").value
    const type = document.getElementById("vendorTypeE").value
    const vendorEmail = document.getElementById("vendorEmailE").value
    const vendorPhone = document.getElementById("vendorPhoneE").value
    const vendorSocialInput = document.getElementById("socialMediaE").value
    const vendorSocial = vendorSocialInput.trim() === "" ? null : vendorSocialInput.trim()
    const ownerFirst = document.getElementById("ownerFirstE").value
    const ownerLast = document.getElementById("ownerLastE").value
    const ownerPhone = document.getElementById("ownerPhoneE").value
    const ownerEmail = document.getElementById("ownerEmailE").value
    const password = document.getElementById("passwordE").value

    const newVendor = {
        id: vendorID,
        vendorEmail: vendorEmail,
        vendorPhone: vendorPhone,
        vendorSocial: vendorSocial,
        vendorName: name,
        ownerFirstName: ownerFirst,
        ownerLastName: ownerLast,
        ownerEmail: ownerEmail,
        ownerPassword: password,
        ownerPhone: ownerPhone,
        type: type,
        deleted: "n"
    }
    
    const url = baseUrl + "Vendor" + "/" + vendorID
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        }, 
        body: JSON.stringify(newVendor),
    })

    if (response.ok) 
    {
        alert("Vendor account updated successfully!")
        const modalElement = document.getElementById('accountModal')
        const modal = bootstrap.Modal.getInstance(modalElement)
        if (modal) 
        {
            modal.hide()
        }
        vendorPage(newVendor)
    } 
    else 
    {
        alert("Failed to update vendor account.")
    }
}

async function reloadVendorPage()
{
    await getData()
    vendorPage(currentVendor)
}

// admin home page methods
function adminPage(admin)
{
    currentAdmin = admin
    const app = document.getElementById("app");
    app.innerHTML = "";
 
    adminPageNavbar(admin)
    adminPageHeader(admin)
    adminPageContainers()
    adminVendorSection(admin) 
    statsSection()
}

function adminPageNavbar()
{
    const appDiv = document.getElementById("app")
    appDiv.innerHTML = ""
    const navbar = document.createElement("nav")
    navbar.className = "navbar sticky-top";
    navbar.style.backgroundColor = "rgb(5,20,100)";
    navbar.style.color = "white";
    navbar.innerHTML = `
    <div class="container-fluid">
        <a class="navbar-brand mb-0 h1" style="color: white" href="#" onclick="handleOnLoad()">Tuscaloosa Trade Fair Association</a>
        <div class="ms-auto d-flex gap-3 align-items-center">
            <a href="#" style="color: white; text-decoration: underline;" onclick="handleOnLoad()">Sign Out</a>
        </div>
    </div>
    `
    appDiv.appendChild(navbar)
    
}

function adminPageHeader(admin)
{
    const appDiv = document.getElementById("app")
    const container = document.createElement("div")
    container.className = "container-fluid"
 
    const header = document.createElement("h2")
    header.textContent = `Welcome to the admin portal, ${admin.firstName}!`
    header.style.color = "rgb(5,20,100)"
    container.appendChild(header)
 
    const status = document.createElement("h5")
 
 
    appDiv.appendChild(container)
    const space = document.createElement("br")
    appDiv.append(space)
}

async function adminPageContainers(admin)
{
    const appDiv = document.getElementById("app")
    const space = document.createElement("br")
    appDiv.appendChild(space)
    const containers = document.createElement("div")
    containers.className = "container text-center"
    containers.innerHTML = `
    <div class="row" id="portalContainer">
        <div class="col d-flex flex-column align-items-center">
            <br>
            <h3 style="color: rgb(5,20,100)">About the Admin Portal</h3>
            <p style="color: rgb(5,20,100)">
                Within the admin portal, you can create and edit events tailored to the TTFA business strategy.
                You can also control the flow of vendors with the ability to approve, deny, and delete vendors from the website.
                Additionally, below the vendors section, you will have access to visualizations of our event and vendor data.
            </p>
            <button class="btn btn-primary" id="main-btn" onclick="createEventPage(${admin})">Add Event</button>
        </div>
        <div class="col d-flex flex-column justify-content-center align-items-center">
            <br>
            <h3 style="color: rgb(5,20,100)">Upcoming Events</h3>
            <p style="color: rgb(5,20,100)">
                Here you will see all the events your are attending.
                If for some reason you can no longer attend an event, just click "Cancel" to cancel your reservation.
            </p>
            <div id="adminEvents">

            </div>
        </div>
    </div>
    `
    appDiv.appendChild(containers)
    appDiv.append(space)
    await adminEventTable("adminEvents")
}

async function adminVendorSection(admin)
{
    const appDiv = document.getElementById("app")
    const container = document.createElement("div")
    container.className = "container"
    container.id = "portalContainer"
    container.innerHTML = `
    <br>
    <h3 style="color: rgb(5, 20, 100)">Our Vendors</h3>
    <p>All of our pending and approved vendors are located in the table below. Use the button toggle to show either the pending vendors or the approved vendors.</p>
    <div class="d-flex align-items-center gap-3 flex-wrap mb-3">
        <div class="btn-group" role="group" aria-label="Horizontal radio toggle button group">
            <input type="radio" class="btn-check" name="vbtn-radio" id="hbtn-radio1" autocomplete="off" checked>
            <label class="btn btn-outline-danger" for="hbtn-radio1">Pending Vendors</label>

            <input type="radio" class="btn-check" name="vbtn-radio" id="hbtn-radio2" autocomplete="off">
            <label class="btn btn-outline-danger" for="hbtn-radio2">Approved Vendors</label>
        </div>

        <input type="text" id="searchbar" onkeyup="handleSearchAdmin('admin-vendor-table')" placeholder="Enter the vendor's name here..." class="form-control" style="max-width: 700px;">
        <select id="vendor-dropdown" onchange="handleSearchAdmin('admin-vendor-table')" class="dropdown" style="max-width: 175px;">
            <option value="">All Types</option>
        </select>
    </div>
    <br>
    <div id="adminVendorTable">
        <div class="container" id="adminVendorTableContainer">

        </div>
    </div>
    `
    appDiv.appendChild(container)

    const radio1 = document.getElementById("hbtn-radio1");
    const radio2 = document.getElementById("hbtn-radio2");

    const tableContainer = document.getElementById("adminVendorTableContainer");
    tableContainer.style.minHeight = "400px";
    pendingVendorTable(admin)

    radio1.addEventListener("change", () => {
        if (radio1.checked) {
            changeButtonColors(radio1, radio2)
            pendingVendorTable(admin)
        }
    });

    radio2.addEventListener("change", () => {
        if (radio2.checked) {
            changeButtonColors(radio2, radio1)
            approvedVendorTable();
        }
    })
}

function changeButtonColors(activeBtn, inactiveBtn) {
    activeBtn.nextElementSibling.classList.add("active");
    inactiveBtn.nextElementSibling.classList.remove("active");
}

function handleSearchAdmin(tableName)
{
    var input, filter, table, tr, i, selectedType
    input = document.getElementById("searchbar")
    filter = input.value.toUpperCase()
    table = document.getElementById(`${tableName}`)
    tr = table.getElementsByTagName("tr")
    selectedType = document.getElementById("vendor-dropdown").value
  
    for (i = 0; i < tr.length; i++) 
    {
        const nameTD = tr[i].getElementsByTagName("td")[0]
        const typeTD = tr[i].getElementsByTagName("td")[1]

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

async function adminEventTable(divID)
{
    let sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date))
    
    const tableDiv = document.getElementById(`${divID}`)
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
        thead.innerHTML = "<th>Event Name</th><th>Event Date</th><th>Start Time</th><th>End Time</th><th>Vendors</th><th></th><th></th>"
        table.appendChild(thead)

        const tbody = document.createElement("tbody")
        for(const event of sortedEvents) {
            const count = await getVendorCount(event.id)

            const row = document.createElement("tr")
            row.innerHTML = `
                <td>${event.name}</td><td>${new Date(event.date).toLocaleDateString()}</td>
                <td>${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>${count}</td>
                <td><button class="btn btn-secondary" onclick="generateModal(${event.id})">Edit</button>
                <td><button class="btn btn-danger" onclick="cancelEvent(${event.id})">Cancel</button>
                `
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

function generateModal(eventID)
{
    editEventModal(eventID)
    const modalElement = document.getElementById('editEventModal')
    const modal = new bootstrap.Modal(modalElement)
    modal.show()
}

function editEventModal(eventID)
{
    const appDiv = document.getElementById("app")

    const oldModal = document.getElementById("editEventModal")
    if (oldModal) 
    {
        oldModal.remove()
    }

    const modal = document.createElement("div")
    modal.innerHTML =`
    <div class="modal fade" id="editEventModal" tabindex="-1" aria-labelledby="accountLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header" style="background-color: rgb(5, 20, 100); color: white;">
                    <h1 class="modal-title fs-5" id="accountLabel">Edit Event Details</h1>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row justify-content-center">
                        <div class="col-md-10">
                            <form onsubmit="saveEvent(event, ${eventID})">
                                <div class="mb-3">
                                    <label for="eventNameE" class="form-label">Event Name:</label>
                                    <input type="text" class="form-control" id="eventNameE" name="eventName" required>
                                </div>

                                <div class="mb-3">
                                    <label for="eventDescriptionE" class="form-label">Event Description</label>
                                    <input type="description" class="form-control" id="eventDescriptionE" name="eventDescription" required>
                                </div>
            
                                <div class="mb-3">
                                    <label for="eventDateE" class="form-label">Event Date :</label>
                                    <input type="date" class="form-control" id="eventDateE" name="eventDate" required>
                                </div>
            
                                <div class="mb-3">
                                    <label for="eventStartTimeE" class="form-label">Event Start Time :</label>
                                    <input type="time" class="form-control" id="eventStartTimeE" name="eventStartTime" required>
                                </div>
                                <div class="mb-3">
                                    <label for="eventEndTimeE" class="form-label">Event End Time :</label>
                                    <input type="time" class="form-control" id="eventEndTimeE" name="eventEndTime" required>
                                </div>
            
                                <button type="submit" class="btn btn-success w-100">Save Event</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
    appDiv.appendChild(modal)
}

async function saveEvent(event, eventID)
{
    event.preventDefault()

    const name = document.getElementById("eventNameE").value
    const eventDescription = document.getElementById("eventDescriptionE").value
    const eventDate = document.getElementById("eventDateE").value
    const eventStartTime = document.getElementById("eventStartTimeE").value
    const eventEndTime = document.getElementById("eventEndTimeE").value

    const startDateTime = eventDate + "T" + eventStartTime + ":00"
    const endDateTime = eventDate + "T" + eventEndTime + ":00"
 
    const updatedEvent = {
 
        "Name": name,
        "Description": eventDescription,
        "Date": eventDate,
        "StartTime" : startDateTime,
        "EndTime": endDateTime,
        "Deleted": "n"
    }
    
    const url = baseUrl + "Event" + "/" + eventID
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        }, 
        body: JSON.stringify(updatedEvent),
    })

    if (response.ok) 
    {
        alert("Event updated successfully!")
        const modalElement = document.getElementById('editEventModal')
        const modal = bootstrap.Modal.getInstance(modalElement)
        if (modal) 
        {
            modal.hide()
        }
        reloadAdminPage()
    } 
    else 
    {
        alert("Failed to update event.")
    }
}

async function cancelEvent(eventID)
{
    if(confirm("Are you sure you want to cancel this event?")){
        console.log(eventID)
    }

    const url = baseUrl + "Event"

    const response = await fetch(url + "/" + eventID, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    })
    if (response.ok)
        {
            alert("Event was cancelled successfully!")
            reloadAdminPage()
        }
        else
        {
            alert("Failed to cancel event.")
        }
}

async function pendingVendorTable(admin) {
    const div = document.getElementById("adminVendorTable");
    const adminVendorTableContainer = document.getElementById("adminVendorTableContainer")
    adminVendorTableContainer.innerHTML = ""
    const table = document.createElement("table");
    table.id = "admin-vendor-table"
    table.className = "table table-bordered";
    const thead = document.createElement("thead");
    thead.innerHTML =  `
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Owner</th>
            <th>Owner Email</th>
            <th>Owner Phone</th>
            <th></th>
            <th></th>
        </tr>`;  
    table.appendChild(thead);
 
    const tbody = document.createElement("tbody");
 
    const pendingVendors = await getAllPendingVendors()
    let sortedVendors = pendingVendors.sort((a, b) => a.vendorName.localeCompare(b.vendorName))
    handleVendorTypeDropdown(sortedVendors)
 
    sortedVendors.forEach((vendor) => {
        const vendorID = vendor.id
        const adminID = admin.id
        const row = document.createElement("tr");
        row.innerHTML =  `
            <td>${vendor.vendorName}</td>
            <td>${vendor.type}</td>
            <td>${vendor.ownerFirstName} ${vendor.ownerLastName}</td>
            <td>${vendor.ownerEmail}</td>
            <td>${vendor.ownerPhone}</td>
            <td><button class="btn btn-success" onclick="handleOnApprove(${adminID}, ${vendorID})">Approve</button></td>
            <td><button class="btn btn-danger" onclick="denyVendor(${vendorID})">Deny</button></td>
        `;
        tbody.appendChild(row)
    });
 
    table.appendChild(tbody)
    adminVendorTableContainer.appendChild(table)
    div.appendChild(adminVendorTableContainer)
}

async function approvedVendorTable() {
    const div = document.getElementById("adminVendorTable");
    const adminVendorTableContainer = document.getElementById("adminVendorTableContainer")
    adminVendorTableContainer.innerHTML = ""
    const table = document.createElement("table");
    table.id = "admin-vendor-table"
    table.className = "table table-bordered";
    const thead = document.createElement("thead");
    thead.innerHTML =  `
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Owner</th>
            <th>Owner Email</th>
            <th>Owner Phone</th>
            <th></th>
        </tr>`;  
    table.appendChild(thead);
 
    const tbody = document.createElement("tbody");
    
    let approvedVendors = await getAllApprovedVendors()
    let sortedVendors = approvedVendors.sort((a, b) => a.vendorName.localeCompare(b.vendorName))
    handleVendorTypeDropdown(sortedVendors)
 
    sortedVendors.forEach((vendor) => {
        const row = document.createElement("tr");
        row.innerHTML =  `
            <td>${vendor.vendorName}</td>
            <td>${vendor.type}</td>
            <td>${vendor.ownerFirstName} ${vendor.ownerLastName}</td>
            <td>${vendor.ownerEmail}</td>
            <td>${vendor.ownerPhone}</td>
            <td><button class="btn btn-danger" onclick="deleteVendor(${vendor.id})">Delete</button></td>
        `;
        tbody.appendChild(row)
    });
 
    table.appendChild(tbody)
    adminVendorTableContainer.appendChild(table)
    div.appendChild(adminVendorTableContainer)
}

function createEventPage(admin) {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = ""
    EventCreationNav(admin)
    EventCreationHeader()
    EventCreationForm()
}

function EventCreationNav()
{
    const appDiv = document.getElementById("app")
    appDiv.innerHTML = ""
    const navbar = document.createElement("nav")
    navbar.className = "navbar sticky-top"
    navbar.style.backgroundColor = "rgb(5,20,100)"
    navbar.style.color = "white"
    navbar.innerHTML = `
    <div class="container-fluid">
        <a class="navbar-brand mb-0 h1" style="color: white" href="#" onclick="handleOnLoad()">Tuscaloosa Trade Fair Association</a>
        <div class="ms-auto d-flex gap-2">
            <a href="#" style="color: white; text-decoration: underline;" onclick="reloadAdminPage()">Admin Page</a>
        </div>
    </div>
    `
    appDiv.appendChild(navbar)
 
    
}

function EventCreationHeader()
{
    const appDiv = document.getElementById("app")
    const container = document.createElement("div")
    container.className = "container py-4"
    container.id = "login-form-container"
 
    const header = document.createElement("h2")
    header.className = "text-center mb-4"
    header.style.color = "rgb(5,20,100)"
    header.innerText = "Create your event below."
 
    container.appendChild(header)
    appDiv.appendChild(container)
}
 
function EventCreationForm()
{
    const container = document.getElementById("login-form-container")
    const form = document.createElement("div")
    form.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow p-4">
                    <form onsubmit="handleAddEvent(event)">
                        <div class="mb-3">
                            <label for="eventName" class="form-label">Event Name:</label>
                            <input type="text" class="form-control" id="eventName" name="eventName" required>
                        </div>

                        <div class="mb-3">
                            <label for="eventDescription" class="form-label">Event Description</label>
                            <input type="description" class="form-control" id="eventDescription" name="eventDescription" required>
                        </div>
    
                        <div class="mb-3">
                            <label for="eventDate" class="form-label">Event Date :</label>
                            <input type="date" class="form-control" id="eventDate" name="eventDate" required>
                        </div>
    
                        <div class="mb-3">
                            <label for="eventStartTime" class="form-label">Event Start Time :</label>
                            <input type="time" class="form-control" id="eventStartTime" name="eventStartTime" required>
                        </div>
                        <div class="mb-3">
                            <label for="eventEndTime" class="form-label">Event End Time :</label>
                            <input type="time" class="form-control" id="eventEndTime" name="eventEndTime" required>
                        </div>
    
                        <button type="submit" class="btn btn-success w-100">Create Event</button>
                    </form>
                </div>
            </div>
        </div>
    `
    container.appendChild(form)
}
 
async function handleAddEvent(event){
    event.preventDefault()
 
    const name = document.getElementById("eventName").value
    const eventDescription = document.getElementById("eventDescription").value
    const eventDate = document.getElementById("eventDate").value
    const eventStartTime = document.getElementById("eventStartTime").value
    const eventEndTime = document.getElementById("eventEndTime").value

    const startDateTime = eventDate + "T" + eventStartTime + ":00"
    const endDateTime = eventDate + "T" + eventEndTime + ":00"
 
    const newEvent = {
 
        "Name": name,
        "Description": eventDescription,
        "Date": eventDate,
        "StartTime" : startDateTime,
        "EndTime": endDateTime,
        "Deleted": "n"
    }
    
    const url = baseUrl + "Event"
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
    })
 
    if (response.ok)
    {
        alert("Event was created successfully!")
        reloadAdminPage()
    }
    else
    {
        alert("Failed to create event.")
    }
}
   
async function handleOnApprove(adminID, vendorID) 
{
    approveVendor(adminID, vendorID)
    unpendVendor(vendorID)
    reloadAdminPage()
}

async function approveVendor(adminID, vendorID)
{
    if(confirm("Are you sure you want to approve this vendor?")){
        console.log(vendorID)
    }
    const date = new Date().toJSON()

    const approval = {
        adminID: adminID,
        vendorID: vendorID,
        adminName: "",       
        vendorName: "",      
        approvalDate: date
    }

    const url = baseUrl + "Approves"
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(approval)
    });
    if (response.ok)
    {
        alert("Vendor was approved successfully!")
    }
    else
    {
        alert("Failed to approve vendor.")
    }
}

async function denyVendor(vendorID)
{
    if(confirm("Are you sure you want to deny this vendor?")){
        console.log(vendorID)
    }

    const url = baseUrl + "Pending"

    const response = await fetch(url + "/" + vendorID, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    })
    if (response.ok)
    {
        alert("Vendor was denied successfully!")
        reloadAdminPage()
    }
    else
    {
        alert("Failed to deny vendor.")
    }
}

async function unpendVendor(vendorID)
{
    const url = baseUrl + "Pending"

    const response = await fetch(url + "/" + vendorID, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    })
}

async function deleteVendor(vendorID)
{
    if(confirm("Are you sure you want to deny this vendor?")){
        console.log(vendorID)
    }

    const url = baseUrl + "Vendor"

    const response = await fetch(url + "/" + vendorID, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    })
    if (response.ok)
        {
            alert("Vendor was denied successfully!")
            reloadAdminPage()
        }
        else
        {
            alert("Failed to deny vendor.")
        }
}

async function reloadAdminPage() 
{
    await getData()
    adminPage(currentAdmin)
}

async function statsSection()
{
    const appDiv = document.getElementById("app")
    const container = document.createElement("div")
    container.className = "container"
    container.id = "portalContainer"
    container.innerHTML = `
    <br>
    <h3 style="color: rgb(5, 20, 100)">TTFA Stats</h3>
    <p>Here you can view visualizations of our events and vendor data</p>
    <div class="container mt-4">
        <div class="row" id="statsCardsContainer">
        
        </div>
    </div>
    <div class="container" id="statsDiv">
        
    </div>
    <br>
    `

    appDiv.appendChild(container)
    renderStatsCards()
    renderVendorsPerEventChart()
}

// stats functions
const statsOptions = {
    vendorsPerEvent: {
        label: "Vendors per Event",
        fetchFunction: fetchStats("VPE"),
        defaultChartType: "bar"
    },
    vendorsByCategory: {
        label: "Vendors by Category",
        fetchFunction: fetchStats("VPC"),
        defaultChartType: "pie"
    },
    vendorsPerMonth: {
        label: "Vendors per Month",
        fetchFunction: fetchStats("VAPM"),
        defaultChartType: "line"
    },
    vendorsPerYear: {
        label: "Vendors per Year",
        fetchFunction: fetchStats("VAPY"),
        defaultChartType: "bar"
    },
    eventsPerMonth: {
        label: "Events per Month",
        fetchFunction: fetchStats("EPM"),
        defaultChartType: "line"
    },
    eventsPerYear: {
        label: "Events per Year",
        fetchFunction: fetchStats("EPY"),
        defaultChartType: "bar"
    },
    eventsPerVendorCategory: {
        label: "Events per Vendor Category",
        fetchFunction: fetchStats("EPC"),
        defaultChartType: "pie"
    }
}

function getRandomColor(opacity = 0.6) {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
  

async function renderStatsCards() {
    const container = document.getElementById('statsCardsContainer')
    container.innerHTML = ''

    for (const [key, option] of Object.entries(statsOptions)) {
        const col = document.createElement('div')
        col.className = 'col-md-4 mb-4'

        const card = document.createElement('div')
        card.className = 'card shadow-sm stat-card'
        card.style.cursor = 'pointer'
        card.onclick = async ()  => {
            await getData()
            renderVendorsPerEventChart(key)
        }

        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title" style="color: rgb(5, 20, 100)">${option.label}</h5>
                <p class="card-text">Click to view the chart for ${option.label.toLowerCase()}.</p>
            </div>
        `

        col.appendChild(card)
        container.appendChild(col)
    }
}

async function fetchStats(choice)
{
    url = baseUrl + "Stats/" + choice
    let response = await fetch(url)
    stats = await response.json()
    return stats
}

let currentChart;

async function renderVendorsPerEventChart(optionKey) {
    const option = statsOptions[optionKey]
    if (!option) return

    const statsDiv = document.getElementById("statsDiv")
    statsDiv.innerHTML = ''

    const canvas = document.createElement('canvas')
    canvas.id = 'statChart';
    canvas.style.width = "90%"
    canvas.style.maxWidth = "900px"
    canvas.style.height = "500px"
    canvas.style.margin = "0 auto"
    statsDiv.appendChild(canvas)

    const data = await option.fetchFunction

    const labels = data.map(d => d.label)
    const values = data.map(d => d.dataPoint)

    if (currentChart) {
        currentChart.destroy()
    }


    const ctx = document.getElementById('statChart').getContext('2d')

    const baseColors = labels.map(() => getRandomColor(1))
    const backgroundColors = baseColors.map(color => color.replace('1)', '0.6)'))
    const borderColors = baseColors

    currentChart = new Chart(ctx, {
        type: option.defaultChartType,
        data: {
            labels: labels,
            datasets: [{
                label: option.label,
                data: values,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: option.defaultChartType === 'bar' || option.defaultChartType === 'line'
                ? { y: { beginAtZero: true }, }
                : {}
        }
    })
}

// data methods
async function getData()
{
    await getAllAdmin()
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
async function getAllBooths(id)
{
    url = baseUrl + "Booth/event/" + id
    let response = await fetch(url)
    booths = await response.json()
    return booths
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

async function getSkippedEvents(vendorID)
{
    url = baseUrl + `Event/skip/${vendorID}`
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
}

async function getAllApprovedVendors()
{
    url = baseUrl + "Vendor/approved"
    let response = await fetch(url)
    let approvedVendors = await response.json()
    return approvedVendors
}

async function getAllPendingVendors()
{
    url = baseUrl + "Vendor/pending"
    let response = await fetch(url)
    pendingVendors = await response.json()
    return pendingVendors
}

async function getVendor(vendorID)
{
    url = baseUrl + `Vendor/${vendorID}`
    let response = await fetch(url)
    return await response.json()
}