import Player from "framework/entities/player";
import ResourcesPool from "framework/entities/resourcesPool";
import OrderedCardHolder from "framework/entities/orderedcardholder";
import Card from "framework/entities/card";
import { action, makeObservable, observable, override } from "mobx";
import CardHolder from "framework/entities/cardholder";
import { CarbonCityZeroCard, LinkAbility, Sector, SpecialRule } from "./carbonCityZeroCard";
import gameState from "pages/store";
import { playerStartingDeck } from "pages/cardStore";

export enum Status {
    Regular = 0,
    LandfillDrawnCard,
    LandfillMarketCard,
}

export enum Search {
    None = 0,
    LandfillPile,
    RecyclePile,
    DrawDeck,
    MarketDeckGlobal
}

export default class CarbonCityZeroPlayer extends Player {

    drawDeck: CardHolder<CarbonCityZeroCard>
    drawnCards: CardHolder<CarbonCityZeroCard>
    recyclePile: OrderedCardHolder<CarbonCityZeroCard>
    income: number
    carbon: number
    factoriesIncreaseCarbon: boolean
    status: Status
    buyToTop: boolean
    search: Search

    public constructor(name: string) {
        super(name)
        // const cards = [
        //     //                      name                    co  i   ca  s   sR                                        
        //     new CarbonCityZeroCard("Budget 1",              1,  1,  0,  0),
        //     new CarbonCityZeroCard("Budget 2",              1,  1,  0,  0),
        //     new CarbonCityZeroCard("Budget 3",              1,  1,  0,  0),
        //     new CarbonCityZeroCard("Budget 4",              1,  1,  0,  0),
        //     new CarbonCityZeroCard("Budget 5",              1,  1,  0,  0),
        //     new CarbonCityZeroCard("Global Market 1",       1,  1,  1,  0,  5),
        //     new CarbonCityZeroCard("Global Market 2",       1,  1,  1,  0,  5),
        //     new CarbonCityZeroCard("Poor Housing Stock 1",  0,  0,  1,  4),
        //     new CarbonCityZeroCard("Remote Properties 1",   0,  0,  0,  4),
        // ]
        // this.drawDeck = new CardHolder<CarbonCityZeroCard>(cards) // PLACEHOLDER
        this.drawDeck = playerStartingDeck
        this.drawDeck.shuffle()
        this.drawnCards = new CardHolder<CarbonCityZeroCard>()  // PLACEHOLDER
        this.recyclePile = new OrderedCardHolder<CarbonCityZeroCard>([], (a,b) => 1)  // PLACEHOLDER
        this.income = 0
        this.carbon = 40
        this.factoriesIncreaseCarbon = true
        this.status = Status.Regular
        this.buyToTop = false
        this.search = Search.None
        makeObservable(this, {
            name: override,
            color: override,
            drawDeck: observable,
            drawnCards: observable,
            recyclePile: observable,
            income: observable,
            carbon: observable,
            factoriesIncreaseCarbon: observable,
            status: observable,
            buyToTop: observable,
            search: observable,
            drawCards: action,
            discardAllDrawnCards: action,
            getTotalIncome: observable,
            setColor: action,
            setDrawDeck: action,
            setDrawnCards: action,
            setRecyclePile: action,
            setIncome: action,
            setCarbon: action,
            setFactoriesIncreaseCarbon: action,
            setStatus: action,
            setBuyToTop: action,
            setSearch: action
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
        while (this.drawnCards.size > 0) {
            const card = this.drawnCards.head
            card.setHasActivated(false)
            this.drawnCards.moveCard(card, this.recyclePile)
        }
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
        this.setCarbon(Math.min(49, totalCarbon))
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
        if (cards.some(card => card.specialRule === SpecialRule.AnnulLinkAbilities)) {
            return modifier
        }
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

    // Setters

    public setColor(color: string) {
        this.color = color
    }

    public setDrawDeck(drawDeck: CardHolder<CarbonCityZeroCard>) {
        this.drawDeck = drawDeck
    }

    public setDrawnCards(drawnCards: CardHolder<CarbonCityZeroCard>) {
        this.drawnCards = drawnCards
    }

    public setRecyclePile(recyclePile: OrderedCardHolder<CarbonCityZeroCard>) {
        this.recyclePile = recyclePile
    }
        
    public setIncome(income: number) {
        this.income = income
    }

    public setCarbon(carbon: number) {
        this.carbon = carbon
    }

    public setFactoriesIncreaseCarbon(factoriesIncreaseCarbon: boolean) {
        this.factoriesIncreaseCarbon = factoriesIncreaseCarbon
    }

    public setStatus(status: Status) {
        this.status = status
    }

    public setBuyToTop(buyToTop: boolean) {
        this.buyToTop = buyToTop
    }

    public setSearch(search: Search) {
        this.search = search
    }

}