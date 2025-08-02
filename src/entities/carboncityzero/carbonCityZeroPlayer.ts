import Player from "framework/entities/player";
import ResourcesPool from "framework/entities/resourcesPool";
import { carbonType, Resources } from "./common";
import OrderedCardHolder from "framework/entities/orderedcardholder";
import Card from "framework/entities/card";
import { makeObservable, observable, override } from "mobx";
import CardHolder from "framework/entities/cardholder";

export default class CarbonCityZeroPlayer extends Player {

    carbon: ResourcesPool<Resources>
    drawDeck: CardHolder<Card>
    drawnCards: OrderedCardHolder<Card>
    recyclePile: OrderedCardHolder<Card>

    public constructor(name: string) {
        super(name)
        this.carbon = new ResourcesPool()
        this.carbon.addResources(carbonType, 40)
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
        this.drawDeck = new CardHolder<Card>(cards) // PLACEHOLDER
        this.drawDeck.shuffle()
        this.drawnCards = new OrderedCardHolder<Card>([], (a,b) => 1)  // PLACEHOLDER
        this.recyclePile = new OrderedCardHolder<Card>([], (a,b) => 1)  // PLACEHOLDER
        makeObservable(this, {
            name: override,
            carbon: observable,
            drawnCards: observable,
            recyclePile: observable
        })
    }

    public drawCards(amount: number) {
        for (let i = 0 ; i < amount ; i ++) {
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