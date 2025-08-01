import GameState from "framework/entities/gameState";
import Player from "framework/entities/player";
import CarbonCityZeroPlayer from "src/entities/carboncityzero/carbonCityZeroPlayer";
import CarbonCityZeroState from "src/entities/carboncityzero/carbonCityZeroState";

const players = [new CarbonCityZeroPlayer("player1"),
    new CarbonCityZeroPlayer("player2"),
    new CarbonCityZeroPlayer("player3")
]

var gameState = new CarbonCityZeroState(players);

export default gameState;