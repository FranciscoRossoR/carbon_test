import GameAction from "framework/entities/gameAction";
import CarbonCityZeroPlayer from "./carbonCityZeroPlayer";
import GameState from "framework/entities/gameState";
import CarbonCityZeroState from "./carbonCityZeroState";

export class PassAction extends GameAction {
    
    private player?: CarbonCityZeroPlayer
    
    public constructor () {
        super("Pass")
    }
    
    public execute(state: CarbonCityZeroState) : CarbonCityZeroState {
        state.currentPlayer.discardAllDrawnCards();
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