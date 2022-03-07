const net = require("net")
const express = require("express")
const chalk = require("chalk")
const chalkGradient = require("gradient-string")
const chalkAnimation = require("chalk-animation")
const terminalLink = require("terminal-link")
const app = express()

const HTTP_PORT = 3000
const SOCKET_PORT = 7777
const SOCKET_HOST = "0.0.0.0"

console.log(
    chalk.italic(
        chalkGradient.fruit(
            "\n\n\n\n                                                      Loading...\n\n\n\n"
        )
    )
)

app.get("/", (req, res) => {
    res.send("Hello World!")
})

var server = net.createServer(function (socket) {
    socket.on("data", (data) => {
        console.log("Received: " + data)
        if (data === "servConn") {
            console.log(
                chalk.greenBright(
                    `[${chalkGradient.rainbow(
                        `${socket.remoteAddress}:${socket.remotePort}`
                    )}] Connected.`
                )
            )
        }
    })
    socket.on("end", socket.end)

    socket.on("error", (err) => {})
})

server.listen(SOCKET_PORT, SOCKET_HOST, () => {
    console.log(
        `${chalk.grey(
            `[${chalkGradient.retro(
                `SOCKET`
            )}] Listening on port ${chalk.magentaBright(SOCKET_PORT)}.`
        )}`
    )
})

app.listen(HTTP_PORT, () => {
    const link = terminalLink("[OPEN]", `http://localhost:${HTTP_PORT}`)
    console.log(
        `${chalk.grey(
            `[${chalkGradient.retro(
                `API`
            )}] Listening on port ${chalk.magentaBright(HTTP_PORT)}. ${link}`
        )}`
    )
})
