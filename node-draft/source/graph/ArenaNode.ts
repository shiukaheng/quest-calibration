import {Connection} from "./Connection"
import tsm = require('@kdh/tsm')
import {bfsArenaNode} from "./Utilities"

export class ArenaNode {
    private connections: Set<Connection> // List of bi-directional connections with node
    name: string
    constructor(name:string = "Node") {
        this.name = name
        this.connections = new Set()
    }
    searchTransformation(destination: ArenaNode): tsm.mat4 | null {
        // Use BFS or DFS to search whether it is connected to certain node, and get all valid paths
        var transformations = [] // Get list of transformations to destination, derived from possible paths to destination
        if (transformations.length>0) {
            // Average the list of transformations, then return
        } else {
            return null
        }
    }
    get connectedNodes(): ArenaNode[] {
        var nodes = []
        this.connections.forEach((connection)=>{
            nodes.push(connection.spouse(this))
        })
        return nodes
    }
    /***
     * Internal function meant to be called by Connection class
     */
    _addConnection(connection: Connection) {
        var spouse = connection.spouse(this)
        this.connections.forEach((existingConnection)=>{
            if (existingConnection.spouse(this)===spouse) {
                throw "already exists connection of same pairs"
            }
        })
        this.connections.add(connection)
    }
    /***
    * Internal function meant to be called by Connection class
    */
    _removeConnection(connection: Connection) {
        this.connections.delete(connection)
    }
    pathsTo(node: ArenaNode) {
        return bfsArenaNode(this, node)
    }
}