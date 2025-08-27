import { FlexProps, Heading, Text, VStack } from "@chakra-ui/react";
import { reaction } from "mobx";
import { observer } from "mobx-react";
import gameState from "pages/store";
import React from "react";

type IHeadingProps = {} & FlexProps;

export default observer(class HeadingPanel extends React.Component<IHeadingProps, {}> {

    public constructor(props: IHeadingProps) {
        super(props);
    }

    public render() {

        const currentPlayer = gameState.currentPlayer

        return (
            <VStack>
                {(gameState.status === "open") ?
                    <>
                        <Heading>Waiting for players</Heading>
                    </>
                : null}
                {(gameState.status === "playing") ?
                    <>
                        <Heading>{currentPlayer.name}</Heading>
                    </>
                : null} 
                {(gameState.status === "finished") ?
                    <>
                        <Heading>Game finished</Heading>
                        <Text>Winner: {gameState.winner?.name}</Text>
                    </>
                : null}
            </VStack>
        )

    }

})

reaction(
    () => gameState.currentPlayer?.carbon ?? Infinity,
    (carbon) => {
        if (carbon <= 0) {
            gameState.setWinner(gameState.currentPlayer)
            gameState.setStatus("finished")
        }
    }
)