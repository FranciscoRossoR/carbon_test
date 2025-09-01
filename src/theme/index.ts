import { extendTheme, withDefaultColorScheme, theme as base, ColorMode } from "@chakra-ui/react";

const theme = extendTheme({
    colors: {
        brand: {
            50: "#E5FFFC",
            100: "#B8FFF6",
            200: "#8AFFF0",
            300: "#5CFFEB",
            400: "#2EFFE5",
            500: "#00FFDF",
            600: "#00CCB3",
            700: "#009986",
            800: "#006659",
            900: "#00332D"
        },
        cards: {
            100: '#007',
            500: "#CFF",
        }
    },
    fonts: {
        heading: `Ubuntu Condensed, ${base.fonts?.heading}`,
        body: `Ubuntu, ${base.fonts?.heading}`,
    },
    components: {
        PlayingCard: {
            baseStyle: (colorMode: ColorMode) => ({
                borderColor: 'cards.100',
                borderWidth: '1px',
                borderStyle: 'solid',
                color: 'cards.100',
                boxShadow: '0px 0px 10px rgba(0, 0, 0.8, 0.1)',
                h: '100px',
                w: '70px',
            }),
            variants: {
                0: {
                    bg: "pink.100"
                },
                1: {
                    bg: "orange.200"
                },
                2: {
                    bg: "green.200"
                },
                3: {
                    bg: "blue.200"
                },
                4: {
                    bg: "yellow.200"
                },
                5: {
                    bg: "gray.300"
                }
            }
        },
    },

},
    withDefaultColorScheme({
        colorScheme: "brand",
        components: ['Heading', 'Card'],
    })
);

export default theme;