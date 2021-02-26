import {ArenaNode} from "./ArenaNode"
import {Connection} from "./Connection"

export class WorldManager {
    private nodes: Set<ArenaNode>
    private connections: Set<Connection>
    worldAnchor: ArenaNode
    constructor() {
        this.nodes = new Set()
        this.connections = new Set()

        this.worldAnchor = new ArenaNode("World anchor")
        this.addNode(this.worldAnchor)
    }
    update() { // Called when any nodes are added / removed, or when any connections are added / removed / modified
        // For each object, find all possible paths from world anchor to object, can optimize existing BFS based search algorithm for better eficiency => (ArenaNode, Path[])[]
        // Calculate transformations from all objects to world anchor => (ArenaNode, matrix4)
        // Broadcast all matrices to everyone via websockets
    }
    addNode(...nodes:ArenaNode[]) {
        nodes.forEach((node)=>{
            this.nodes.add(node)
        })
    }
    removeNode(...nodes:ArenaNode[]) {
        nodes.forEach((node)=>{
            this.nodes.delete(node)
        })
    }
    addConnection(...connections:Connection[]) {
        connections.forEach((connection)=>{
            this.connections.add(connection)
        })
    }
    removeConnection(...connections:Connection[]) {
        connections.forEach((connection)=>{
            this.connections.delete(connection)
        })
    }
}

// One physical client -> many nodes