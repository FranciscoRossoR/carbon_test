import { Badge, Box, Center, FlexProps, HStack, Spacer } from "@chakra-ui/react";
import { reaction } from "mobx";
import { observer } from "mobx-react";
import gameState from "pages/store";
import React from "react";
import PlayingCard from "src/components/PlayingCard";
import Card from 'src/components/PlayingCard'
import { CarbonCityZeroCard } from "src/entities/carboncityzero/carbonCityZeroCard";

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

        return (
            <Box {...this.props} p="1em">
                <Center>
                    <HStack>
                        <Box m="1em" position="relative" w={deckWidth}>
                            <PlayingCard 
                                sx={deckStyle}
                                name={marketDeckCard?.name}
                                cost={marketDeckCard?.cost}
                                income={marketDeckCard?.income}
                                carbon={marketDeckCard?.carbon}
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
                                const canBeBought = c.cost <= gameState.currentPlayer.income &&
                                    gameState.phase==1
                                const handleCardClick = () => {
                                    if (canBeBought) {
                                        gameState.buyCard(c)
                                    }
                                }
                                return (
                                    <React.Fragment key={c._uid}>
                                        <Spacer w="1em" />
                                        <PlayingCard
                                            name={c.name}
                                            cost={c.cost}
                                            income={c.income}
                                            carbon={c.carbon}
                                            interactableCardProps={canBeBought}
                                            onClick={handleCardClick}
                                        />
                                    </React.Fragment>
                                )
                            })}
                        </HStack>
                        <Box m="1em" position="relative" w={deckWidth}>
                            <PlayingCard
                                sx={deckStyle}
                                name={landfillPileCard?.name} 
                                cost={landfillPileCard?.cost}
                                income={landfillPileCard?.income}
                                carbon={landfillPileCard?.carbon}
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

reaction(() => gameState.marketplace.size, () => {
    gameState.drawCards(gameState.marketSize - gameState.marketplace.size)
})