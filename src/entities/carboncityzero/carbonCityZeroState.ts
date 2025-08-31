import Card from "framework/entities/card";
import CardHolder from "framework/entities/cardholder";
import GameAction from "framework/entities/gameAction";
import GameState, { GameStatus } from "framework/entities/gameState";
import CarbonCityZeroPlayer, { Search, Status } from "./carbonCityZeroPlayer";
import UniqueGameElement from "framework/entities/gameElement";
import ComplexityAnalyst from "framework/entities/complexityAnalyst";
import OrderedCardHolder from "framework/entities/orderedcardholder";
import { action, computed, makeObservable, observable, override, reaction } from "mobx";
import { BuyAction, PassAction } from "./actions";
import { CarbonCityZeroCard, Sector } from "./carbonCityZeroCard";

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
                    //                      name            co  i   ca  s   sr          lA
                    new CarbonCityZeroCard("Industry 1",    1,  1,  0,  1,  1,          3   ),
                    new CarbonCityZeroCard("Industry 2",    2,  2,  5,  1,  2,          3   ),
                    new CarbonCityZeroCard("Industry 3",    3,  3,  1,  1,                  ),
                    new CarbonCityZeroCard("Domestic 1",    1,  1,  -2, 2,  3,          1   ),
                    new CarbonCityZeroCard("Domestic 2",    2,  2,  -2, 2,  4,          2   ),
                    new CarbonCityZeroCard("Domestic 3",    3,  3,  -2, 2,  5,          2   ),
                    new CarbonCityZeroCard("Government 1",  1,  1,  -1, 3,  6,          1   ),
                    new CarbonCityZeroCard("Government 2",  2,  2,  0,  3,  7,              ),
                    new CarbonCityZeroCard("Government 3",  2,  2,  0,  3,  undefined,  3   ),
                    new CarbonCityZeroCard("Snag 1",        0,  0,  1,  4                   ),
                    new CarbonCityZeroCard("Snag 2",        0,  0,  1,  4                   ),
                    new CarbonCityZeroCard("Snag 3",        0,  0,  1,  4                   ),
                    new CarbonCityZeroCard("Blessing",      0,  0,  -200                    ),
                    new CarbonCityZeroCard("Nuke",          0,  0,  200                     ),
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
        player.setStatus(Status.Regular)
        player.setSearch(Search.None)
        return this
    }

    public startGame() : boolean {
        if (this.status === "open" && this.enoughPlayers) {
            this.turn = 0
            this.status = "playing"
            this.startingDraw()
            return true
        } else {
            return false
        }
    }

    public startingDraw() {
        while (this.marketplace.size < this.marketSize) {
            const card = this.marketDeck.head
            const target = card.sector === Sector.Snag ?
                this.landfillPile :
                this.marketplace
            this.marketDeck.moveCard(this.marketDeck.head, target)
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
            // Draw a card
            this.marketDeck.moveCard(
                this.marketDeck.head,
                this.marketplace
            )
        }
    }

    public buyCard(card: CarbonCityZeroCard) {
        let player = this.currentPlayer
        if (player.buyToTop) {
            this.marketplace.moveCard(card, player.drawDeck)
            player.setBuyToTop(false)
        } else {
            this.marketplace.moveCard(card, player.recyclePile)
        }
        player.setIncome(player.income - card.cost)
    }

    public winGame(player: CarbonCityZeroPlayer) {
        this.setWinner(player)
        this.status = "finished"
    }

}