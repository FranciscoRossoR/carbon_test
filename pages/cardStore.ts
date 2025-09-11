import CardHolder from "framework/entities/cardholder";
import { CarbonCityZeroCard, LinkAbility, Sector, SpecialRule } from "src/entities/carboncityzero/carbonCityZeroCard";

// Create cards
//  co  i   ca  sector              special rule                            link ability
const budget = new CarbonCityZeroCard(
    "Budget",
    1,  1,  0,  Sector.Starter
)
const globalMarkets = new CarbonCityZeroCard(
    "Global Markets",
    1,  1,  1,  Sector.Starter,     SpecialRule.LandfillMarketCard
)
const poorHousingStock = new CarbonCityZeroCard(
    "Poor Housing Stock",
    0,  0,  1,  Sector.Snag
)
const remoteProperties = new CarbonCityZeroCard(
    "Remote Properties",
    0,  0,  0,  Sector.Snag
)
const ecoHouses = new CarbonCityZeroCard(
    "Ecohouses",
    8,  0,  -7, Sector.Domestic,    SpecialRule.DrawCard1  
)
const greenMortgages = new CarbonCityZeroCard(
    "Green Mortgages",
    4,  2,  0,  Sector.Domestic,    SpecialRule.BuyToTop,                   LinkAbility.DecreaseCarbon1 
)
const publicAwareness = new CarbonCityZeroCard(
    "Public Awareness",
    2,  0,  -2, Sector.Domestic,    undefined,                              LinkAbility.DecreaseCarbon1
)
const retrofitBuildings = new CarbonCityZeroCard(
    "Retrofit Buildings",
    3,  0,  -2, Sector.Domestic,    SpecialRule.DrawCard1,                  LinkAbility.DecreaseCarbon1
)
const solarThermalPanels = new CarbonCityZeroCard(
    "Solar Thermal Panels",
    7,  0,  -5, Sector.Domestic,    SpecialRule.DrawCard1
)
const windPower = new CarbonCityZeroCard(
    "Wind Power",
    5,  0,  -4, Sector.Domestic,    SpecialRule.LandfillDrawnCard,          LinkAbility.DecreaseCarbon1
)
const biogasPlant = new CarbonCityZeroCard(
    "Biogas Plant",
    6,  0,  -5, Sector.Government,  SpecialRule.LandfillDrawnCard
)
const buildingInspectors = new CarbonCityZeroCard(
    "Building Inspectors",
    3,  0,  0,  Sector.Government,  SpecialRule.SearchDrawDeck
)
const districtHeating = new CarbonCityZeroCard(
    "District Heating",
    4,  1,  -2, Sector.Government,  SpecialRule.AnnulFactoryCarbon
)
const ecoCouncillors = new CarbonCityZeroCard(
    "Eco Councillors",
    6,  0,  -4, Sector.Government,  SpecialRule.SearchMarketDeckForGlobal,  LinkAbility.DecreaseCarbon2
)
const hydrogenGasMains = new CarbonCityZeroCard(
    "Hydrogen Gas Mains",
    5,  0,  0,  Sector.Government,  SpecialRule.LandfillDrawnCard,          LinkAbility.DecreaseCarbon2
)
const hydropower = new CarbonCityZeroCard(
    "Hydropower",
    3,  0,  -2, Sector.Government,  SpecialRule.LandfillDrawnCard,          LinkAbility.DecreaseCarbon2
)
const lobbyMinisters = new CarbonCityZeroCard(
    "Lobby Ministers",
    7,  0,  -6, Sector.Government,  SpecialRule.DrawCard2,                  LinkAbility.DecreaseCarbon2
)
const heatPumps = new CarbonCityZeroCard(
    "Heat Pumps",
    7,  0,  -5, Sector.Industry,    SpecialRule.DrawCard1,                  LinkAbility.AnnulFactoryCarbon
)
const largeFactory = new CarbonCityZeroCard(
    "Large Factory",
    3,  5,  4,  Sector.Industry,    SpecialRule.DrawCard2
)
const lowCarbonTech = new CarbonCityZeroCard(
    "Low Carbon Tech",
    8,  0,  -5, Sector.Industry,    SpecialRule.DrawCard2,                  LinkAbility.AnnulFactoryCarbon
)
const medimFactory = new CarbonCityZeroCard(
    "Medium Factory",
    2,  4,  3,  Sector.Industry,    SpecialRule.DrawCard1
)
const netZeroHub = new CarbonCityZeroCard(
    "Net Zero Hub",
    5,  4,  0,  Sector.Industry,    SpecialRule.DrawCard1
)
const skilledWorkforce = new CarbonCityZeroCard(
    "Skilled Workforce",
    6,  3,  0,  Sector.Industry,    SpecialRule.DrawCard2,                  LinkAbility.AnnulFactoryCarbon
)
const smallFactory = new CarbonCityZeroCard(
    "Small Factory",
    1,  3,  1,  Sector.Industry
)
const badPress = new CarbonCityZeroCard(
    "Bad Press",
    0,  0,  1,  Sector.Snag
)
const dodgyStandards = new CarbonCityZeroCard(
    "Dodgy Standards",
    0,  0,  0,  Sector.Snag
)
const fossilFuelLobby = new CarbonCityZeroCard(
    "Fossil Fuel Lobby",
    0,  0,  1,  Sector.Snag
)
const fundingCuts = new CarbonCityZeroCard(
    "Funding Cuts",
    0,  -1, 0,  Sector.Snag
)
const governmentUncertainty = new CarbonCityZeroCard(
    "Government Uncertainty",
    0,  0,  1,  Sector.Snag
)
const localOppositon = new CarbonCityZeroCard(
    "Local Opposition",
    0,  0,  0,  Sector.Snag,        SpecialRule.AnnulLinkAbilities
)
const poorCommunication = new CarbonCityZeroCard(
    "Poor Communication",
    0,  0,  0,  Sector.Snag
)
const poorLeadership = new CarbonCityZeroCard(
    "Poor Leadership",
    0,  0,  0,  Sector.Snag
)
const publicApathy = new CarbonCityZeroCard(
    "Public Apathy",
    0,  0,  0,  Sector.Snag
)
const behaviouralChange = new CarbonCityZeroCard(
    "Behavioural Change",
    0,  0,  0,  Sector.Global,      SpecialRule.IncreaseMarketplace
)
const increasedFunding = new CarbonCityZeroCard(
    "IncreasedFunding",
    0,  0,  0,  Sector.Global,      SpecialRule.DecreaseCosts
)
const newBuildingRegulations = new CarbonCityZeroCard(
    "New Building Regulations",
    0,  0,  0,  Sector.Global,      SpecialRule.IncreaseDrawnCards
)
//TEST FUNDIGN CUTS

