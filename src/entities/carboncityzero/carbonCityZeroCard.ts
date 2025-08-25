import Card, { ICard } from "framework/entities/card";
import { makeObservable, observable, action } from "mobx";

export interface ICarbonCityZeroCard extends ICard {
    cost: number,
    income: number,
}

export class CarbonCityZeroCard extends Card {

    hasCardAction: boolean
    cardAction?: () => void
    cost: number
    income: number

    public constructor(name: string, hasAction: boolean = false, cardAction?: () => void, cost: number = 0, income: number = 0) {
        super(name)
        this.hasCardAction = hasAction
        if (this.hasCardAction) {this.cardAction = () => {alert("ACTION")}} // PLACEHOLDER
        this.cost = cost
        this.income = income

        makeObservable(this, {
            hasCardAction: observable,
            setHasCardAction: action.bound
        })
    }

    setHasCardAction(value: boolean) {
        this.hasCardAction = value
    }

}