import { TerminalSocket } from '../src/connections/TerminalSocket'
import reader from 'readline'
import { TerminalSettings } from '../src/configurations/TerminalSettings'

reader.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const testSettings: TerminalSettings = new TerminalSettings()
testSettings.autoOpen = false
testSettings.baudRate = 9600
testSettings.callsign = 'N0CALL'
testSettings.dataBits = 8
testSettings.parity = 'none'
testSettings.myCallCommand = 'MYCALL'
testSettings.stopBits = 1
testSettings.exitCommands = ["DIGI OFF", "UIDIGI OFF WIDE1-1", "BEACON EVERY 0", "HID OFF", "CD INTERNAL", "INTFACE TERMINAL", "ECHO ON"]
testSettings.initCommands = ["ECHO OFF", "INTFACE TERMINAL", "CD SOFTWARE", "LFAOFF", "AUTOLF ON", "MONITOR ON", "MCON OFF"
    , "MALL ON", "MCOM OFF", "MXMIT OFF", "BEACON EVERY 0", "BLT EVERY 0", "UIDIGI OFF WIDE1-1", "DIGIPEAT OFF", "UIDWAIT OFF"
    , "PID OFF", "HEADERLN OFF", "PASSALL OFF", "FLOW ON", "HID OFF", "MSTAMP OFF", "NEWMODE OFF", "XFLOW ON", "HBAUD 1200", "ECHO ON"]
testSettings.messageDelimeter = '\r'
testSettings.rtscts = true

const conn = new TerminalSocket('COM5'
    , testSettings
    , (err: any) => {
        if (err)
            return console.log(`error: ${JSON.stringify(err.message)}`)
    })

conn.on('packet', function (data: string) {
    console.log(data)
})

//conn.on('sent', data => {
//    console.log(`TNC send>> ${data}`)
//})

conn.on('error', err => {
    console.log(`error: ${JSON.stringify(err.message)}`)
})

conn.open()

process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        conn.close(() => {
            process.exit()
        })
    }
})

console.log("ctrl + c to quit.")