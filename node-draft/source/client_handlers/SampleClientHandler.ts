import {ArenaNode} from "../graph/ArenaNode"
import {Connection} from "../graph/Connection"
import {WorldManager} from "../graph/WorldManager"
import {ClientHandler} from "./ClientHandler"

// Created when connection comes from headset
class SampleClientHandler implements ClientHandler {
    worldManager: WorldManager
    headset: ArenaNode
    headsetOrigin: ArenaNode
    localTransform: Connection
    handleString: string

    constructor(worldManager: WorldManager) {
        this.handleString = "sample-client"
        this.worldManager = worldManager
        this.headset = new ArenaNode("Headset")
        this.headsetOrigin = new ArenaNode("Headset origin")
        this.localTransform = new Connection(this.headsetOrigin, this.headset, false, true)
    }
    onMessage(data: string) {
        // use string to update localTransform
        this.worldManager.update()
    }
    onConnect() {
        this.worldManager.addNode(this.headset, this.headsetOrigin)
        this.worldManager.addConnection(this.localTransform)
    }
    onDisconnect() {
        this.worldManager.removeNode(this.headset, this.headsetOrigin)
        this.worldManager.removeConnection(this.localTransform)
    }
    sendBroadcast(data) {
        // ws.send(...)
    }
}