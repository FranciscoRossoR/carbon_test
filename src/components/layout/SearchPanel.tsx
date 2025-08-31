import { Box, Center, FlexProps, Heading, HStack, Spacer } from "@chakra-ui/react";
import { observer } from "mobx-react";
import gameState from "pages/store";
import React from "react";
import PlayingCard from "../PlayingCard";
import { Search } from "src/entities/carboncityzero/carbonCityZeroPlayer";
import OrderedCardHolder from "framework/entities/orderedcardholder";
import { CarbonCityZeroCard } from "src/entities/carboncityzero/carbonCityZeroCard";

type ISearchPanelProps = {
} & FlexProps

export default observer(class SearchPanel extends React.Component<ISearchPanelProps, {}> {

    public constructor(props: ISearchPanelProps) {
        super(props)
    }

    public render() {

        const player = gameState.currentPlayer
        const playerSearch = player.search
        let searchPile: OrderedCardHolder<CarbonCityZeroCard>
        let searchName: string | undefined
        if (playerSearch == Search.LandfillPile) {
            searchPile = gameState.landfillPile
            searchName = "Landfill Pile"
        } else if (playerSearch == Search.RecyclePile) {
            searchPile = player.recyclePile
            searchName = "Recycle Pile"
        }

        if (playerSearch != Search.None) {
            return(
                <Box {...this.props} p="1em" bgColor="brand.300">
    
                    <Heading>{searchName}</Heading>
    
                    <Center>
                        <HStack p="1em" spacing="0">
                            {gameState.landfillPile.cards.map((c, i) => {   // PLACEHOLDER PILE
                                return (
                                    <React.Fragment key={c._uid}>
                                        <Spacer w="1em" />
                                        <PlayingCard
                                            {...c}
                                        />
                                    </React.Fragment>
                                )
                            })}
                        </HStack>
                    </Center>

                </Box>
            )
        }

    }

})