import {Connection} from "./Connection"
import tsm = require('@kdh/tsm')
import {verifyConnectionChain} from "./Utilities"
import {ArenaNode} from "./ArenaNode"
import util = require("util")
/**
 * Container for storing chain of connections, meant to be modified and reused
 */
export class Path {
    private connections: Connection[] // Chain of connections
    private nodes: ArenaNode[]
    constructor(nodes: ArenaNode[], connections: Connection[]) {
        this.nodes = nodes
        this.connections = connections
    }
    checkValid(): boolean {
        return verifyConnectionChain(...this.connections)
    }
    getTransform(): tsm.mat4 {
        throw "Not implemented"
        return
    }
    clone() {
        return new Path(this.nodes, this.connections)
    }
    [util.inspect.custom](depth, opts) {
        var contentString = ""
        if (this.nodes.length >= 2) {
            for (var i=0; i<=this.nodes.length-2; i++) {
                contentString += this.nodes[i].name+" -> "
            }
            contentString += this.nodes[this.nodes.length-1].name
        } else if (this.nodes.length === 1) {
            contentString = this.nodes[0].name
        }
        return `Path(${contentString})`
    }
}