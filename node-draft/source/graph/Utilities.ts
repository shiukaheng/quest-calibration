import {ArenaNode} from "./ArenaNode"
import {Path} from "./Path"
import {Connection} from "./Connection"
import Collections = require("typescript-collections")

/***
 * Searches for all paths from source node to destination node
 * @todo Test and/or rewrite! This may be an invalid implementation, and even if it is.. this may not be the best algorithm either! Search: Finding all paths from source to destination in an undirected graph.
 */
export function searchPath(sourceNode: ArenaNode, destNode: ArenaNode, maxPaths: number = Infinity): Path[] {
    var visited: Map<ArenaNode, ArenaNode|null> = new Map() 
    // If node exists in map as key, it is explored. 
    // The value is the parent node, but if it is itself, means it is starting node. 
    // If it is null, it is because there are multiple parents, which only happen for the destination node. Used for finding path.
    // But... is it not possible for one node to have two parents?
    var queue: Collections.Queue<ArenaNode> = new Collections.Queue()
    var paths: Path[] = []

    function getPathArguments(destNode: ArenaNode, toDestNode: ArenaNode): [ArenaNode[], Connection[]] {
        var nodes = []
        var connections = []
        var currentNode = toDestNode
        while (visited.get(currentNode)!==currentNode) { // As long as not source node
            var parentNode = visited.get(currentNode)
            nodes.push(currentNode)
            connections.push(currentNode.adjacentConnectionTo(parentNode))
            currentNode = visited.get(currentNode)
        }
        nodes.push(currentNode)
        nodes = nodes.reverse()
        connections = connections.reverse()
        nodes.push(destNode)
        connections.push(destNode.adjacentConnectionTo(toDestNode))
        return [nodes, connections]
    }

    queue.enqueue(sourceNode)
    visited.set(sourceNode, sourceNode)
    visited.set(destNode, null)
    while (!queue.isEmpty()&&(paths.length<maxPaths)) {
        var node = queue.dequeue()
        node.adjacentNodes.forEach((childNode)=>{
            if (childNode===destNode) {
                // Node must be connected to source (since it is accessible from the source) and destination (which is one of its child node)
                paths.push(new Path(...getPathArguments(destNode, node)))
            }
            if (!(visited.has(childNode))) {
                queue.enqueue(childNode)
                visited.set(childNode, node)
            }
        })
    }
    return paths
    // Returned paths could be normal / invalid / estimated
}

export function verifyConnectionChain(...connections: Connection[]): boolean {
    if (connections.length > 1) {
        // 1.) If there exists a continuous chain of connections, and 2.) every connection is valid <-> A path is a valid as long as it produces a transformation bi-directionally
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