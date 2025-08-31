import { Box, Center, FlexProps, Heading, HStack, Spacer } from "@chakra-ui/react";
import { observer } from "mobx-react";
import gameState from "pages/store";
import React from "react";
import PlayingCard from "../PlayingCard";

type ISearchPanelProps = {
} & FlexProps

export default observer(class SearchPanel extends React.Component<ISearchPanelProps, {}> {

    public constructor(props: ISearchPanelProps) {
        super(props)
    }

    public render() {

        return(

            <Box {...this.props} p="1em" bgColor="brand.300">

                <Heading>SEARCH VIEW PLACEHOLDER TITLE</Heading>

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

})