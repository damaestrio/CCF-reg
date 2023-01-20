 var gblPlayerData = null;
 var gblSection = null;
 var displayData = null;

 self.addEventListener("load", (event) => {
  gblPlayerData = this.checkDataLoaded();

  let lastSection = localStorage.getItem("Section");

  if (lastSection) {
   $('#sections')[0].value = lastSection;
   gblSection = lastSection;
  }
  displayPlayers();
  //sets the section, and the filename of the csv to be generated
  $('#sections').change(function() {
   gblSection = $(this).val();
   localStorage.setItem("Section", gblSection);
  });
 });

 function readSingleFile(evt) {
  //Retrieve the first (and only!) File from the FileList object
  var f = evt.target.files[0];

  if (f) {
   var r = new FileReader();
   r.onload = function(e) {
    parseCSVData(e.target.result);

   }
   r.readAsText(f);
  }
  else {
   alert("Failed to load file");
  }
 }

 //check if we have data in localstorage
 function checkDataLoaded() {
  let storedPlayerData = localStorage.getItem('PlayerData');

  if (storedPlayerData != null) {
   return JSON.parse(storedPlayerData);
  }
  else
   return null;
 }

 //Check in a player
 function setSection(index) {
  gblPlayerData[1].Checkedin = 1;
  localStorage.setItem('PlayerData', JSON.stringify(parsedData));


 }

 function parseCSVData(csvData) {
  let parsedData = $.csv.toObjects(csvData);

  //Add to local storage
  localStorage.setItem('PlayerData', JSON.stringify(parsedData));

  gblPlayerData = parsedData;
 }

 function generateDownload() {

  let csvContent = "data:text/csv;charset=utf-8," + $.csv.fromObjects(gblPlayerData);

  let encodedUri = encodeURI(csvContent);
  let link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", gblSection + ".csv");
  document.body.appendChild(link); // Required for FF

  link.click();
 }

 function displayPlayers(filter) {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  //var validPlayers = Object.values(table).filter((x) => x.StudentName === input);

  var table = document.getElementById("myTable");

  var topRow = table.insertRow(0);
  var topCategory1 = topRow.insertCell(0);
  var topCategory2 = topRow.insertCell(1);
  var topCategory3 = topRow.insertCell(2);
  topCategory1.innerHTML = '<th style="width:60%;">Name</th>';
  topCategory2.innerHTML = '<th style="width:40%;">Grade</th>';
  topCategory3.innerHTML = '<th style="width:40%;">Team</th>';

  for (i = 0; i < gblPlayerData.length; i++) {
   //if (filter != null) {
   //if (gblPlayerData[i].section)
   var row = table.insertRow(-1);
   var cell1 = row.insertCell(0);
   var cell2 = row.insertCell(1);
   var cell3 = row.insertCell(2);
   cell1.innerHTML = gblPlayerData[i].StudentName;
   cell2.innerHTML = gblPlayerData[i].Gr;
   cell3.innerHTML = gblPlayerData[i].Team;
   row.setAttribute("index", i);

   row.addEventListener("click", checkIn);

   if (gblPlayerData[i].Checkedin == 1) {
    $(row).addClass("checkedIn")
   }
   else {
    $(row).addClass("selectable");
   }
   //}
  }
 }

 function checkIn(e) {
  let selectedIndex = this.getAttribute("index");
  var message = document.getElementById("message");



  if (gblPlayerData[selectedIndex].Checkedin == 1) {
   gblPlayerData[selectedIndex].Checkedin = 0;
   message.innerHTML = "Player has already been unselected";

   $(this).removeClass("checkedIn");
   $(this).addClass("selectable");
   localStorage.setItem('PlayerData', JSON.stringify(gblPlayerData));
  }
  else {
   gblPlayerData[selectedIndex].Checkedin = 1;
   message.innerHTML = "Player has been checked in! Click another player to select them";

   $(this).addClass("checkedIn");
   $(this).removeClass("selectable");
   localStorage.setItem('PlayerData', JSON.stringify(gblPlayerData));
  }



 }
 