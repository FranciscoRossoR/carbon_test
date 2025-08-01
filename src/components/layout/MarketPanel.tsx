import { Badge, Box, Center, FlexProps, HStack } from "@chakra-ui/react";
import { observer } from "mobx-react";
import gameState from "pages/store";
import React from "react";
import Card from 'src/components/PlayingCard'
import CarbonCityZeroPlayer from "src/entities/carboncityzero/carbonCityZeroPlayer";

type ICardsPanelProps = {
} & FlexProps

export default observer(class MarketPanel extends React.Component<ICardsPanelProps, {}> {

    public constructor(props: ICardsPanelProps) {
        super(props)
    }

    public render() {

        const deckSize = gameState.marketDeck.size
        const card = gameState.marketDeck.head

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
                            <Card sx={deckStyle} {...card} />
                            <Badge variant="outline" colorScheme="brand" sx={badgeStyle}>{deckSize}</Badge>
                        </Box>
                    </HStack>
                </Center>
            </Box>
        )

    }

})