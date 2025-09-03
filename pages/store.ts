import { io } from "socket.io-client";
import GameState from "framework/entities/gameState";
import Player from "framework/entities/player";
import CarbonCityZeroPlayer from "src/entities/carboncityzero/carbonCityZeroPlayer";
import CarbonCityZeroState from "src/entities/carboncityzero/carbonCityZeroState";

const socket = io('http://localhost:8080')
socket.on('connect', () => {
    // Report connection
    console.log(`You connected with ID: ${socket.id}`)
})

var gameState = new CarbonCityZeroState();
export default gameState;