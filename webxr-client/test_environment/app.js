var dataDisplay = document.getElementById("dataDisplay")
var addressInput = document.getElementById("address")
var connectButton = document.getElementById("connectButton")

var client

function connectTo(address) {
    if (client !== undefined) {
        client.disconnect()
        console.log(`Disconnected from old address: ${client.serverUrl}`)
    }
    try {
        console
        client = new QuestCalibrationClient.QuestCalibrationWebXRClient(address)
        client.connect().then(()=>{console.log(`Connected to new address: ${client.serverUrl}`); connectButton.disabled = false}).catch((err)=>{console.error(err); connectButton.disabled = false})
        client.addCallback((data)=>{
        dataDisplay.innerText = JSON.stringify(data, null, 2)
        })
    } catch (error) {
        if (error instanceof ReferenceError) {
            dataDisplay.innerText = "QuestCalibrationClient library not in global scope. Perhaps it has not been compiled yet?"
        } else {
            throw error
        }
    }    
}

connectButton.onclick = () => {
    if (address.value === "") {
        connectTo(address.placeholder)
    } else {
        connectTo(address.value)
    }
    connectButton.disabled = true
}

