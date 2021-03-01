import {ArenaNode} from "../graph/ArenaNode"
import {Connection} from "../graph/Connection"

var questWorldOrigin = new ArenaNode("Quest world origin")
var questOrigin = new ArenaNode("Quest origin")
var questMarker = new ArenaNode("Quest marker")
var tracker = new ArenaNode("Tracker")
var worldAnchor = new ArenaNode("World anchor")

new Connection(worldAnchor, tracker, false, false)
new Connection(tracker, questMarker, false, true)
new Connection(questOrigin, questMarker, true, false)
new Connection(questWorldOrigin, questOrigin, false , true)
new Connection(questWorldOrigin, worldAnchor, true, false)

console.log(questOrigin.pathsTo(worldAnchor))
console.log(tracker.pathsTo(worldAnchor))