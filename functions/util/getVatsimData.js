import axios from "axios"

const vatsimStatusUrl = 'https://status.vatsim.net/status.json'
let vatsimDataUrl = 'https://data.vatsim.net/v3/vatsim-data.json'

export const getVatsimData = async () => {
    // Get vatsim data URL
    vatsimDataUrl = await (await axios.get(vatsimStatusUrl)).data.data.v3[0]
    // Get vatsim data
    const vatsimData = await (await axios.get(vatsimDataUrl)).data

    return vatsimData
}