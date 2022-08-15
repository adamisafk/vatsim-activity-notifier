import axios from "axios"

const vatsimStatusUrl = 'https://status.vatsim.net/status.json'
let vatsimDataUrl = 'https://data.vatsim.net/v3/vatsim-data.json'

export const getAirport = async (icao) => {
    if (/^[A-Z]{4}$/.test(icao) === false) {
        throw new Error('ICAO is invalid')
    }
    
    // Get vatsim data URL
    vatsimDataUrl = await (await axios.get(vatsimStatusUrl)).data.data.v3[0]
    // Get vatsim data
    const vatsimData = await (await axios.get(vatsimDataUrl)).data
    // Search controllers[]
    let results = `${icao} is offline`
    for (const controller of vatsimData.controllers) {
        if(controller.callsign.includes(icao)) {
            results = `${icao} is online`
        }
    }
    return results
}