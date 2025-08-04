import Card from "framework/entities/card";
import { makeObservable, observable, action } from "mobx";

export class CarbonCityZeroCard extends Card {

    hasCardAction: boolean
    cardAction?: () => void

    public constructor(name: string, hasAction: boolean = false, cardAction?: () => void) {
        super(name)
        this.hasCardAction = hasAction
        // PLACEHOLDER
        if (this.hasCardAction) {this.cardAction = () => {alert("ACTION")}}

        makeObservable(this, {
            hasCardAction: observable,
            setHasCardAction: action.bound
        })
    }

    setHasCardAction(value: boolean) {
        this.hasCardAction = value
    }

}