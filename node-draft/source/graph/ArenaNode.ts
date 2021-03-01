import {Connection} from "./Connection"
import tsm = require('@kdh/tsm')
import {searchPath} from "./Utilities"
import util = require("util")

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
    adjacentConnectionTo(destination: ArenaNode) {
        var returnNode: Connection
        this.connections.forEach((connection)=>{
            if (connection.spouse(this)===destination) {
                returnNode = connection
            }
        })
        if (returnNode === undefined) {
            return null
        } else {
            return returnNode
        }
    }
    get adjacentNodes(): ArenaNode[] {
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
        return searchPath(this, node)
    }
    [util.inspect.custom](depth, opts) {
        return `Node(${this.name})`
    }
}