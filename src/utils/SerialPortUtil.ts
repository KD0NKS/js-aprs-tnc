import _ from 'lodash'
import { SerialPort } from 'serialport'

export class SerialPortUtil {
    static getAvailableSerialPorts() {
        return SerialPort.list()
    }
}