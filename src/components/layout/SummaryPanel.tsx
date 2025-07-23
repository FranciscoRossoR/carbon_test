import { Box, Flex, position, useDimensions } from "@chakra-ui/react";
import { observer } from "mobx-react";
import gameState from "pages/store";
import { useRef } from "react";

export interface IPanelProps {}

export default observer(function SummaryPanel(props: IPanelProps) {

    const boxRef = useRef(null);
    const dimensions = useDimensions(boxRef, true)
    const isMiniVersion = dimensions && dimensions.borderBox.width < 190 * gameState.players.length
    const sticky = {
        position: "sticky",
        width: "full",
        bottom: 0,
    }

    return (
        <Box ref={boxRef} __css={isMiniVersion ? sticky : {}} bgColor="brand.50">
            <Flex bgColor="brand.50" justifyContent="center">
            </Flex>
        </Box>
    )

})