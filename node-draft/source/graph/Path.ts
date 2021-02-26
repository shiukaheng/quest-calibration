import {Connection} from "./Connection"
import tsm = require('@kdh/tsm')
import {verifyConnectionChain} from "./Utilities"

/**
 * Container for storing chain of connections, meant to be modified and reused
 */
export class Path {
    private connections: Connection[] // Chain of connections
    constructor(...connections: Connection[]) {
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
        return new Path(...this.connections)
    }
}