import { Badge, Box, Center, FlexProps, HStack, Spacer } from "@chakra-ui/react";
import { autorun, reaction } from "mobx";
import { observer } from "mobx-react";
import gameState from "pages/store";
import React from "react";
import PlayingCard from "src/components/PlayingCard";
import Card from 'src/components/PlayingCard'
import { CarbonCityZeroCard, SpecialRule } from "src/entities/carboncityzero/carbonCityZeroCard";
import { Search, Status } from "src/entities/carboncityzero/carbonCityZeroPlayer";

type IMarketPanelProps = {
} & FlexProps

export default observer(class MarketPanel extends React.Component<IMarketPanelProps, {}> {

    public constructor(props: IMarketPanelProps) {
        super(props)
    }

    public render() {

        // Market Deck
        const marketDeck = gameState.marketDeck
        const marketDeckSize = marketDeck.size
        const marketDeckCard = marketDeck.head
        // Marketplace
        const marketplace = gameState.marketplace
        // Landfill Pile
        const landfillPile = gameState.landfillPile
        const landfillPileSize = landfillPile.size
        const landfillPileCard = landfillPile.head
        // Global Card
        const globalCard = gameState.globalSlot.head

        const deckWidth = '70px'
        const deckStyle = {
            borderBottom: '5px double',
            borderRight: '5px double',
            width: deckWidth
        }

        const badgeStyle = {
            borderRadius: '50%',
            w: '2.5em',
            lineHeight: '2.5em',
            textAlign: 'center',
            position: 'absolute',
            bottom: '-1.25em',
            backgroundColor: '#fff',
            right: '-1.25em'
        }

        const player = gameState.currentPlayer

        const handleLandfillPileClick = () => {
            player.search == Search.LandfillPile ?
                player.setSearch(Search.None) :
                player.setSearch(Search.LandfillPile)
        }

        return (
            <Box {...this.props} p="1em">
                <Center>
                    <HStack>
                        <PlayingCard
                            {...globalCard}
                        />
                        <Box m="1em" position="relative" w={deckWidth}>
                            <PlayingCard 
                                sx={deckStyle}
                                {...marketDeckCard}
                            />
                            <Badge
                                variant="outline"
                                colorScheme="brand"
                                sx={badgeStyle}>
                                    {marketDeckSize}
                            </Badge>
                        </Box>
                        <HStack p="1em" spacing="0">
                            {marketplace.cards.map((c, i) => {
                                const canBeBought =
                                (
                                    c.getCost() <= player.income &&
                                    gameState.phase==1
                                ) ||
                                player.status === Status.LandfillMarketCard
                                const handleCardClick = () => {
                                    if (canBeBought) {
                                        if (player.status === Status.LandfillMarketCard) {
                                            c.landfillMarketCard()
                                        } else {
                                            gameState.buyCard(c)
                                        }
                                    }
                                }
                                return (
                                    <React.Fragment key={c._uid}>
                                        <Spacer w="1em" />
                                        <PlayingCard
                                            {...c}
                                            interactable={canBeBought}
                                            onClick={handleCardClick}
                                        />
                                    </React.Fragment>
                                )
                            })}
                        </HStack>
                            <Box
                                m="1em"
                                position="relative"
                                w={deckWidth}
                                onClick={handleLandfillPileClick}
                                cursor="pointer"
                                _hover={{
                                    transform: 'translateY(-2px)',
                                    boxShadow: 'lg'
                                }}
                            >
                                <PlayingCard
                                    sx={deckStyle}
                                    {...landfillPileCard}
                                    color="gray.500" />
                                <Badge
                                    variant="outline"
                                    colorScheme="brand"
                                    sx={badgeStyle}>
                                        {landfillPileSize}
                                </Badge>
                            </Box>
                    </HStack>
                </Center>
            </Box>
        )

    }

})

// reaction(() => gameState.marketplace.size, () => {
//     gameState.drawCards(gameState.marketSize - gameState.marketplace.size)
// })

autorun(() => {
    if (!gameState.currentPlayer || gameState.status !== "playing") return
    const gap = gameState.marketSize - gameState.marketplace.size
    if (gap > 0) {
        gameState.drawCards(gap)
    }
})

reaction(() => gameState.globalSlot.head, () => {
    const globalCard = gameState.globalSlot.head
    if (globalCard.specialRule === SpecialRule.IncreaseMarketplace) {
        gameState.setMarketSize(6)
    } else {
        gameState.setMarketSize(5)
    }
})

reaction(() => gameState.globalSlot.head, () => {
    const globalCard = gameState.globalSlot.head
    if (globalCard.specialRule === SpecialRule.IncreaseDrawnCards) {
        gameState.setPlayerDrawAmount(6)
    } else {
        gameState.setPlayerDrawAmount(5)
    }
})