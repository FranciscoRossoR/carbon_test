import CardHolder from "framework/entities/cardholder";
import GameAction from "framework/entities/gameAction";
import GameState, { GameStatus } from "framework/entities/gameState";
import CarbonCityZeroPlayer, { Search, Status } from "./carbonCityZeroPlayer";
import UniqueGameElement from "framework/entities/gameElement";
import ComplexityAnalyst from "framework/entities/complexityAnalyst";
import { action, computed, makeObservable, observable, override } from "mobx";
import { BuyAction, PassAction, ReadyAction } from "./actions";
import { CarbonCityZeroCard, Sector } from "./carbonCityZeroCard";
import { callUpdateMarketDeck } from "pages/store";
import { gameStartingDeck } from "pages/cardStore";

export type Phase = "ready" | "activating" | "buying"

export default class CarbonCityZeroState extends GameState {

    marketDeck: CardHolder<CarbonCityZeroCard>
    marketplace: CardHolder<CarbonCityZeroCard>
    landfillPile: CardHolder<CarbonCityZeroCard>
    globalSlot: CardHolder<CarbonCityZeroCard>
    marketSize: number
    playerDrawAmount: number
    turn: number
    phase: Phase
    winner: CarbonCityZeroPlayer | undefined
    counter: number

    public constructor(players?: CarbonCityZeroPlayer[], gameElements?: UniqueGameElement[], status?: GameStatus, complexAnalyst?: ComplexityAnalyst) {
        gameElements = []
        super(1, 4, players ? players : [], gameElements, status, complexAnalyst)
        this.marketDeck = gameStartingDeck
        this.marketDeck.shuffle()
        this.marketplace = new CardHolder<CarbonCityZeroCard>()
        this.landfillPile = new CardHolder<CarbonCityZeroCard>()
        this.globalSlot = new CardHolder<CarbonCityZeroCard>
        this.marketSize = 5
        this.playerDrawAmount = 5
        this.turn = -1
        this.phase = "ready"
        this.winner = undefined
        this.counter = 10
        makeObservable(this, {
            availableActions: override,
            status: override,
            gameElements: override,
            history: override,
            marketDeck: observable,
            marketplace: observable,
            landfillPile: observable,
            globalSlot: observable,
            marketSize: observable,
            playerDrawAmount: observable,
            turn: observable,
            phase: observable,
            winner: observable,
            currentPlayer: computed,
            winGame: action,
            setWinner: action,
            getReady: action,
            passTurn: action,
            goToBuyPhase: action,
            setMarketSize: action,
            setPlayerDrawAmount: action,
            addPlayer: action,
            setPlayers: action,
            setStatus: action,
            setTurn: action,
            setPhase: action,
            setMarketDeck: action,
            setMarketplace: action,
            setLandfillPile: action,
            setGlobalSlot: action
        })
        callUpdateMarketDeck(this.marketDeck)
    }

    public setWinner(winner: CarbonCityZeroPlayer) {
        this.winner = winner
    }

    public getPlayer(index: number): CarbonCityZeroPlayer {
        return <CarbonCityZeroPlayer> this.players[index]
    }

    public get currentPlayer(): CarbonCityZeroPlayer {
        return this.getPlayer(this.turn)
    }

    protected computeAvailableActions(): GameAction[] {
        const res: GameAction[] = []
        if (this.status === "playing") {
            switch (this.phase) {
                case "ready":
                    res.push(new ReadyAction())
                    break
                case "activating":
                    res.push(new BuyAction())
                    break
                case "buying":
                    res.push(new PassAction())
                    break
            }
        }
        return res
    }

    public passTurn(): CarbonCityZeroState {
        this.turn ++
        if (this.turn >= this.players.length) {
            this.turn = 0
        }
        this.phase = "activating"
        if (this.players.length === 1) {
            this.counter -= 1
            if (this.counter < 1) this.setStatus("finished")
            this.currentPlayer.drawCards(this.playerDrawAmount)
        }
        return this
    }

    public getReady(): CarbonCityZeroState {
        this.phase = "activating"
        return this
    }

    public goToBuyPhase(): CarbonCityZeroState {
        this.phase = "buying"
        let player = this.currentPlayer
        player.setIncome(player.getTotalIncome())
        player.setStatus(Status.Regular)
        player.setSearch(Search.None)
        return this
    }

    public startGame() : boolean {
        if (this.status === "open" && this.enoughPlayers) {
            while (this.marketplace.size < this.marketSize) {
                this.drawCards(this.marketSize-this.marketplace.size)
            }
            this.turn = 0
            this.status = "playing"
            return true
        } else {
            return false
        }
    }

    public drawCards(amount: number) {
        for (let i = 0 ; i < amount ; i ++) {
            // Check if Market Deck is empty
            if (this.marketDeck.size == 0) {
                // Move Landfill Pile into Market Deck
                let landfill = this.landfillPile
                while (landfill.size > 0) {
                    landfill.moveCard(landfill.head, this.marketDeck)
                }
                // Shuffle Market Deck
                this.marketDeck.shuffle()
            }
            // Draw card
            const card = this.marketDeck.head
            const sector = card.sector
            const player = this.currentPlayer
            let target: CardHolder<CarbonCityZeroCard>
            if (sector === Sector.Snag) {
                if (this.phase === "ready") {
                    target = this.landfillPile
                } else {
                    target = player.recyclePile
                }
            } else if (sector === Sector.Global) {
                if (this.globalSlot.size > 0) {
                    this.globalSlot.moveCard(this.globalSlot.head, this.landfillPile)
                }
                target = this.globalSlot
            } else {
                target = this.marketplace
            }
            this.marketDeck.moveCard(card, target)
            // if (this.phase !== "ready") callUpdateMarketDeck(this.marketDeck)
        }
    }

    public buyCard(card: CarbonCityZeroCard) {
        let player = this.currentPlayer
        player.setIncome(player.income - card.getCost())
        if (player.buyToTop) {
            this.marketplace.moveCard(card, player.drawDeck)
            player.setBuyToTop(false)
        } else {
            this.marketplace.moveCard(card, player.recyclePile)
        }
    }

    public winGame(player: CarbonCityZeroPlayer) {
        this.setWinner(player)
        this.status = "finished"
        console.log("WINNER" + this.winner?.name)
    }

    public setMarketSize(marketSize: number) {
        this.marketSize = marketSize
    }

    public setPlayerDrawAmount(playerDrawAmount: number) {
        this.playerDrawAmount = playerDrawAmount
    }

    public addPlayer(name: string) {
        if (this.status === "open") {
            this.players.push(new CarbonCityZeroPlayer(name))
        }
    }

    // Setters

    public setPlayers(players: CarbonCityZeroPlayer[]) {
        this.players = players
    }

    public setStatus(status: GameStatus) {
        this.status = status
    }

    public setTurn(turn: number) {
        this.turn = turn
    }

    public setPhase(phase: Phase) {
        this.phase = phase
    }

    public setMarketDeck(marketDeck: CardHolder<CarbonCityZeroCard>) {
        this.marketDeck = marketDeck
    }

    public setMarketplace(marketplace: CardHolder<CarbonCityZeroCard>) {
        this.marketplace = marketplace
    }

    public setGlobalSlot(globalSlot: CardHolder<CarbonCityZeroCard>) {
        this.globalSlot = globalSlot
    }

    public setLandfillPile(landfillPile: CardHolder<CarbonCityZeroCard>) {
        this.landfillPile = landfillPile
    }

}