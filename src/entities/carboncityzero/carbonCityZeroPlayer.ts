import Player from "framework/entities/player";
import ResourcesPool from "framework/entities/resourcesPool";
import OrderedCardHolder from "framework/entities/orderedcardholder";
import Card from "framework/entities/card";
import { action, makeObservable, observable, override } from "mobx";
import CardHolder from "framework/entities/cardholder";
import { CarbonCityZeroCard } from "./carbonCityZeroCard";

export default class CarbonCityZeroPlayer extends Player {

    drawDeck: CardHolder<CarbonCityZeroCard>
    drawnCards: OrderedCardHolder<CarbonCityZeroCard>
    recyclePile: OrderedCardHolder<CarbonCityZeroCard>
    income: number
    carbon: number

    public constructor(name: string) {
        super(name)
        const cards = [
            //                                              hasAc   ac          co  i   ca
            new CarbonCityZeroCard("Budget 1",              false,  undefined,  1,  1,  0),
            new CarbonCityZeroCard("Budget 2",              false,  undefined,  1,  1,  0),
            new CarbonCityZeroCard("Budget 3",              false,  undefined,  1,  1,  0),
            new CarbonCityZeroCard("Budget 4",              false,  undefined,  1,  1,  0),
            new CarbonCityZeroCard("Budget 5",              false,  undefined,  1,  1,  0),
            new CarbonCityZeroCard("Global Market 1",       true,   undefined,  1,  1,  1),
            new CarbonCityZeroCard("Global Market 2",       true,   undefined,  1,  1,  1),
            new CarbonCityZeroCard("Poor Housing Stock 1",  true,   undefined,  0,  0,  1),
            new CarbonCityZeroCard("Remote Properties 1",   true,   undefined,  0,  0,  0),
        ]
        this.drawDeck = new CardHolder<CarbonCityZeroCard>(cards) // PLACEHOLDER
        this.drawDeck.shuffle()
        this.drawnCards = new OrderedCardHolder<CarbonCityZeroCard>([], (a,b) => 1)  // PLACEHOLDER
        this.recyclePile = new OrderedCardHolder<CarbonCityZeroCard>([], (a,b) => 1)  // PLACEHOLDER
        this.income = 0
        this.carbon = 40
        makeObservable(this, {
            name: override,
            carbon: observable,
            drawnCards: observable,
            recyclePile: observable,
            income: observable,
            drawCards: action,
            discardAllDrawnCards: action,
            setIncome: action,
            getTotalIncome: observable
        })
    }

    public drawCards(amount: number) {
        for (let i = 0 ; i < amount ; i ++) {
            // Check if Draw Deck is empty
            if (this.drawDeck.size == 0) {
                // Move Recycle Pile into Draw Deck
                for (let j = 0 ; j != this.recyclePile.size ; j) {
                    this.recyclePile.moveCard(
                        this.recyclePile.head,
                        this.drawDeck
                    )
                }
                // Shuffle Draw Deck
                this.drawDeck.shuffle()
            }
            // Draw a card
            this.drawDeck.moveCard(
                this.drawDeck.head,
                this.drawnCards)
        }
    }

    public discardAllDrawnCards() {
        for (let i = 0 ; i != this.drawnCards.size ; i) {
            this.drawnCards.moveCard(
                this.drawnCards.head,
                this.recyclePile
            )
        }
    }

    public setIncome(income: number) {
        this.income = income
    }

    public getTotalIncome(): number {
        return this.drawnCards.cards.reduce((total, card) => {
            return total + (card.income ?? 0)
        }, 0)
    }

}