// Create Player Starting Deck
const playerStartingDeck = new CardHolder<CarbonCityZeroCard>()
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

// Create Game Starting Deck
const gameStartingDeck = new CardHolder<CarbonCityZeroCard>() 
gameStartingDeck.addCards([
    ecoHouses,
    greenMortgages,
    greenMortgages,
    greenMortgages,
    publicAwareness,
    publicAwareness,
    publicAwareness,
    retrofitBuildings,
    retrofitBuildings,
    retrofitBuildings,
    solarThermalPanels,
    solarThermalPanels,
    windPower,
    windPower,
    windPower,
    biogasPlant,
    biogasPlant,
    buildingInspectors,
    buildingInspectors,
    districtHeating,
    districtHeating,
    districtHeating,
    ecoCouncillors,
    hydrogenGasMains,
    hydrogenGasMains,
    hydrogenGasMains,
    hydropower,
    hydropower,
    hydropower,
    lobbyMinisters,
    heatPumps,
    largeFactory,
    largeFactory,
    lowCarbonTech,
    medimFactory,
    medimFactory,
    medimFactory,
    netZeroHub,
    netZeroHub,
    skilledWorkforce,
    smallFactory,
    smallFactory,
    smallFactory,
    smallFactory,
    smallFactory,
    badPress,
    dodgyStandards,
    fossilFuelLobby,
    fundingCuts,
    governmentUncertainty,
    localOppositon,
    poorCommunication,
    poorLeadership,
    publicApathy,
    behaviouralChange,
    behaviouralChange,
    increasedFunding,
    increasedFunding,
    newBuildingRegulations,
    newBuildingRegulations
])

// Export Starting Decks
export { playerStartingDeck, gameStartingDeck }