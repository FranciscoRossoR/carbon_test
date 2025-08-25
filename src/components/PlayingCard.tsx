import { border, Box, BoxProps, Heading, ThemingProps, useStyleConfig } from "@chakra-ui/react"
import { mergeWith } from '@chakra-ui/utils';
import { ICard } from "framework/entities/card"


type ICardProps = ICard & ThemingProps & BoxProps & { hasCardActionProps?: boolean } & { marketCardProps? : boolean }

const PlayingCard = (props: ICardProps) => {

    const { name, cost, size, variant, sx, onClick, hasCardActionProps, marketCardProps,  ...boxProps } = props

    // Build the card style from the particular app style (styles), general card style
    const PlayingCardStyle = useStyleConfig('PlayingCard', { size, variant })
    const cardStyle = {
        display: 'block',
        '& > *': { textAlign: 'center' },
        position: 'relative',
        borderRadius: '10px'
    }
    const hasCardActionStyle = hasCardActionProps ? {
        border: '2px solid blue',
        cursor: 'pointer',
        _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'lg'
        }  
    } : {
    }
    const marketCardStyle = marketCardProps ? {
        cursor: 'pointer',
        _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'lg'
        }
    } : {

    }

    const boxStyle = mergeWith({}, PlayingCardStyle, cardStyle, hasCardActionStyle, marketCardStyle, boxProps, sx)

    // Card text style
    const textStyle = {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        textAlign: 'center',
        width: '100%'
    }

    return (
        <Box sx={boxStyle} onClick={onClick} {...boxProps}>
            <Heading sx={textStyle}>{cost}</Heading>
            <Heading sx={textStyle}>{name}</Heading>
        </Box>
    )

}

export default PlayingCard