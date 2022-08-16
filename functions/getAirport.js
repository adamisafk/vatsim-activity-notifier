import { getVatsimData } from "./util/getVatsimData"

export const getAirport = async (icao) => {
    // Get vatsim data
    const vatsimData = await getVatsimData()

    // Search controllers[]
    let results = `${icao} is offline!`
    for (const controller of vatsimData.controllers) {
        if(controller.callsign.includes(icao)) {
            results = `${icao} is online!`
        }
    }
    return results
}