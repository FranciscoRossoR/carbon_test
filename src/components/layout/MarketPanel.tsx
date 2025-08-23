import { Badge, Box, Center, FlexProps, HStack, Spacer } from "@chakra-ui/react";
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
        const marketDeckSize = gameState.marketDeck.size
        const marketDeckHead = gameState.marketDeck.head
        // Marketplace
        const marketplace = gameState.marketplace

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
                            <Card sx={deckStyle} {...marketDeckHead} />
                            <Badge variant="outline" colorScheme="brand" sx={badgeStyle}>{marketDeckSize}</Badge>
                        </Box>
                        <HStack p="1em" spacing="0">
                            {marketplace.cards.map((c, i) => {
                                return (
                                    <React.Fragment key={c._uid}>
                                        <Spacer w="1em" />
                                        <PlayingCard name={c.name} marketCardProps={true} />
                                    </React.Fragment>
                                )
                            })}
                        </HStack>
                    </HStack>
                </Center>
            </Box>
        )

    }

})