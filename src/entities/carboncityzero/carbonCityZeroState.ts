import Card from "framework/entities/card";
import CardHolder from "framework/entities/cardholder";
import GameAction from "framework/entities/gameAction";
import GameState, { GameStatus } from "framework/entities/gameState";
import CarbonCityZeroPlayer from "./carbonCityZeroPlayer";
import UniqueGameElement from "framework/entities/gameElement";
import ComplexityAnalyst from "framework/entities/complexityAnalyst";
import OrderedCardHolder from "framework/entities/orderedcardholder";
import { computed, makeObservable, observable, override } from "mobx";

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
        this.turn = 0
        makeObservable(this, {
            availableActions: override,
            status: override,
            gameElements: override,
            history: override,
            marketDeck: observable,
            landfillPile: observable,
            turn: observable,
            currentPlayer: computed
        })
    }

    public getPlayer(index: number): CarbonCityZeroPlayer {
        return <CarbonCityZeroPlayer> this.players[index]
    }

    public get currentPlayer(): CarbonCityZeroPlayer {
        return this.getPlayer(this.turn)
    }

    protected computeAvailableActions(): GameAction[] {
        throw new Error("Method not implemented.");
    }

}