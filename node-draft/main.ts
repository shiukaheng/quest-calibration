import tsm = require('@kdh/tsm')
import Collections = require("typescript-collections")
/**
 * Class that defines a directly observered transformation between two nodes (a.k.a. not inferred from two connected nodes)
 */
class Connection {
    sourceNode: ArenaNode
    destNode: ArenaNode
    dynamic: boolean
    estimated: boolean
    private _transformation: tsm.mat4 | null
    private _inverseTransformation: tsm.mat4 | null
    private _valid: boolean
    /**
     * Create a Connection
     * @param sourceNode - source node of transformation
     * @param destNode - destination node of transformation
     * @param estimated - whether transformation needs to be estimated via hand-eye calibration
     * @param dynamic - whether transformation would change physically
     * @param transformation - 4x4 matrix representing transformation
     */
    constructor(sourceNode: ArenaNode, destNode: ArenaNode, estimated=false, dynamic=true, transformation=new tsm.mat4(
        [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1] // Identity matrix
        )) {
        if (sourceNode===destNode) {
            throw "source and destination cannot be the same"
        }
        this.sourceNode = sourceNode
        this.destNode = destNode
        this._transformation = null
        this._inverseTransformation = null
        this._valid = false
        this.transformation = transformation
        this.estimated = estimated
        this.dynamic = dynamic
    }
    /**
     * Transformation from source to destination node
     */
    get transformation() {
        return this._transformation
    }
    set transformation(matrix: tsm.mat4) {
        if (this._transformation===null) {
            this._transformation = new tsm.mat4().copy(matrix)
        } else {
            this._transformation.copy(matrix)
        }
        if (this._inverseTransformation===null) {
            this._inverseTransformation = new tsm.mat4().copy(matrix).inverse()
        } else {
            this._inverseTransformation.copy(matrix).inverse()
        }
        this.updateValid()
    }
    /**
     * Transformation from destination to source node
     */
    get inverseTransformation() {
        return this._inverseTransformation
    }
    set inverseTransformation(matrix: tsm.mat4) {
        if (this._inverseTransformation===null) {
            this._inverseTransformation = new tsm.mat4().copy(matrix)
        } else {
            this._inverseTransformation.copy(matrix)
        }
        if (this._transformation===null) {
            this._transformation = new tsm.mat4().copy(matrix).inverse()
        } else {
            this._transformation.copy(matrix).inverse()
        }
        this.updateValid()
    }    
    private updateValid() {
        this._valid = (this.transformation === null || this.inverseTransformation === null)
    }
    /**
     * Check whether connection yields bidirectional transformations
     */
    get valid() {
        return this._valid
    }
    /***
     * Swaps source and destination node
     */
    swap() {
        [this.sourceNode, this.destNode] = [this.destNode, this.sourceNode]
        this.transformation = this.inverseTransformation
    }
    includes(node: ArenaNode) {
        return (this.sourceNode===node || this.destNode===node)
    }
    spouse(node: ArenaNode) {
        if (node===this.sourceNode) {
            return this.destNode
        } else if (node===this.destNode) {
            return this.sourceNode
        } else {
            throw "third wheel"
        }
    }
}

function verifyConnectionChain(...connections: Connection[]): boolean {
    if (connections.length > 1) {
        // 1.) If there exists a continuous chain of connections, and 2.) every connection is valid
        if (!this.connections[0].valid) {
            return false
        } 
        for (let i=0; i<=connections.length-2; i++) {
            var connectionA = connections[i]
            var connectionB = connections[i+1]
            if (!(connectionA.sourceNode===connectionB.sourceNode || connectionA.sourceNode===connectionB.destNode || connectionA.destNode===connectionB.sourceNode || connectionA.destNode===connectionB.destNode) && connections[i+1].valid) {
                return false
            }
        }
        return true
    } else if (connections.length === 1) {
        return connections[0].valid
    } else {
        return false
    }
}

/**
 * Container for storing chain of connections, meant to be modified and reused
 */
class Path {
    connections: Connection[] // Chain of connections
    constructor(...connections: Connection[]) {
        this.connections = connections
    }
    checkValid(): boolean {
        // Principle: A path is a valid as long as it produces a transformation bi-directionally
        if (this.connections.length > 1) {
            // 1.) If there exists a continuous chain of connections, and 2.) every connection is valid
            if (!this.connections[0].valid) {
                return false
            } 
            for (let i=0; i<=this.connections.length-2; i++) {
                var connectionA = this.connections[i]
                var connectionB = this.connections[i+1]
                if (!(connectionA.sourceNode===connectionB.sourceNode || connectionA.sourceNode===connectionB.destNode || connectionA.destNode===connectionB.sourceNode || connectionA.destNode===connectionB.destNode) && this.connections[i+1].valid) {
                    return false
                }
            }
            return true
        } else if (this.connections.length === 1) {
            return this.connections[0].valid
        } else {
            return false
        }
    }
    getTransform(): tsm.mat4 {
        throw "Not implemented"
        return
    }
    clone() {
        return new Path(...this.connections)
    }
}

/***
 * Searches for all paths from source node to destination node, todo: maybe 
 */
function bfsArenaNode(sourceNode: ArenaNode, destNode: ArenaNode, maxPaths: number = Infinity): Path[] {
    var visited: Collections.Set<ArenaNode> = new Collections.Set()
    var queue: Collections.Queue<ArenaNode> = new Collections.Queue()
    queue.enqueue(sourceNode)
    visited.add(sourceNode)
    while (!queue.isEmpty()) {
        var node = queue.dequeue()
        node.connectedNodes.forEach((childNode)=>{
            if (!(visited.contains(childNode))) {
                queue.enqueue(childNode)
                visited.add(childNode)
            }
        })
    }
    return
}

class ArenaNode {
    connections: Collections.Set<Connection> // List of bi-directional connections with node
    constructor() {
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
}







/**
 * Container to store everything so it is serializable and can be used across devices
 */
class World {
    constructor() {

    }
}

console.log(tsm)