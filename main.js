 var gblPlayerData = null;
 var gblSection = null;
 var displayData = null;
 let checkedInPlayers = [];
 
 // Displays the players who have been checked in in a table at the bottom of the page
 function displayCheckedInPlayers() {
  // clear checkedInPlayers 
  checkedInPlayers = []

  let table;

  $('#checkedInTable').empty();
  table = $('#checkedInTable')[0];
  
  let header = table.createTHead()
  let headerRow = header.insertRow(0);
  let headerText = headerRow.insertCell(0);
  let headerText2 = headerRow.insertCell(1);
  let headerText3 = headerRow.insertCell(2);
  headerText.innerHTML = "<b>Checked-In Players</b>";

  let topRow = table.insertRow(1);
  let topCategory1 = topRow.insertCell(0);
  let topCategory2 = topRow.insertCell(1);
  let topCategory3 = topRow.insertCell(2);
  topCategory1.innerHTML = '<th style="width:60%;">Name</th>';
  topCategory2.innerHTML = '<th style="width:40%;">Grade</th>';
  topCategory3.innerHTML = '<th style="width:40%;">Team</th>';

  // fill checkedInPlayers array with players whose Checkedin property in local storage is 1
  if (gblPlayerData.length && !checkedInPlayers.length) {
   $('.hideJumpLink').removeClass('hideJumpLink')
   for (let i = 0; i < gblPlayerData.length; i++) {
    if (gblPlayerData[i].Checkedin == 1) {
     checkedInPlayers.push(gblPlayerData[i])
    }
   }
  }
  if (checkedInPlayers.length) {
   for (let i = 0; i < checkedInPlayers.length; i++) {
   
   let row = table.insertRow(-1);
   let cell1 = row.insertCell(0);
   let cell2 = row.insertCell(1);
   let cell3 = row.insertCell(2);
   cell1.innerHTML = checkedInPlayers[i].StudentName;
   cell2.innerHTML = checkedInPlayers[i].Gr;
   cell3.innerHTML = checkedInPlayers[i].Team;
   }

  }
 }

 self.addEventListener("load", (event) => {
  // clear local storage when a new csv is uploaded
  localStorage.removeItem('PlayerData');
  
  gblPlayerData = this.checkDataLoaded();

  // let lastSection = localStorage.getItem("Section");

  // if (lastSection) {
  //  $('#sections')[0].value = lastSection;
  //  gblSection = lastSection;
  // }
  
  // //sets the section, and the filename of the csv to be generated
  // $('#sections').change(function() {
  //  gblSection = $(this).val();
  //  localStorage.setItem("Section", gblSection);
  // });
  
  $('#searchBar').keyup(function() {
    displayPlayers($('#searchBar').val())
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
  else {
   return null;
  }
 }

 //Check in a player
 function setSection(index) {
  gblPlayerData[1].Checkedin = 1;
  localStorage.setItem('PlayerData', JSON.stringify(parsedData));


 }

 function parseCSVData(csvData) {
  
  //clear local data
  localStorage.removeItem('PlayerData');
  let csvDataTrimmed = csvData.trim()
  
  // Set all checkins to '0' when initial file is uploaded
  let parsedData = $.csv.toObjects(csvDataTrimmed);
  for (let i=0; i<parsedData.length; i++) {
   if (parsedData[i].Checkedin == '' || parsedData[i].Checkedin == 1) {
    parsedData[i].Checkedin = 0;
   }
  }
  //Add to local storage
  localStorage.setItem('PlayerData', JSON.stringify(parsedData));

  gblPlayerData = parsedData;
 }

function generateDownload() {
  let date = new Date()
  let month = date.getMonth() + 1
  let csvContent = "data:text/csv;charset=utf-8," + $.csv.fromObjects(gblPlayerData);

  let encodedUri = encodeURI(csvContent);
  let link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "players-" + month + '.' + date.getDate() + '.' + date.getFullYear() + ".csv");
  document.body.appendChild(link); // Required for FF

  link.click();
}

function displayPlayers(searchVal) {

  // Declare variables
  let input, table, tr, td, i, txtValue;
  
  let regex = new RegExp(searchVal, 'i');
  
  let validPlayers = gblPlayerData;
  
  if (searchVal)
  {
   validPlayers = gblPlayerData.filter(
    player => (player.StudentName.search(regex) >= 0)
   );
  }
  

  $('#myTable').empty();
  table = $('#myTable')[0];

  let topRow = table.insertRow(0);
  let topCategory1 = topRow.insertCell(0);
  let topCategory2 = topRow.insertCell(1);
  let topCategory3 = topRow.insertCell(2);
  topCategory1.innerHTML = '<th style="width:60%;">Name</th>';
  topCategory2.innerHTML = '<th style="width:40%;">Grade</th>';
  topCategory3.innerHTML = '<th style="width:40%;">Team</th>';

  for (i = 0; i < validPlayers.length; i++) {
   
   let playerToDisplay = validPlayers[i];
   
   let row = table.insertRow(-1);
   let cell1 = row.insertCell(0);
   let cell2 = row.insertCell(1);
   let cell3 = row.insertCell(2);
   cell1.innerHTML = playerToDisplay.StudentName;
   cell2.innerHTML = playerToDisplay.Gr;
   cell3.innerHTML = playerToDisplay.Team;
   //row.setAttribute("index", i);
   row.setAttribute("playerName", playerToDisplay.StudentName)
   row.setAttribute("playerGrade", playerToDisplay.Gr)
   row.setAttribute("playerTeam", playerToDisplay.Team)

   row.addEventListener("click", checkIn);
   $(row).addClass("selectable");

   if (playerToDisplay.Checkedin == 1) {
    $(row).addClass("checkedIn")
   }
  }
 }

 function checkIn(e) {

  //let selectedIndex = this.getAttribute("index");
  let selectedPlayerName = this.getAttribute('playerName')
  let selectedPlayerGrade = this.getAttribute('playerGrade')
  let selectedPlayerTeam = this.getAttribute('playerTeam')

  var message = document.getElementById("message");
  
  // use the selected player's name to determine the index of that player in the global player data
  let playerGlobalIndex = gblPlayerData.findIndex(player => player.StudentName == selectedPlayerName && player.Gr == selectedPlayerGrade && player.Team == selectedPlayerTeam )
  if (gblPlayerData[playerGlobalIndex].Checkedin == 1) {
   gblPlayerData[playerGlobalIndex].Checkedin = 0;
   let playerToRemove = checkedInPlayers.findIndex(player => player.StudentName == gblPlayerData[playerGlobalIndex].StudentName)
   checkedInPlayers.splice(playerToRemove, 1)
   message.innerHTML = "Player has been unselected";
   $(this).removeClass("checkedIn");
   $(this).addClass("selectable");
   localStorage.setItem('PlayerData', JSON.stringify(gblPlayerData));
   displayCheckedInPlayers()
  }
  else {
   gblPlayerData[playerGlobalIndex].Checkedin = 1;
   message.innerHTML = "Player has been checked in! Click another player to select them";
   checkedInPlayers.push(gblPlayerData[playerGlobalIndex])
   $(this).addClass("checkedIn");
   $(this).removeClass("selectable");
   localStorage.setItem('PlayerData', JSON.stringify(gblPlayerData));
   displayCheckedInPlayers()
  }



 }
 