const doStuff = async () => {
  let leagues = await fetch(
    "http://localhost:4567/get_leagues"
  )
    
  let j = await leagues.json()
  console.log(j)
  
  j.map(makeLeagueButton)
}
document.onload = doStuff()

async function displayLeagues() {
  let leagues = await fetch(
    "http://localhost:4567/get_leagues"
  )
  
  (await leagues.json()).map(makeLeagueButton)
}

async function displayTeam(leagueId) {
  var standings = await (await fetch(
    "http://localhost:4567/get_league_standings?leagueId="+leagueId
  )).json()
  
  $(".leagueButton").remove()
  
  // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value <- lit
  function compare(a,b) {
    if (a.score < b.score)
      return 1;
    if (a.score > b.score)
      return -1;
    return 0;
  }

  $("body").append($(`<p class=\"standings\"></p>`).text("Current Standings"))
  $("body").append("<br /><br />")
  standings.sort(compare);
  standings.map(showTeamStanding)
  
  $("body").append($(`<button class=\"newTeamButton\" onclick=\"createTeam('${leagueId}')\" ></button>`).text("Create Team"))
}

async function createTeam(leagueId) {
    await fetch(
    "http://localhost:4567/add_team?userName=Schmaron&userId=1696cbc9-5a61-45d4-b35e-6994a885c22b&leagueId="+leagueId,
    {
      'method': 'POST'
    }
    )
    
    let garbageLanguage = await (await fetch(
      "http://localhost:4567/get_all_athletes"
    )).json()
    
    console.log(garbageLanguage)

    $("br").remove()
    $(".newTeamButton").remove()
    $(".standings").remove()
  
  garbageLanguage.map(makeAthleteButton)
      
  function makeAthleteButton(athlete) {
    $("body").append($(`<p class=\"athleteData\"></p>`).text(`Athlete Name: ${athlete.athleteName.firstName} ${athlete.athleteName.lastName} Win Rate: ${athlete.athleteStatistics.bowlerData.matchWinLoss} Price: ${athlete.athleteStatistics.athleteValue}`))
    $("body").append($(`<button class=\"athleteButton\" onclick=\"displayTeamFinal('${leagueId}')\" ></button>`).text("Draft This Athlete"))
    $("body").append("<br /><br />")
  }
}

function showTeamStanding(team) {
  $("br").remove()
  $("body").append($(`<p class=\"standings\"></p>`).text(`Team Owner: ${team.name} Score: ${team.score}`))
}


function makeLeagueButton(league) {
  $("body").append($(`<button class=\"leagueButton\" onclick=\"displayTeam('${league.leagueId}')\" ></button>`).text(`Type: ${league.athleteType} Budget: ${league.teamBudget}`))
  $("body").append("<br /><br />")
}

async function displayTeamFinal(leagueId) {
  var standings = await (await fetch(
    "http://localhost:4567/get_league_standings?leagueId="+leagueId
  )).json()
  
  $("br").remove()
  $(".athleteData").remove()
  $(".leagueButton").remove()
  $(".athleteButton").remove()
  $(".newTeamButton").remove()
  
  // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value <- lit
  function compare(a,b) {
    if (a.score < b.score)
      return 1;
    if (a.score > b.score)
      return -1;
    return 0;
  }

  $("body").append($(`<p class=\"standings\"></p>`).text("Current Standings"))
  $("body").append("<br /><br />")
  standings.sort(compare);
  standings.map(showTeamStanding)
}
