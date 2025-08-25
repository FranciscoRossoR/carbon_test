import { border, Box, BoxProps, Heading, Text, ThemingProps, useStyleConfig } from "@chakra-ui/react"
import { mergeWith } from '@chakra-ui/utils';
import { ICarbonCityZeroCard } from "src/entities/carboncityzero/carbonCityZeroCard";


type ICardProps = ICarbonCityZeroCard & ThemingProps & BoxProps & { hasCardActionProps?: boolean } & { marketCardProps? : boolean }

const PlayingCard = (props: ICardProps) => {

    const { name, cost, income, size, variant, sx, onClick, hasCardActionProps, marketCardProps,  ...boxProps } = props

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

    // Cost style
    const costStyle = {
        position: 'absolute',
        right: 0
    }

    // Income Style
    const incomeStyle = {
        position: 'absolute',
        right: 0,
        bottom: 0
    }

    return (
        <Box sx={boxStyle} onClick={onClick} {...boxProps}>
            <Text sx={costStyle}>{cost}</Text>
            <Text sx={textStyle}>{name}</Text>
            <Text sx={incomeStyle}>{income}</Text>
        </Box>
    )

}

export default PlayingCard