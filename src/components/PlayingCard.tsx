import { border, Box, BoxProps, Heading, Text, ThemingProps, useStyleConfig } from "@chakra-ui/react"
import { mergeWith } from '@chakra-ui/utils';
import { ICarbonCityZeroCard, LinkAbility, SpecialRule } from "src/entities/carboncityzero/carbonCityZeroCard";


type ICardProps = Partial<ICarbonCityZeroCard> & ThemingProps & BoxProps & { interactable?: boolean }

const PlayingCard = (props: ICardProps) => {

    const {
        name,
        cost,
        income,
        carbon,
        sector,
        specialRule,
        linkAbility,
        hasActivated,
        size,
        variant,
        sx,
        onClick,
        interactable,
        ...boxProps
    } = props

    // Build the card style from the particular app style (styles), general card style
    const PlayingCardStyle = useStyleConfig('PlayingCard', { size, variant: sector })
    const cardStyle = {
        display: 'block',
        '& > *': { textAlign: 'center' },
        position: 'relative',
        borderRadius: '10px'
    }
    const interactableCardStyle = interactable ? {
        border: '2px solid blue',
        cursor: 'pointer',
        _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'lg'
        }  
    } : {
    }

    const boxStyle = mergeWith({}, PlayingCardStyle, cardStyle, interactableCardStyle, boxProps, sx)

    // Card name style
    const nameStyle = {
        fontSize: 'sm',
        fontWeight: 'bold',
        position: 'absolute',
        top: '20%',
        textAlign: 'center',
        width: '100%'
    }

    // Card special rule style
    const specialRuleStyle = {
        fontSize: 'xs',
        position: 'absolute',
        top: '50%',
        textAlign: 'center',
        width: '100%'
    }

    // Link Ability Style
    const linkAbilityStyle = {
        fontSize: 'xs',
        color: 'white',
        position: 'absolute',
        top: '80%',
        textAlign: 'center',
        width: '100%'
    }

    // Cost style
    const costStyle = {
        fontSize: 'xs',
        position: 'absolute',
        right: 0
    }

    // Income Style
    const incomeStyle = {
        fontSize: 'xs',
        position: 'absolute',
        right: 0,
        bottom: 0
    }

    // Carbon Style
    const carbonStyle = {
        fontSize: 'xs',
        position: 'absolute',
        left: 0,
        bottom:0
    }

    // Sector Style
    const sectorStyle = {
        fontSize: 'xs',
        position: 'absolute',
        left: 0,
        top: 0
    }


    return (
        <Box sx={boxStyle} onClick={onClick} {...boxProps}>
            <Text sx={costStyle}>{cost}</Text>
            <Text sx={nameStyle}>{name}</Text>
            <Text sx={specialRuleStyle}>{SpecialRule.toString(specialRule)}</Text>
            <Text sx={linkAbilityStyle}>{LinkAbility.toString(linkAbility)}</Text>
            <Text sx={incomeStyle}>{income}</Text>
            <Text sx={carbonStyle}>{carbon}</Text>
            <Text sx={sectorStyle}>{sector}</Text>
        </Box>
    )

}

export default PlayingCard


// // DEFAULT EMPTY CARD EXAMPLE

// export const EmptyCard: ICarbonCityZeroCard = {
//   name: "Empty",
//   cost: 0,
//   income: 0,
//   carbon: 0,
//   sector: "",
//   linkAbility: "",
//   _uid: "empty"
// }

// <PlayingCard {...(globalCard ?? EmptyCard)} />