import Player from "framework/entities/player";
import ResourcesPool from "framework/entities/resourcesPool";
import { carbonType, Resources } from "./common";
import OrderedCardHolder from "framework/entities/orderedcardholder";
import Card from "framework/entities/card";
import { makeObservable, observable, override } from "mobx";
import CardHolder from "framework/entities/cardholder";
import { CarbonCityZeroCard } from "./carbonCityZeroCard";

export default class CarbonCityZeroPlayer extends Player {

    carbon: ResourcesPool<Resources>
    drawDeck: CardHolder<CarbonCityZeroCard>
    drawnCards: OrderedCardHolder<CarbonCityZeroCard>
    recyclePile: OrderedCardHolder<CarbonCityZeroCard>

    public constructor(name: string) {
        super(name)
        this.carbon = new ResourcesPool()
        this.carbon.addResources(carbonType, 40)
        const cards = [
            new CarbonCityZeroCard("Budget 1", true),
            new CarbonCityZeroCard("Budget 2"),
            new CarbonCityZeroCard("Budget 3", true),
            new CarbonCityZeroCard("Budget 4"),
            new CarbonCityZeroCard("Budget 5", true),
            new CarbonCityZeroCard("Global Market 1", true),
            new CarbonCityZeroCard("Global Market 2"),
            new CarbonCityZeroCard("Poor Housing Stock 1", true),
            new CarbonCityZeroCard("Remote Properties 1", true),
        ]
        this.drawDeck = new CardHolder<CarbonCityZeroCard>(cards) // PLACEHOLDER
        this.drawDeck.shuffle()
        this.drawnCards = new OrderedCardHolder<CarbonCityZeroCard>([], (a,b) => 1)  // PLACEHOLDER
        this.recyclePile = new OrderedCardHolder<CarbonCityZeroCard>([], (a,b) => 1)  // PLACEHOLDER
        makeObservable(this, {
            name: override,
            carbon: observable,
            drawnCards: observable,
            recyclePile: observable
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

}