import CardHolder from "framework/entities/cardholder";
import { CarbonCityZeroCard, Sector, SpecialRule } from "src/entities/carboncityzero/carbonCityZeroCard";

    // name                 co  i   ca  sector          sR
const budget = new CarbonCityZeroCard(
    "Budget",               1,  1,  0,  Sector.Starter
)
const globalMarkets = new CarbonCityZeroCard(
    "Global Markets",       1,  1,  1,  Sector.Starter, SpecialRule.LandfillMarketCard
)
const poorHousingStock = new CarbonCityZeroCard(
    "Poor Housing Stock",   0,  0,  1,  Sector.Snag
)
const remoteProperties = new CarbonCityZeroCard(
    "Remote Properties",    0,  0,  0,  Sector.Snag
)

// function addCards(deck: CardHolder<CarbonCityZeroCard>, card: CarbonCityZeroCard, amount: number) {
//     for (let i = 0 ; i < amount ; i ++) {
//         deck.addCard(card)
//     }
// }

let playerStartingDeck = new CardHolder<CarbonCityZeroCard>()
playerStartingDeck.addCards([
    budget,
    budget,
    budget,
    budget,
    budget,
    globalMarkets,
    globalMarkets,
    poorHousingStock,
    remoteProperties
])

export { playerStartingDeck }