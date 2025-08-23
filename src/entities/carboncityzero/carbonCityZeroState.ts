import Card from "framework/entities/card";
import CardHolder from "framework/entities/cardholder";
import GameAction from "framework/entities/gameAction";
import GameState, { GameStatus } from "framework/entities/gameState";
import CarbonCityZeroPlayer from "./carbonCityZeroPlayer";
import UniqueGameElement from "framework/entities/gameElement";
import ComplexityAnalyst from "framework/entities/complexityAnalyst";
import OrderedCardHolder from "framework/entities/orderedcardholder";
import { action, computed, makeObservable, observable, override } from "mobx";
import { PassAction } from "./actions";
import { CarbonCityZeroCard } from "./carbonCityZeroCard";

export default class CarbonCityZeroState extends GameState {

    marketDeck: CardHolder<CarbonCityZeroCard>
    marketplace: OrderedCardHolder<CarbonCityZeroCard>
    landfillPile: OrderedCardHolder<CarbonCityZeroCard>
    marketSize: number
    turn: number

    public constructor(players?: CarbonCityZeroPlayer[], gameElements?: UniqueGameElement[], status?: GameStatus, complexAnalyst?: ComplexityAnalyst) {
        gameElements = []
        super(1, 4, players ? players : [], gameElements, status, complexAnalyst)
        const cards = [
                    new CarbonCityZeroCard("Market Card 1", true),
                    new CarbonCityZeroCard("Market Card 2"),
                    new CarbonCityZeroCard("Market Card 3", true),
                    new CarbonCityZeroCard("Market Card 4"),
                    new CarbonCityZeroCard("Market Card 5", true),
                    new CarbonCityZeroCard("Market Card 6"),
                    new CarbonCityZeroCard("Market Card 7", true),
                    new CarbonCityZeroCard("Market Card 8"),
                    new CarbonCityZeroCard("Market Card 9", true),
                    new CarbonCityZeroCard("Market Card 10"),
                ]
        this.marketDeck = new CardHolder<CarbonCityZeroCard>(cards)
        this.marketDeck.shuffle()
        this.marketplace = new OrderedCardHolder<CarbonCityZeroCard>([], (a, b) => 1)   // PLACEHOLDER
        this.landfillPile = new OrderedCardHolder<CarbonCityZeroCard>([], (a,b) => 1)   // PLACEHOLDER
        this.marketSize = 4
        this.turn = -1
        makeObservable(this, {
            availableActions: override,
            status: override,
            gameElements: override,
            history: override,
            marketDeck: observable,
            marketplace: observable,
            landfillPile: observable,
            turn: observable,
            currentPlayer: computed,
            nextPlayer: computed,
            previousPlayer: computed,
            passTurn: action
        })
    }

    public getPlayer(index: number): CarbonCityZeroPlayer {
        return <CarbonCityZeroPlayer> this.players[index]
    }

    public get currentPlayer(): CarbonCityZeroPlayer {
        return this.getPlayer(this.turn)
    }

    public get nextPlayer(): CarbonCityZeroPlayer {
        return this.getPlayer(this.turn + 1 >= this.players.length ? 0 : this.turn + 1)
    }

    public get previousPlayer(): CarbonCityZeroPlayer {
        return this.getPlayer(this.turn - 1 < 0 ? this.players.length - 1 : this.turn)
    }

    protected computeAvailableActions(): GameAction[] {
        const res: GameAction[] = []
        if (this.status === "playing") {
            res.push(new PassAction())
        }
        return res
    }

    public passTurn(): CarbonCityZeroState {
        this.turn ++
        if (this.turn >= this.players.length) {
            this.turn = 0
        }
        return this
    }

    public startGame() : boolean {
        if (this.status === "open" && this.enoughPlayers) {
            this.turn = 0
            this.status = "playing"
            this.drawCards(this.marketSize)
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
                for (let j = 0 ; j != this.landfillPile.size; j) {
                    this.landfillPile.moveCard(
                        this.landfillPile.head,
                        this.marketDeck
                    )
                }
                // Shuffle Market Deck
                this.marketDeck.shuffle
            }
            // Draw a card
            this.marketDeck.moveCard(
                this.marketDeck.head,
                this.marketplace
            )
        }
    }

    public buyCard(card: CarbonCityZeroCard) {
        this.marketplace.moveCard(
            card,
            this.currentPlayer.recyclePile
        )
    }

}