import Card, { ICard } from "framework/entities/card";
import { makeObservable, observable, action, computed } from "mobx";

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

    public constructor(
            name: string,
            cost: number = 0,
            income: number = 0,
            carbon: number = 0,
            sector: Sector = Sector.Playtest,
            specialRule?: SpecialRule,
            linkAbility?: LinkAbility
        ) {
        super(name)
        this.cost = cost
        this.income = income
        this.carbon = carbon
        this.sector = sector
        this.specialRule = specialRule
        this.linkAbility = linkAbility

        makeObservable(this, {
        })
    }

    public getIsFactory(): boolean {
        return this.sector === Sector.Industry && this.carbon > 0
    }

}