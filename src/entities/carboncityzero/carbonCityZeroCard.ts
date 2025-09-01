import Card, { ICard } from "framework/entities/card";
import { makeObservable, observable, action, computed } from "mobx";
import gameState from "pages/store";
import { Search, Status } from "./carbonCityZeroPlayer";

export enum Sector {
    Starter = 0,
    Industry,
    Domestic,
    Government,
    Snag,
    Global,
    Playtest
}

export enum LinkAbility {
    DecreaseCarbon1 = 1,
    DecreaseCarbon2,
    AnnulFactoryCarbon
}

export enum SpecialRule {
    // Regular Special Rules
    DrawCard1 = 1,
    DrawCard2,
    AnnulFactoryCarbon,
    LandfillDrawnCard,
    LandfillMarketCard,
    BuyToTop,
    SearchDrawDeck,
    SearchMarketDeckForGlobal,
    // Snag Special Rule
    AnnulLinkAbilities,
    // Global Special Rules
    IncreaseMarketplace,
    DecreaseCosts,
    IncreaseDrawnCards
}

export interface ICarbonCityZeroCard extends ICard {
    cost: number,
    income: number,
    carbon: number,
    sector: Sector,
    specialRule?: SpecialRule,
    linkAbility?: LinkAbility
}

export class CarbonCityZeroCard extends Card {

    cost: number
    income: number
    carbon: number
    sector: Sector
    specialRule?: SpecialRule
    linkAbility?: LinkAbility
    hasActivated: boolean

    public constructor(
            name: string,
            cost: number = 0,
            income: number = 0,
            carbon: number = 0,
            sector: Sector = Sector.Playtest,
            specialRule?: SpecialRule,
            linkAbility?: LinkAbility,
        ) {
        super(name)
        this.cost = cost
        this.income = income
        this.carbon = carbon
        this.sector = sector
        this.specialRule = specialRule
        this.linkAbility = linkAbility
        this.hasActivated = false

        makeObservable(this, {
            hasActivated: observable,
            cost: observable,
            setHasActivated: action,
            activate: action
        })
    }

    public setHasActivated(hasActivated: boolean) {
        this.hasActivated = hasActivated
    }

    public getIsFactory(): boolean {
        return this.sector === Sector.Industry && this.carbon > 0
    }

    public activate() {
        let player = gameState.currentPlayer
        switch(this.specialRule) {
            case 1 :
                player.drawCards(1)
                break
            case 2:
                player.drawCards(2)
                break
            case 3:
                player.setFactoriesIncreaseCarbon(false)
                break
            case 4:
                player.setStatus(Status.LandfillDrawnCard)
                break
            case 5:
                player.setStatus(Status.LandfillMarketCard)
                break
            case 6:
                player.setBuyToTop(true)
                break
            case 7:
                player.setSearch(Search.DrawDeck)
                break
            case 8:
                player.setSearch(Search.MarketDeckGlobal)
                break
            default :
                alert("ACTION")
                break
        }
        this.setHasActivated(true)
    }

    public landfillDrawnCard() {
        let player = gameState.currentPlayer
        player.drawnCards.moveCard(this, gameState.landfillPile)
        player.setStatus(Status.Regular)
    }

    public landfillMarketCard() {
        let player = gameState.currentPlayer
        gameState.marketplace.moveCard(this, gameState.landfillPile)
        player.setStatus(Status.Regular)
    }

    public playFromDrawDeck() {
        let player = gameState.currentPlayer
        player.drawDeck.moveCard(this, player.drawnCards)
        player.setSearch(Search.None)
    }

    public playGlobalFromMarketDeck() {
        let player = gameState.currentPlayer
        if (gameState.globalSlot.size > 0) {
            gameState.globalSlot.moveCard(gameState.globalSlot.head, gameState.landfillPile)
        }
        gameState.marketDeck.moveCard(this, gameState.globalSlot)
        player.setSearch(Search.None)
    }

    public getCost(): number {
        return this.cost > 1 &&
            gameState.globalSlot.head.specialRule === SpecialRule.DecreaseCosts ?
            this.cost -1 :
            this.cost
    }

}