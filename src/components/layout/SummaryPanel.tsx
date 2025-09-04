import { Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerOverlay, Flex, HStack, position, useDimensions, useDisclosure } from "@chakra-ui/react";
import Player from "framework/entities/player";
import { observer } from "mobx-react";
import gameState, { callUpdateMarketDeck, callUpdateMarketplace, callUpdatePlayers, callUpdateStatus, callUpdateTurn } from "pages/store";
import React, { RefObject, useRef } from "react";
import PlayerProfile from "../PlayerProfile";
import CarbonCityZeroPlayer from "src/entities/carboncityzero/carbonCityZeroPlayer";
import { autorun, reaction } from "mobx";

export interface IPanelProps {}

export default observer(function SummaryPanel(props: IPanelProps) {

    const boxRef = useRef<HTMLDivElement>(null);
    const dimensions = useDimensions(boxRef as RefObject<HTMLElement>, true);
    const isMiniVersion = dimensions && dimensions.borderBox.width < 190 * gameState.players.length
    const sticky = {
        position: "sticky",
        width: "full",
        bottom: 0,
    }
    // const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box ref={boxRef} __css={isMiniVersion ? sticky : {}} bgColor="brand.50">
            <Flex bgColor="brand.50" justifyContent="center">
                {gameState.players.map((p: Player, index: number) => {
                    const cczp = p as CarbonCityZeroPlayer
                    const isHighlighted =
                        gameState.status === "finished" ?
                            gameState.winner === cczp ?
                                true
                            : false
                        : gameState.turn === index
                    const info = new Map<string, string>()
                    info
                        .set("Carbon", cczp.carbon.toString())
                        .set("Income", cczp.income.toString())
                    return (
                        <PlayerProfile
                            m="10px"
                            key={"PlayerProfile" + cczp.name}
                            name={cczp.name}
                            color={cczp.color}
                            info={info}
                            highlighted={isHighlighted}
                        />
                    )
                })
                }
            </Flex>
            {gameState.status === "open" ?
                <Center>
                    <HStack p="1em" spacing="1em">
                        {!gameState.isMaxPlayersReached ?
                            <>
                                <Button bgColor="brand.500" onClick={(e) => { onAddPlayer(e) }}>
                                    Add player
                                </Button>
                                {/* <NewPlayerDrawer isOpen={isOpen} onClose={onClose} /> */}
                            </>
                        : null}
                        {gameState.enoughPlayers ?
                            <Button bgColor="brand.500" onClick={(e) => { onStart(e) }}>
                                Start
                            </Button>
                        : null}
                    </HStack>
                </Center>
            : null}
        </Box>
    )

})

// Functions

function onAddPlayer(event: React.MouseEvent<HTMLButtonElement>) {
    gameState.addPlayer("Player " + (gameState.players.length + 1))
    callUpdatePlayers(gameState.players)
}

function onStart(event: React.MouseEvent<HTMLButtonElement>) {
    gameState.startGame()
    callUpdateMarketDeck(gameState.marketDeck)
    callUpdateMarketplace(gameState.marketplace)
    callUpdatePlayers(gameState.players)
}

// Reactions

reaction(() => gameState.turn, () => {
    callUpdateTurn(gameState.turn)
})

reaction(() => gameState.status, () => {
    callUpdateStatus(gameState.status)
})