import { data, storage } from "@serverless/cloud";

import { getVatsimData } from "../util/getVatsimData"

export const taskCheckAirports = async () => {
    let airportsToSearch = []
    let airportsOnline = []
    let usersToNotify = {}
    const vatsimData = await getVatsimData()


    // Store vatsim data in storage if doesn't exist
    const exists = await storage.exists("previousData.json")
    if (!exists) {
        await storage.write("previousData.json", Buffer.from(JSON.stringify(vatsimData.controllers)))
        console.log("File saved")
    }
    
    // Get last vatsim controllers
    const oldControllers = JSON.parse(await storage.readBuffer("previousData.json"))



    // get all keys (airports)
    let results = await data.get('airports:*')
    for (const item of results.items) {
        airportsToSearch.push(item.key.split(":").pop())
    }
    
    // find each airport in vatsim data
    for (const controller of vatsimData.controllers) {
        for (const airportToSearch of airportsToSearch) {
            if(controller.callsign.includes(airportToSearch)) {
                airportsOnline.push(`airports:${airportToSearch}`)
            }
        }
    }

    for (const key of airportsOnline) {
        usersToNotify[key.split(":").pop()] = [...new Set(await data.get(key))]
    }

    // rewrite old vatsim data with new before return
    await storage.write("previousData.json", Buffer.from(JSON.stringify(vatsimData.controllers)))
    return usersToNotify
}