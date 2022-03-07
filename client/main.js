const net = require("net")
const client = new net.Socket()

const HOST = "127.0.0.1"
const PORT = 7777

client.connect(PORT, HOST, function () {
    console.log("Connected")
})

client.on("data", function (data) {
    console.log("Received: " + data)
})

client.on("close", function () {
    console.log("Connection closed")
})
