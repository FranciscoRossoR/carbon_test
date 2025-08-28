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

export interface ICarbonCityZeroCard extends ICard {
    cost: number,
    income: number,
    carbon: number,
    sector: Sector,
    linkAbility?: LinkAbility
}

export class CarbonCityZeroCard extends Card {

    cost: number
    income: number
    carbon: number
    sector: Sector
    linkAbility?: LinkAbility
    hasCardAction: boolean
    cardAction?: () => void

    public constructor(
            name: string,
            cost: number = 0,
            income: number = 0,
            carbon: number = 0,
            sector: Sector = Sector.Playtest,
            linkAbility?: LinkAbility,
            hasAction: boolean = false,
            cardAction?: () => void,
        ) {
        super(name)
        this.cost = cost
        this.income = income
        this.carbon = carbon
        this.sector = sector
        this.linkAbility = linkAbility
        this.hasCardAction = hasAction
        if (this.hasCardAction) {this.cardAction = () => {alert("ACTION")}} // PLACEHOLDER

        makeObservable(this, {
            hasCardAction: observable,
            setHasCardAction: action.bound
        })
    }

    public setHasCardAction(value: boolean) {
        this.hasCardAction = value
    }

    public getIsFactory(): boolean {
        return this.sector === Sector.Industry && this.carbon > 0
    }

}