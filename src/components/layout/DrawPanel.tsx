import { Badge, Box, Button, Center, FlexProps, HStack, Spacer } from "@chakra-ui/react"
import { reaction } from "mobx"
import { observer } from "mobx-react"
import gameState from "pages/store"
import React from "react"
import Card from 'src/components/PlayingCard'
import CarbonCityZeroPlayer from "src/entities/carboncityzero/carbonCityZeroPlayer"

type IDrawPanelProps = {
} & FlexProps

export default observer (class DrawPanel extends React.Component<IDrawPanelProps, {}> {

    public constructor(props: IDrawPanelProps) {
        super(props)
    }

    public render() {

        const currentPlayer = gameState.currentPlayer as CarbonCityZeroPlayer
        const drawDeck = currentPlayer.drawDeck
        const deckSize = drawDeck.size
        const card = drawDeck.head
        const drawnCards = currentPlayer.drawnCards
        const actions = gameState.availableActions

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

        const actionButtonStyle = {
            bg: 'brand.500',
            _hover: {
                transform: 'translateY(-2px)',
                boxShadow: 'lg'
            }
        }
        const action = actions.find((action) => action.actionName === 'Pass')

        return (
            <Box {...this.props} p="1em">
                <Center>
                    <HStack>
                        <Box m="1em" position="relative" w={deckWidth}>
                            <Card sx={deckStyle} {...card} />
                            <Badge variant="outline" colorScheme="brand" sx={badgeStyle}>{deckSize}</Badge>
                        </Box>
                        <Center w='10em'>
                            {action ? <Button key={action.actionName} sx={actionButtonStyle} m="1em" onClick={() => gameState.executeAction(action)}>{action.actionName}</Button> : null}
                        </Center>
                        <HStack p="1em" spacing="0">
                            {drawnCards.cards.map((c, i) => (
                                <React.Fragment key={c._uid}>
                                    <Spacer w="1em" />
                                    <Card {...c} />
                                </React.Fragment>
                            ))}
                        </HStack>
                    </HStack>
                </Center>
            </Box>
        )

    }

})

reaction(() => gameState.turn, () => {
    console.log("TURN", gameState.turn)
    gameState.currentPlayer.drawDeck.moveCard(
        gameState.currentPlayer.drawDeck.head,
        gameState.currentPlayer.drawnCards)
})