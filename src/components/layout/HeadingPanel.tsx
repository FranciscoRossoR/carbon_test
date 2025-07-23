import { FlexProps, Heading, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react";
import gameState from "pages/store";
import React from "react";

type IHeadingProps = {} & FlexProps;

export default observer(class HeadingPanel extends React.Component<IHeadingProps, {}> {

    public constructor(props: IHeadingProps) {
        super(props);
    }

    public render() {

        return (
            <VStack>
                {(gameState.status === "open") ?
                    <>
                        <Heading>Waiting for players</Heading>
                    </> : null}
            </VStack>
        )

    }

})