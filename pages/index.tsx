import { observer } from "mobx-react"
import Head from "next/head"
import React from "react"

import gameState from 'pages/store'
import { Flex } from "@chakra-ui/react"
import HeadingPanel from "src/components/layout/HeadingPanel"

export default observer(class Play extends React.Component<{}, {}> {

    public constructor(props: {}) {
        super(props)
    }

    public render() {
        return (
            <>
                <Head>
                    <title>Carbon City Zero</title>
                    <meta name="description" content="Carbon City Zero" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <HeadingPanel flex="1 1 100%" />
            </>
        )
    }

})