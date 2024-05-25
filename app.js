const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");

const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`Error Occured:${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

//get players API 1
app.get("/players/", async (request, response) => {
  const playersListQuery = `SELECT * FROM cricket_team`;
  const playersArray = await db.all(playersListQuery);
  response.send(playersArray);
});

//API 2
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const playerAddQuery = `INSERT INTO cricket_team(player_name,jersey_number,role)
    VALUES (
        ${playerName},
        ${jerseyNumber},
        ${role}
    );`;
  const dbResponse = await db.run(playerAddQuery);
  const player_id = dbResponse.lastID;
  response.send({ player_id: player_id });
  response.send("Player Added to Team");
});

//API 3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId}`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});

//API 4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updateQuery = `UPDATE cricket_team SET
   
    player_name=${playerName},
    jersey_number=${jerseyNumber},
    role=${role}
    WHERE player_id=${playerId};`;
  await db.run(updateQuery);
  response.send("Player Details Updated");
});

//API 5
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `DELETE FROM cricket_team WHERE player_id=${playerId}`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;
