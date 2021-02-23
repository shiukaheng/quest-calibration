import Collections = require('typescript-collections');

// Todo: Inject handlers into WebXR API so that QuestCalibrationWebXRClient knows when a XR session has started or ended, so that this information could be relayed to the server.

/**
 * A WebXR client for the Oculus Quest to send device pose to a server via WebSockets API
 */
export class QuestCalibrationWebXRClient {
    serverUrl: string
    private connected: boolean
    private websocket: WebSocket | null
    private interval: number | null // Used for storing interval ID that calls back the sendFrame method regularly
    private callbackFuncs: Collections.Set<Function>

    /***
     * @param serverUrl WebSockets url client connects to
     */
    constructor(serverUrl: string) {
        this.serverUrl = serverUrl
        this.connected = false
        this.websocket = null
        this.interval = null
        this.callbackFuncs = new Collections.Set<Function>()
    }

    /**
     * Connects to server with url specified in serverUrl property
     */
    connect() {
        // Begin debug
        if (this.serverUrl==="dummy") {
            return new Promise((resolve, reject)=>{
                this.connected = true
                this.startSendFrame()
                resolve(null)
            })
        }
        // End debug
        return new Promise((resolve, reject)=>{
            this.websocket = new WebSocket(this.serverUrl)
            this.websocket.onopen = ()=>{
                this.connected = true
                this.startSendFrame()
                resolve(this.websocket)
            }
            this.websocket.onerror = (error)=>{
                this.connected = false
                this.stopSendFrame()
                reject(error)
            }
            this.websocket.onclose = ()=>{
                this.stopSendFrame()
                this.connected = false
            }
        })
    }

    /**
     * Disconnects from currently connected server
     */
    disconnect() {
        // Begin debug
        if (this.serverUrl==="dummy") {
            this.stopSendFrame()
            this.connected = false
            return
        }
        // End debug
        if (this.connected === false) {
            console.warn("Client is not connected but requested for disconnection")
        } else if (this.websocket !== null) {
            console.warn("Client has no initialized WebSocket but requested for disconnection")
        } else if (this.connected && this.websocket !== null) {
            this.websocket.close(1000, "Client requested disconnection")
        }
    }

    /**
     * Sends current pose information to server
     */
    private sendFrame() {
        // Todo: This function should preferably not be called by a loop in this class, but rather whenever the pose is updated. Otherwise, update with the main 3D render loop.
        var data = {
            "time_now": Date.now()
        }
        this.callbackFuncs.forEach((func)=>{
            func(data)
        })
        // Begin debug
        if (this.serverUrl === "dummy") {
            return
        }
        // End debug
        this.websocket.send(JSON.stringify(data))
    }

    /**
     * Sets up an interval to send info every 100 ms, should be changed later on to calling sendFrame() whenever there is new information from the WebXR API
     */
    private startSendFrame() {
        this.interval = window.setInterval(()=>{
            this.sendFrame()
        },
        100)
    }

    /**
     * Stops interval
     */
    private stopSendFrame() {
        clearInterval(this.interval)
    }

    /**
     * Adds a callback function when sendFrame is called
     * @param callback Callback function that takes in data object as argument
     */
    addCallback(callback: (data: Object) => any) {
        this.callbackFuncs.add(callback)
    }

    /**
     * Removes a callback function
     * @param callback Callback function to be removed
     */
    removeCallback(callback: (data: Object) => any) {
        this.callbackFuncs.remove(callback)
    }
}