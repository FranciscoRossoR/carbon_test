import GameState from "framework/entities/gameState";
import Player from "framework/entities/player";
import CarbonCityZeroState from "src/entities/carboncityzero/carbonCityZeroState";

const players = [new Player("player1"),
    new Player("player2"),
    new Player("player3")
]

var gameState = new CarbonCityZeroState(1, 4, players, [], "open");

export default gameState;