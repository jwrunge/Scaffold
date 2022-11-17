import type {websocketSetupOptions} from "../scripts/customTypes"

export default class WS {
    ws: WebSocket
    name?: string
    onInitialConnect?: Function
    onEachConnect?: Function
    onConnectionClose?: Function
    onConnectionError?: Function
    onMessage: Function
    initted: boolean
    wsEndpoint: string
    connectionAttempts: number
    maxConnectionAttempts: number
    logging: boolean
    incomingDataIsJSON?: boolean
    onMessageMiddleware?: Function

    constructor(options: websocketSetupOptions) {
        this.name = options.name || "Unnamed WS"
        this.onInitialConnect = options.onInitialConnect
        this.onEachConnect = options.onEachConnect
        this.onConnectionClose = options.onConnectionClose
        this.onConnectionError = options.onConnectionError
        this.onMessage = options.onMessage
        this.initted = false
        this.wsEndpoint = options.wsEndpoint
        this.connectionAttempts = 0
        this.maxConnectionAttempts = options.maxConnectionAttempts || 5
        this.logging = options.logging || false
        this.incomingDataIsJSON = options.incomingDataIsJSON || true
        this.onMessageMiddleware = options.onMessageMiddleware

        if(options.constructormiddleware) options.constructormiddleware(this) //Any customizations provided as a function

        this.ws = new WebSocket(this.wsEndpoint) //Create WebSocket
    }

    connect() {
        if(this.logging) console.log("Starting up websocket " + this.name)
        this.ws = new WebSocket(this.wsEndpoint)

        //WEBSOCKET OPEN - Run custom connect script
        this.ws.onopen = ()=> {
            if(this.logging) console.log(`${this.name} - websocket OPEN`)

            //Handle custom connection functions
            if(!this.initted && this.onInitialConnect) {
                this.onInitialConnect()
            }
            else if(this.onEachConnect) {
                this.onEachConnect()
            }

            //Reset attempts after 10 minutes
            setTimeout(()=> this.connectionAttempts = 0, 10 * 60 * 1000)
        }

        //WEBSOCKET CLOSE - Run custom close script
        this.ws.onclose = ()=> {
            if(this.logging) console.log(`${this.name} - websocket CLOSED`)
            if(this.onConnectionClose) this.onConnectionClose()
        }

        //WEBSOCKET ERROR
        this.ws.onerror = e=> {
            if(this.logging) console.error(`${this.name} - websocket ERROR`, e)

            //Handle custom error function
            if(this.onConnectionError) this.onConnectionError()

            //Attempt reconnect
            if(this.connectionAttempts < this.maxConnectionAttempts) {
                this.connectionAttempts++
                let recon = 3
                
                if(this.logging) console.log(`Reconnecting to websocket ${this.name} in ${recon}`)

                let countdown = setInterval(()=> {
                    recon -= 1
                    if(recon > 0)
                        if(this.logging) console.log(recon + "...")
                    if(recon === 0) {
                        if(this.logging) console.log("0 - reconnecting")
                        clearInterval(countdown)
                        this.connect()
                    }
                }, 1000)
            }
            else {
                //Error message regardless of logging
                console.log(`%cMaximum WebSocket connection attempts reached. Connection fail on websocket "${this.name}".`, "color: red; font-weight: bold;")
            }
        }

        //WEBSOCKET ONMESSAGE - Handle incoming WS messages
        this.ws.onmessage = e=> {
            let data = e.data
            if(this.onMessageMiddleware) data = this.onMessageMiddleware(data)
            this.onMessage(data)
        }
    }

    send(msg: JSON) {
        this.ws.send(JSON.stringify(msg))
    }

    close() {
        this.ws.close()
    }
}