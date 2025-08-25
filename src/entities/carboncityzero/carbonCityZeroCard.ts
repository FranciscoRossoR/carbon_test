import Card from "framework/entities/card";
import { makeObservable, observable, action } from "mobx";

export class CarbonCityZeroCard extends Card {

    hasCardAction: boolean
    cardAction?: () => void
    cost: number

    public constructor(name: string, hasAction: boolean = false, cardAction?: () => void, cost: number = 0) {
        super(name)
        this.hasCardAction = hasAction
        if (this.hasCardAction) {this.cardAction = () => {alert("ACTION")}} // PLACEHOLDER
        this.cost = cost

        makeObservable(this, {
            hasCardAction: observable,
            setHasCardAction: action.bound
        })
    }

    setHasCardAction(value: boolean) {
        this.hasCardAction = value
    }

}