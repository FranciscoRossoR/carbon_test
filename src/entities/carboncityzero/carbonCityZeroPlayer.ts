import Player from "framework/entities/player";
import ResourcesPool from "framework/entities/resourcesPool";
import OrderedCardHolder from "framework/entities/orderedcardholder";
import Card from "framework/entities/card";
import { action, makeObservable, observable, override } from "mobx";
import CardHolder from "framework/entities/cardholder";
import { CarbonCityZeroCard, LinkAbility, Sector } from "./carbonCityZeroCard";
import gameState from "pages/store";

export default class CarbonCityZeroPlayer extends Player {

    drawDeck: CardHolder<CarbonCityZeroCard>
    drawnCards: OrderedCardHolder<CarbonCityZeroCard>
    recyclePile: OrderedCardHolder<CarbonCityZeroCard>
    income: number
    carbon: number
    factoriesIncreaseCarbon: boolean

    public constructor(name: string) {
        super(name)
        const cards = [
            //                      name                    co  i   ca  s   sR                                        
            new CarbonCityZeroCard("Budget 1",              1,  1,  0,  0),
            new CarbonCityZeroCard("Budget 2",              1,  1,  0,  0),
            new CarbonCityZeroCard("Budget 3",              1,  1,  0,  0),
            new CarbonCityZeroCard("Budget 4",              1,  1,  0,  0),
            new CarbonCityZeroCard("Budget 5",              1,  1,  0,  0),
            new CarbonCityZeroCard("Global Market 1",       1,  1,  1,  0,  5),
            new CarbonCityZeroCard("Global Market 2",       1,  1,  1,  0,  5),
            new CarbonCityZeroCard("Poor Housing Stock 1",  0,  0,  1,  0,  1),
            new CarbonCityZeroCard("Remote Properties 1",   0,  0,  0,  0,  1),
        ]
        this.drawDeck = new CardHolder<CarbonCityZeroCard>(cards) // PLACEHOLDER
        this.drawDeck.shuffle()
        this.drawnCards = new OrderedCardHolder<CarbonCityZeroCard>([], (a,b) => 1)  // PLACEHOLDER
        this.recyclePile = new OrderedCardHolder<CarbonCityZeroCard>([], (a,b) => 1)  // PLACEHOLDER
        this.income = 0
        this.carbon = 40
        this.factoriesIncreaseCarbon = true
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
        let cards = this.drawnCards.cards
        // Check Link Ability modifiers
        let modifier = this.getLinkAbilityModifiers(cards)
        // Calculate total carbon from cards
        if (!this.factoriesIncreaseCarbon) {
            cards = cards.filter(card => !card.getIsFactory())
        }
        let totalDrawnCardsCarbon = cards.reduce((total, card) =>{
            return total + (card.carbon ?? 0)
        }, 0)
        // Set carbon to the new total OR the max if it's exceeded (49)
        let totalCarbon = this.carbon + totalDrawnCardsCarbon + modifier
        this.carbon = Math.min(49, totalCarbon)
        // Reactivate factories
        this.factoriesIncreaseCarbon = true
        // Check if game is won
        if (this.carbon <= 0) {
            gameState.winGame(this)
        }
    }

    public getLinkAbilityModifiers(cards: CarbonCityZeroCard[]): number {
        let modifier = 0
        let linkAbilities = this.getLinkAbilities(cards)
        for (let i = 0 ; i < linkAbilities.length ; i++) {
            let linkAbility = linkAbilities[i]
            switch(linkAbility) {
                case 1:
                    modifier -= 1
                    break
                case 2:
                    modifier -= 2
                    break
                case 3:
                    this.factoriesIncreaseCarbon = false
                    break
                default:
                    modifier -= 700
                    break
            }
        }
        return modifier
    }

    public getLinkAbilities(cards: CarbonCityZeroCard[]): LinkAbility[] {
        let linkAbilities: LinkAbility[] = []
        for (let i = 0 ; i < cards.length ; i++) {
            let card = cards[i]
            if (card.linkAbility && this.getHasMoreThanOneOfSector(card.sector)) {
                linkAbilities.push(card.linkAbility)
            }
        }
        return linkAbilities
    }

    public getHasMoreThanOneOfSector(sector: Sector): boolean {
        return this.drawnCards.cards.filter(c => c.sector === sector).length > 1
    }

}