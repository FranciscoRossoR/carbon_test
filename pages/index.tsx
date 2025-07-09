import { observer } from "mobx-react"
import Head from "next/head"
import React from "react"

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
            </>
        )
    }

})