import Card, { ICard } from "framework/entities/card";
import { makeObservable, observable, action, computed } from "mobx";
import gameState from "pages/store";

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
    LandillPlayedCard,
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
            hasActivated: boolean = false
        ) {
        super(name)
        this.cost = cost
        this.income = income
        this.carbon = carbon
        this.sector = sector
        this.specialRule = specialRule
        this.linkAbility = linkAbility
        this.hasActivated = hasActivated

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
            default :
                alert("ACTION")
                break
        }
        this.setHasActivated(true)
    }

}