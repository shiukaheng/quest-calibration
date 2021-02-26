import {ArenaNode} from "./ArenaNode"
import tsm = require('@kdh/tsm')

/**
 * Class that defines a directly observered transformation between two nodes (a.k.a. not inferred from two connected nodes)
 */
export class Connection {
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
    constructor(sourceNode: ArenaNode, destNode: ArenaNode, estimated=false, dynamic=true, transformation:tsm.mat4|null=null) {
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
        this.addSelfToNodes() // Not sure if this should be called here, or later by the world manager
    }
    /**
     * Transformation from source to destination node
     */
    get transformation() {
        return this._transformation
    }
    set transformation(matrix: tsm.mat4|null) {
        if (matrix===null) {
            this._transformation = null
            this._inverseTransformation = null
        } else {
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
        }
        this.updateValid()
    }
    /**
     * Transformation from destination to source node
     */
    get inverseTransformation() {
        return this._inverseTransformation
    }
    set inverseTransformation(matrix: tsm.mat4|null) {
        if (matrix===null) {
            this._inverseTransformation = null
            this._transformation = null
        } else {
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
        }
        this.updateValid()
    }    
    private updateValid() {
        this._valid = !(this.transformation === null || this.inverseTransformation === null)
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
    private addSelfToNodes() {
        this.sourceNode._addConnection(this)
        this.destNode._addConnection(this)
    }
    private removeSelfFromNodes() {
        this.sourceNode._removeConnection(this)
        this.destNode._removeConnection(this)
    }
    destroy() {
        this.removeSelfFromNodes()
    }
}