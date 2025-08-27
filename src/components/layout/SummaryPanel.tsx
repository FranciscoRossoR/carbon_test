import { Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerOverlay, Flex, HStack, position, useDimensions, useDisclosure } from "@chakra-ui/react";
import Player from "framework/entities/player";
import { observer } from "mobx-react";
import gameState from "pages/store";
import React, { RefObject, useRef } from "react";
import PlayerProfile from "../PlayerProfile";
import CarbonCityZeroPlayer from "src/entities/carboncityzero/carbonCityZeroPlayer";

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
                    const ccp = p as CarbonCityZeroPlayer
                    const isCrurrent = true
                    const info = new Map<string, string>()
                    info
                        .set("Carbon", ccp.carbon.toString())
                        .set("Income", ccp.income.toString())
                    return (
                        <PlayerProfile
                            m="10px"
                            key={"PlayerProfile" + ccp.name}
                            name={ccp.name}
                            color={ccp.color}
                            info={info}
                            active={isCrurrent}
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

function onAddPlayer(event: React.MouseEvent<HTMLButtonElement>) {
    // Lorem ipsum
}

function onStart(event: React.MouseEvent<HTMLButtonElement>) {
    gameState.startGame();
}

// interface IDrawerProps {
//     onClose: () => void,
//     isOpen: boolean
// }

// function NewPlayerDrawer(props: IDrawerProps) {
//     const { onClose, isOpen } = props;
//     return (
//         <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
//             <DrawerOverlay/>
//             <DrawerContent>
//                 <DrawerCloseButton/>
//                 <DrawerBody>
//                     Probando
//                 </DrawerBody>
//             </DrawerContent>
//         </Drawer>
//     )
// }