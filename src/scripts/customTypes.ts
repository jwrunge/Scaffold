export type containerControl = {
    name: string,
    icon: string,
    dispatchMsg: string
}

export type websocketSetupOptions = {
    name?: string,
    wsEndpoint: string,
    onInitialConnect?: Function,
    onEachConnect?: Function,
    onConnectionClose?: Function,
    onConnectionError?: Function,
    onMessage: Function,
    constructormiddleware?: Function,
    maxConnectionAttempts?: number,
    logging?: boolean,
    incomingDataIsJSON?: boolean,
    onMessageMiddleware?: Function
}