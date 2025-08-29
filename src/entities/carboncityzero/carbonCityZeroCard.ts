import Card, { ICard } from "framework/entities/card";
import { makeObservable, observable, action, computed } from "mobx";
import gameState from "pages/store";
import { Status } from "./carbonCityZeroPlayer";

export enum Sector {
    Starter = 0,
    Industry,
    Domestic,
    Government,
    Playtest
}

export enum LinkAbility {
    DecreaseCarbon1 = 1,
    DecreaseCarbon2,
    AnnulFactoryCarbon
}

export enum SpecialRule {
    DrawCard1 = 1,
    DrawCard2,
    AnnulFactoryCarbon,
    LandfillDrawnCard,
    LandfillMarketCard,
    BuyToTop
    // PENDING
    // SearchDrawDeck
    // SearchMarketDeckForGlobal
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

}