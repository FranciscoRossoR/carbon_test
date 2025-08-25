import UniqueGameElement from "./gameElement";

export interface ICard {
    name: string,
    value?: number,
}

export default class Card extends UniqueGameElement implements ICard {
    public constructor (readonly name: string, uid?: string) {
        super(uid);
    }
}