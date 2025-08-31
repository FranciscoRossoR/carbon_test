import { Box, Center, FlexProps, Heading, HStack, Spacer } from "@chakra-ui/react";
import { observer } from "mobx-react";
import gameState from "pages/store";
import React from "react";
import PlayingCard from "../PlayingCard";
import { Search } from "src/entities/carboncityzero/carbonCityZeroPlayer";
import OrderedCardHolder from "framework/entities/orderedcardholder";
import { CarbonCityZeroCard } from "src/entities/carboncityzero/carbonCityZeroCard";
import CardHolder from "framework/entities/cardholder";

type ISearchPanelProps = {
} & FlexProps

export default observer(class SearchPanel extends React.Component<ISearchPanelProps, {}> {

    public constructor(props: ISearchPanelProps) {
        super(props)
    }

    public render() {

        const player = gameState.currentPlayer
        const playerSearch = player.search
        let searchPile: CardHolder<CarbonCityZeroCard> | undefined
        let searchName: string | undefined
        switch(playerSearch) {
            case Search.LandfillPile: {
                searchPile = gameState.landfillPile
                searchName = "Landfill Pile"
                break
            }
            case Search.RecyclePile: {
                searchPile = player.recyclePile
                searchName = "Recycle Pile"
                break
            }
            case Search.DrawDeck:  {
                searchPile = player.drawDeck
                searchName = "Draw Deck"
            }
        }

        if (playerSearch != Search.None && searchPile && searchName) {
            return(
                <Box {...this.props} p="1em" bgColor="brand.300">
    
                    <Heading>{searchName}</Heading>
    
                    <Center>
                        <HStack p="1em" spacing="0">
                            {searchPile.cards.map((c, i) => {   // PLACEHOLDER PILE
                                const handleCardClick = () => {
                                    if (player.search == Search.DrawDeck) {
                                        c.playFromDrawDeck()
                                    }
                                }
                                return (
                                    <React.Fragment key={c._uid}>
                                        <Spacer w="1em" />
                                        <PlayingCard
                                            {...c}
                                            interactableCardProps={player.search == Search.DrawDeck}
                                            onClick={handleCardClick}
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