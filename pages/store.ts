import { io } from 'socket.io-client';
import GameState from "framework/entities/gameState";
import Player from "framework/entities/player";
import CarbonCityZeroPlayer from "src/entities/carboncityzero/carbonCityZeroPlayer";
import CarbonCityZeroState from "src/entities/carboncityzero/carbonCityZeroState";
import CardHolder from 'framework/entities/cardholder';
import { CarbonCityZeroCard } from 'src/entities/carboncityzero/carbonCityZeroCard';
import OrderedCardHolder from 'framework/entities/orderedcardholder';


// Manage connection

const socket = io('http://localhost:8080')
socket.on('connect', () => {
    // Report connection
    console.log(`You connected with id: ${socket.id}`)
    // Load to the server the update types that will be called
    const updateTypes = new Map()
    updateTypes.set('callUpdatePlayers', 'updatePlayers')
    socket.emit('loadUpdateTypes', Object.fromEntries(updateTypes))
})

// Export state

var gameState = new CarbonCityZeroState()
export default gameState


// Sync call functions

function callUpdate(name: String, update: any) {
    socket.emit('callUpdate', name, update)
}

export function callUpdatePlayers(emittedPlayers: Player[]) {
    callUpdate('callUpdatePlayers', emittedPlayers)
}

// Sync get functions

socket.on('updatePlayers', newPlayers => {
    const players = newPlayers.map((playerData: any) => {
        // Create player and set name
        const player = new CarbonCityZeroPlayer(playerData.name)
        // Set color
        player.setColor(playerData.color)
        // Set Draw Deck
        const drawDeck = new CardHolder<CarbonCityZeroCard>
        for (const c of playerData.drawDeck.cards) {
            const newCard = new CarbonCityZeroCard(
                c.name,
                c.cost,
                c.income,
                c.carbon,
                c.sector,
                c.specialRule,
                c.linkAbility
            )
            drawDeck.addCard(newCard)
        }
        player.setDrawDeck(drawDeck)
        // Set Drawn Cards
        const drawnCards = new OrderedCardHolder<CarbonCityZeroCard>([], (a, b) => 1)
        for (const c of playerData.drawnCards.cards) {
            const newCard = new CarbonCityZeroCard(
                c.name,
                c.cost,
                c.income,
                c.carbon,
                c.sector,
                c.specialRule,
                c.linkAbility
            )
            drawnCards.addCard(newCard)
        }
        player.setDrawnCards(drawnCards)
        // Set Recycle Pile
        const recyclePile = new OrderedCardHolder<CarbonCityZeroCard>([], (a, b) => 1)
        for (const c of playerData.drawnCards.cards) {
            const newCard = new CarbonCityZeroCard(
                c.name,
                c.cost,
                c.income,
                c.carbon,
                c.sector,
                c.specialRule,
                c.linkAbility
            )
            recyclePile.addCard(newCard)
        }
        player.setDrawnCards(recyclePile)
        // Set income, carbon, factoriesIncreaseCarbon, status, buyToTop, search
        player.setIncome(playerData.income)
        player.setCarbon(playerData.carbon)
        player.setFactoriesIncreaseCarbon(playerData.factoriesIncreaseCarbon)
        player.setStatus(playerData.status)
        player.setBuyToTop(playerData.buyToTop)
        player.setSearch(playerData.search)
        // Return the new player
        return player
    })
    gameState.setPlayers(players)
})