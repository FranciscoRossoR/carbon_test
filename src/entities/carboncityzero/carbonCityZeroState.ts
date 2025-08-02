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

export default class CarbonCityZeroState extends GameState {

    marketDeck: CardHolder<Card>
    landfillPile: OrderedCardHolder<Card>
    turn: number

    public constructor(players?: CarbonCityZeroPlayer[], gameElements?: UniqueGameElement[], status?: GameStatus, complexAnalyst?: ComplexityAnalyst) {
        gameElements = []
        super(1, 4, players ? players : [], gameElements, status, complexAnalyst)
        const cards = [
                    new Card("Budget 1"),
                    new Card("Budget 2"),
                    new Card("Budget 3"),
                    new Card("Budget 4"),
                    new Card("Budget 5"),
                    new Card("Global Market 1"),
                    new Card("Global Market 2"),
                    new Card("Poor Housing Stock 1"),
                    new Card("Remote Properties 1"),
                ]
        this.marketDeck = new CardHolder<Card>(cards)
        this.marketDeck.shuffle()
        this.landfillPile = new OrderedCardHolder<Card>([], (a,b) => 1)  // PLACEHOLDER
        this.turn = -1
        makeObservable(this, {
            availableActions: override,
            status: override,
            gameElements: override,
            history: override,
            marketDeck: observable,
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
            return true
        } else {
            return false
        }
    }

}