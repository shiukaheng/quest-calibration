var dataDisplay = document.createElement("div")
document.body.appendChild(dataDisplay)

var client = new QuestCalibrationClient.QuestCalibrationWebXRClient("dummy")
client.connect()
client.addCallback((data)=>{
    dataDisplay.innerText = JSON.stringify(data)
})