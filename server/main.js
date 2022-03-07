const net = require("net")
const express = require("express")
const chalk = require("chalk")
const gradient = require("gradient-string")
const chalkAnimation = require("chalk-animation")
import terminalLink from "terminal-link"
const app = express()

const HTTP_PORT = 3000
const SOCKET_PORT = 7777
const SOCKET_HOST = "127.0.0.1"

app.get("/", (req, res) => {
    res.send("Hello World!")
})

var server = net.createServer(function (socket) {
    /* console.log(
        chalk.green(
            `[${chalkAnimation.rainbow(
                `${socket.remoteAddress}:${socket.remotePort}`
            )}] Connected.`
        )
    )
    */
    socket.on("data", (data) => {
        console.log("Received: " + data)
    })
    socket.on("end", socket.end)

    socket.on("error", (err) => {})
})

server.listen(SOCKET_PORT, SOCKET_HOST, () => {
    // console.log(`Example socket listening on port ${SOCKET_PORT}`)
    chalkAnimation.rainbow("HELLO!")
})

app.listen(HTTP_PORT, () => {
    // console.log(`Example app listening on port ${HTTP_PORT}`)
    chalkAnimation.rainbow("HELLO!")
    const link = terminalLink("OPEN", "https://test.com")
})
