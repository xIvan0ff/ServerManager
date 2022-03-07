const net = require("net")
const fetch = require("node-fetch")
const chalk = require("chalk")
const chalkGradient = require("gradient-string")
const chalkAnimation = require("chalk-animation")
const client = new net.Socket()

let HOST = "127.0.0.1"
let PORT = 7777

fetch("https://raw.githubusercontent.com/xIvan0ff/ServerManager/main/creds.txt")
    .then((res) => res.text())
    .then((text) => {
        if (!text.includes("404")) {
            const splittedData = text.split(":")
            HOST = splittedData[0]
            PORT = splittedData[1]
            console.log(
                chalk.grey(
                    `[${chalk.greenBright(
                        "+"
                    )}] Fetched master data: ${chalk.cyanBright(text)}.`
                )
            )
        } else {
            throw new Error("could not find data")
        }
    })
    .catch((e) => {
        console.log(
            chalk.grey(`[${chalk.redBright("-")}] Failed to fetch master data.`)
        )
        console.log(
            chalk.grey(
                `[${chalk.yellow(
                    "|"
                )}] Using default master data: ${chalk.cyanBright(
                    `${HOST}:${PORT}`
                )}.`
            )
        )
    })
    .then(() => {
        client.connect(PORT, HOST, function () {
            console.log("Connected")
            client.write("servConn")
        })
    })

client.on("data", function (data) {
    console.log("Received: " + data)
})

client.on("close", function () {
    console.log("Connection closed")
})
