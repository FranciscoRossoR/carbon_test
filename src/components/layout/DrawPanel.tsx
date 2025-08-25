import { Badge, Box, Button, Center, FlexProps, HStack, Spacer } from "@chakra-ui/react"
import { reaction } from "mobx"
import { observer } from "mobx-react"
import gameState from "pages/store"
import React from "react"
import PlayingCard from 'src/components/PlayingCard'
import CarbonCityZeroPlayer from "src/entities/carboncityzero/carbonCityZeroPlayer"

type IDrawPanelProps = {
} & FlexProps

export default observer (class DrawPanel extends React.Component<IDrawPanelProps, {}> {

    public constructor(props: IDrawPanelProps) {
        super(props)
    }

    public render() {

        // Player
        const currentPlayer = gameState.currentPlayer as CarbonCityZeroPlayer
        // Draw Deck
        const drawDeck = currentPlayer.drawDeck
        const drawDeckSize = drawDeck.size
        const drawDeckCard = drawDeck.head
        // Drawn Cards
        const drawnCards = currentPlayer.drawnCards
        const actions = gameState.availableActions
        // Recycle Pile
        const recyclePile = currentPlayer.recyclePile
        const recyclePileSize = recyclePile.size
        const recyclePileCard = recyclePile.head

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
                            <PlayingCard sx={deckStyle} name={drawDeckCard?.name} cost={drawDeckCard?.cost} income={drawDeckCard?.income} />
                            <Badge variant="outline" colorScheme="brand" sx={badgeStyle}>{drawDeckSize}</Badge>
                        </Box>
                        <Center w='10em'>
                            {action ? <Button key={action.actionName} sx={actionButtonStyle} m="1em" onClick={() => gameState.executeAction(action)}>{action.actionName}</Button> : null}
                        </Center>
                        <HStack p="1em" spacing="0">
                            {drawnCards.cards.map((c, i) => {
                                const handleCardClick = () => {
                                    if (c.hasCardAction) {
                                        c.cardAction?.()
                                        c.setHasCardAction(false)
                                    }
                                }
                                return (
                                    <React.Fragment key={c._uid}>
                                        <Spacer w="1em" />
                                        <PlayingCard name={c.name} cost={c.cost} income={c.income} hasCardActionProps={c.hasCardAction} onClick={handleCardClick} />
                                    </React.Fragment>
                                )
                            })}
                        </HStack>
                        <Box m="1em" position="relative" w={deckWidth}>
                            <PlayingCard sx={deckStyle} name={recyclePileCard?.name} cost={recyclePileCard?.cost} income={recyclePileCard?.income} color="gray.500"/>
                            <Badge variant="outline" colorScheme="brand" sx={badgeStyle}>{recyclePileSize}</Badge>
                        </Box>
                    </HStack>
                </Center>
            </Box>
        )

    }

})

// function safeProps<T extends object>(obj: T): Partial<T> {
//         const entries = Object.entries(obj).filter(
//             ([_, value]) => typeof value !== 'function')
//         return Object.fromEntries(entries) as Partial<T>
//     }

reaction(() => gameState.turn, () => {
    gameState.currentPlayer.drawCards(4)
})