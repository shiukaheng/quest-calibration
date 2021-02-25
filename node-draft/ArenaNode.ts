export class ArenaNode {
    connections = new Set()
    constructor() {

    }
    searchTransformation(destination: ArenaNode): Transformation | null {
        // Use BFS or DFS to search whether it is connected to certain node, and get all valid paths
        var transformations = [] // Get list of transformations to destination, derived from possible paths to destination
        if (transformations.length>0) {
            // Average the list of transformations, then return
        } else {
            return null
        }
    }
}