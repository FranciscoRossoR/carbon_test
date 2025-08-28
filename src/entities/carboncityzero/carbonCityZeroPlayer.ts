import Player from "framework/entities/player";
import ResourcesPool from "framework/entities/resourcesPool";
import OrderedCardHolder from "framework/entities/orderedcardholder";
import Card from "framework/entities/card";
import { action, makeObservable, observable, override } from "mobx";
import CardHolder from "framework/entities/cardholder";
import { CarbonCityZeroCard } from "./carbonCityZeroCard";
import gameState from "pages/store";

export default class CarbonCityZeroPlayer extends Player {

    drawDeck: CardHolder<CarbonCityZeroCard>
    drawnCards: OrderedCardHolder<CarbonCityZeroCard>
    recyclePile: OrderedCardHolder<CarbonCityZeroCard>
    income: number
    carbon: number

    public constructor(name: string) {
        super(name)
        const cards = [
            //                      name                    co  i   ca  s   linkAb      hasAc   cAc                                         
            new CarbonCityZeroCard("Budget 1",              1,  1,  0,  0),
            new CarbonCityZeroCard("Budget 2",              1,  1,  0,  0),
            new CarbonCityZeroCard("Budget 3",              1,  1,  0,  0),
            new CarbonCityZeroCard("Budget 4",              1,  1,  0,  0),
            new CarbonCityZeroCard("Budget 5",              1,  1,  0,  0),
            new CarbonCityZeroCard("Global Market 1",       1,  1,  1,  0,  undefined,  true),
            new CarbonCityZeroCard("Global Market 2",       1,  1,  1,  0,  undefined,  true),
            new CarbonCityZeroCard("Poor Housing Stock 1",  0,  0,  1,  0,  undefined,  true),
            new CarbonCityZeroCard("Remote Properties 1",   0,  0,  0,  0,  undefined,  true),
        ]
        this.drawDeck = new CardHolder<CarbonCityZeroCard>(cards) // PLACEHOLDER
        this.drawDeck.shuffle()
        this.drawnCards = new OrderedCardHolder<CarbonCityZeroCard>([], (a,b) => 1)  // PLACEHOLDER
        this.recyclePile = new OrderedCardHolder<CarbonCityZeroCard>([], (a,b) => 1)  // PLACEHOLDER
        this.income = 0
        this.carbon = 40
        makeObservable(this, {
            name: override,
            drawnCards: observable,
            recyclePile: observable,
            income: observable,
            carbon: observable,
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

    public addDrawnCardsCarbon() {
        let totalDrawnCardsCarbon = this.drawnCards.cards.reduce((total, card) =>{
            return total + (card.carbon ?? 0)
        }, 0)
        this.carbon = Math.min(49, this.carbon + totalDrawnCardsCarbon)
        if (this.carbon <= 0) {
            gameState.winGame(this)
        }
    }

}