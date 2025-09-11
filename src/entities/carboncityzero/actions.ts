import GameAction from "framework/entities/gameAction";
import CarbonCityZeroPlayer, { Search } from "./carbonCityZeroPlayer";
import GameState from "framework/entities/gameState";
import CarbonCityZeroState from "./carbonCityZeroState";

export class ReadyAction extends GameAction {

    public constructor() {
        super("Ready")
    }

    public execute(state: CarbonCityZeroState): CarbonCityZeroState {
        return state.getReady()
    }

    // PLACEHOLDER
    public undo(state: GameState): GameState {
        throw new Error("Method not implemented.");
    }

    // PLACEHOLDER  
    public toString(): string {
        return "Ready phase"
    }
    
}

export class BuyAction extends GameAction {

    public constructor() {
        super("Buy")
    }

    public execute(state: CarbonCityZeroState): CarbonCityZeroState {
        return state.goToBuyPhase()
    }

    // PLACEHOLDER
    public undo(state: GameState): GameState {
        throw new Error("Method not implemented.");
    }
    
    // PLACEHOLDER
    public toString(): string {
        return "Buying phase"
    }
    
}

export class PassAction extends GameAction {
    
    private player?: CarbonCityZeroPlayer
    
    public constructor () {
        super("Pass")
    }
    
    public execute(state: CarbonCityZeroState) : CarbonCityZeroState {
        let player = state.currentPlayer
        player.setSearch(Search.None)
        player.setIncome(0)
        player.addDrawnCardsCarbon()
        player.discardAllDrawnCards()
        return state.passTurn()
    }
    
    // PLACEHOLDER
    public undo(state: GameState): GameState {
        throw new Error("Method not implemented.");
    }

    public toString(): string {
        return this.player?.name + " passes."
    }

}