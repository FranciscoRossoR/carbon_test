import Card from "framework/entities/card";
import CardHolder from "framework/entities/cardholder";
import GameAction from "framework/entities/gameAction";
import GameState, { GameStatus } from "framework/entities/gameState";
import CarbonCityZeroPlayer from "./carbonCityZeroPlayer";
import UniqueGameElement from "framework/entities/gameElement";
import ComplexityAnalyst from "framework/entities/complexityAnalyst";
import OrderedCardHolder from "framework/entities/orderedcardholder";
import { action, computed, makeObservable, observable, override, reaction } from "mobx";
import { BuyAction, PassAction } from "./actions";
import { CarbonCityZeroCard } from "./carbonCityZeroCard";

export default class CarbonCityZeroState extends GameState {

    marketDeck: CardHolder<CarbonCityZeroCard>
    marketplace: OrderedCardHolder<CarbonCityZeroCard>
    landfillPile: OrderedCardHolder<CarbonCityZeroCard>
    marketSize: number
    turn: number
    phase: number
    winner?: CarbonCityZeroPlayer

    public constructor(players?: CarbonCityZeroPlayer[], gameElements?: UniqueGameElement[], status?: GameStatus, complexAnalyst?: ComplexityAnalyst) {
        gameElements = []
        super(1, 4, players ? players : [], gameElements, status, complexAnalyst)
        // PLACEHOLDER
        const cards = [
                    //                      name            co  i   ca  s   hasAc
                    new CarbonCityZeroCard("Market Card 1", 1,  1,  -1, 1,  true),
                    new CarbonCityZeroCard("Market Card 2", 2,  2,  0,  2),
                    new CarbonCityZeroCard("Market Card 3", 3,  3,  1,  3,  true),
                    new CarbonCityZeroCard("Market Card 4", 1,  1,  -1, 1,  true),
                    new CarbonCityZeroCard("Market Card 5", 2,  2,  0,  2),
                    new CarbonCityZeroCard("Market Card 6", 3,  3,  1,  3,  true),
                    new CarbonCityZeroCard("Market Card 7", 1,  1,  -1, 1,  true),
                    new CarbonCityZeroCard("Market Card 8", 2,  2,  0,  2),
                    new CarbonCityZeroCard("Blessing",      0,  0,  -200),
                    new CarbonCityZeroCard("Nuke",          0,  0,  200),
                ]
        this.marketDeck = new CardHolder<CarbonCityZeroCard>(cards)
        this.marketDeck.shuffle()
        this.marketplace = new OrderedCardHolder<CarbonCityZeroCard>([], (a, b) => 1)   // PLACEHOLDER
        this.landfillPile = new OrderedCardHolder<CarbonCityZeroCard>([], (a,b) => 1)   // PLACEHOLDER
        this.landfillPile.addCard(new CarbonCityZeroCard("Landfill Placeholder Card"))  // PLACEHOLDER
        this.marketSize = 4
        this.turn = -1
        this.phase = 0
        makeObservable(this, {
            availableActions: override,
            status: override,
            gameElements: override,
            history: override,
            marketDeck: observable,
            marketplace: observable,
            landfillPile: observable,
            turn: observable,
            phase: observable,
            currentPlayer: computed,
            nextPlayer: computed,
            previousPlayer: computed,
            winGame: action,
            setWinner: action,
            passTurn: action,
            goToBuyPhase: action
        })
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

    public get nextPlayer(): CarbonCityZeroPlayer {
        return this.getPlayer(this.turn + 1 >= this.players.length ? 0 : this.turn + 1)
    }

    public get previousPlayer(): CarbonCityZeroPlayer {
        return this.getPlayer(this.turn - 1 < 0 ? this.players.length - 1 : this.turn)
    }

    protected computeAvailableActions(): GameAction[] {
        const res: GameAction[] = []
        if (this.status === "playing") {
            if (this.phase === 0) {
                res.push(new BuyAction())
            } else if (this.phase === 1) {
                res.push(new PassAction())
            }
        }
        return res
    }

    public passTurn(): CarbonCityZeroState {
        this.turn ++
        if (this.turn >= this.players.length) {
            this.turn = 0
        }
        this.phase = 0
        return this
    }

    public goToBuyPhase(): CarbonCityZeroState {
        this.phase = 1
        let player = this.currentPlayer
        player.setIncome(player.getTotalIncome())
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
        let player = this.currentPlayer
        this.marketplace.moveCard(
            card,
            player.recyclePile
        )
        player.setIncome(player.income - card.cost)
    }

    public winGame(player: CarbonCityZeroPlayer) {
        this.setWinner(player)
        this.status = "finished"
    }

}