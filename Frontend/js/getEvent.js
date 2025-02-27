// Fetch data from events.json file
fetch("./Frontend/data/events.json")
  .then((res) => res.json())
  .then((res) => {
    let cardContainer = document.getElementsByClassName("card-container")[0];
    for (let data in res) {
      let emptyDiv = document.createElement("div");
      emptyDiv.className = "empty_div";
      let eventCard = document.createElement("div");
      eventCard.className = "event_card";
      let eventTitle = document.createElement("div");
      let heading = document.createElement("h3");
      heading.innerText = res[data].title;
      heading.className = "event_title";
      eventTitle.appendChild(heading);
      let startDate = document.createElement("span");
      startDate.className = "date";
      startDate.innerHTML = `<b>Starts:</b> ${res[data].start}`;
      let endDate = document.createElement("span");
      endDate.className = "date";
      endDate.innerHTML = `<b>Ends:</b> ${res[data].end}`;
      let eventDetails = document.createElement("div");
      eventDetails.className = "event_details";
      let eventLink = document.createElement("a");
      Object.assign(eventLink, {
        href: `https://${res[data].website}`,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "btn btn-primary link",
      });
      let link = document.createElement("h6");
      link.innerText = "More Info";
      eventLink.appendChild(link);
      let organisation = document.createElement("p");
      organisation.className = "event_organisation";
      organisation.innerHTML = `<b>Organisation: ${res[data].organisation}`;
      let loc = document.createElement("h5");
      let eventStatus = res[data].location;
      setEventStatus();
      loc.innerText = eventStatus;
      eventDetails.append(startDate, endDate, organisation, loc, eventLink);
      eventCard.append(eventTitle, eventDetails);
      emptyDiv.appendChild(eventCard);
      cardContainer.appendChild(emptyDiv);

      //function to set the status of event
      function setEventStatus() {
        let endDate = res[data].end.split("/", 3);
        endDate = `${endDate[1]}/${endDate[0]}/${endDate[2]}`;
        endDate = new Date(endDate);
        if (new Date() > endDate) {
          eventStatus = "Offline";
          loc.className = "locationOffline";
        } else {
          loc.className = "locationOnline";
        }
      }
    }
  });

  
// Filters for Events

// Search Filter Element
let search = document.querySelector('#search-filter');
search.addEventListener('keyup', applyFilter);

// Event Status Filter Element
let eventStatusFilterElement = document.querySelector('#event-status-filter');
eventStatusFilterElement.addEventListener('change', applyFilter);

// Event Range Start Element
let eventRangeStartElement= document.getElementById("range-start");
eventRangeStartElement.addEventListener('change', applyFilter);

let eventRangeEndElement = document.getElementById("range-end");
eventRangeEndElement.addEventListener('change', applyFilter);

// Filter Event Function
function applyFilter(){
  let eventList = document.querySelectorAll('.empty_div');
  Array.from(eventList).forEach( eventItem => {
    eventItem.style.display = 'block';
  });

  let searchTerm = search.value.toLowerCase();
  filterBySearchTerm(searchTerm, eventList);

  let reqStatus = eventStatusFilterElement.value.toLowerCase();
  filterByStatus(reqStatus, eventList);

  let rangeStart = eventRangeStartElement.valueAsDate;
  let rangeEnd = eventRangeEndElement.valueAsDate;
  console.log(rangeStart, rangeEnd)
  filterByRange(rangeStart, rangeEnd, eventList)

}

// Filter by Search Term
function filterBySearchTerm(searchTerm, eventList) {
  Array.from(eventList).forEach( eventItem => {

    let eventTitle = eventItem.querySelector('.event_title').innerText.toLowerCase()

    if (eventTitle.indexOf(searchTerm) == -1){
      eventItem.style.display = 'none';
    }
  });
}

// Filter by Status
function filterByStatus(reqStatus, eventList) {
  let notReqClass = '';
  if( reqStatus == 'online') {
    notReqClass = '.locationOffline'
  }
  else if(reqStatus == 'offline') {
    notReqClass = '.locationOnline'
  }
  else {
    return;
  }

  Array.from(eventList).forEach( eventItem => {

    let currentEventStatus = eventItem.querySelector(notReqClass)  

    if (currentEventStatus) {
      eventItem.style.display = 'none';
    }

  });
}

// Filter by Range
function filterByRange(rangeStart, rangeEnd, eventList) {
  if(rangeStart == null) {
    rangeStart = new Date('0001-01-01T00:00:00Z');
  }

  if(rangeEnd == null) {  
    rangeEnd = new Date((new Date().getFullYear()) + 100,1,1);
  }

  // the rangeStart should always be less than rangeEnd
  if (rangeStart.getTime() >= rangeEnd.getTime()) {
    alert("The Range Start should be less than Range End");
    return;
  }

  Array.from(eventList).forEach( eventItem => {

    let eventStartDateStr = eventItem.querySelectorAll(".date")[0].innerText.split(':')[1].split('/')
    let eventEndDateStr = eventItem.querySelectorAll(".date")[1].innerText.split(':')[1].split('/')

    
    let eventStartDate = new Date(eventStartDateStr[2], eventStartDateStr[1] - 1, eventStartDateStr[0]);
    let eventEndDate = new Date(eventEndDateStr[2], eventEndDateStr[1] - 1, eventEndDateStr[0]);

    if ( (rangeEnd.getTime() <= eventStartDate.getTime()) || (rangeStart.getTime() >= eventEndDate.getTime())) {
        eventItem.style.display = 'none';
    }

  });

}

// Filters for Event Ends

const toggleSwitch=document.querySelector('.custom-control-input');
const text=document.querySelector('.custom-control-label');
function darkMode(){
  text.children[0].textContent="Dark";
  text.children[1].classList.replace('fa-sun-o','fa-moon-o');
}
function lightMode() {
  text.children[0].textContent = "Light";
  text.children[1].classList.replace("fa-moon-o", "fa-sun-o");
}
function switchTheme(event) {
  if (event.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    darkMode();
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    lightMode();
  }
}
toggleSwitch.addEventListener("change", switchTheme);
const currentTheme = localStorage.getItem("theme");
if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (currentTheme === "dark") {
    toggleSwitch.checked = true;
    darkMode();
  }
}

//Scroll to top
const Top = document.querySelector(".to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 200) {
    Top.classList.add("active");
  } else {
    Top.classList.remove("active");
  }
});
