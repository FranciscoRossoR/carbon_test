import Card, { ICard } from "framework/entities/card";
import { makeObservable, observable, action } from "mobx";

export enum Sector {
    Starter = 0,
    Industry,
    Domestic,
    Government,
    Playtest
}

export interface ICarbonCityZeroCard extends ICard {
    cost: number,
    income: number,
    carbon: number,
    sector: Sector
}

export class CarbonCityZeroCard extends Card {

    cost: number
    income: number
    carbon: number
    sector: Sector
    hasCardAction: boolean
    cardAction?: () => void

    public constructor(
            name: string,
            cost: number = 0,
            income: number = 0,
            carbon: number = 0,
            sector: Sector = Sector.Playtest,
            hasAction: boolean = false,
            cardAction?: () => void
        ) {
        super(name)
        this.cost = cost
        this.income = income
        this.carbon = carbon
        this.sector = sector
        this.hasCardAction = hasAction
        if (this.hasCardAction) {this.cardAction = () => {alert("ACTION")}} // PLACEHOLDER

        makeObservable(this, {
            hasCardAction: observable,
            setHasCardAction: action.bound
        })
    }

    setHasCardAction(value: boolean) {
        this.hasCardAction = value
    }

}