import {http} from '../utils/http.js'

const HF_API = {
    normal: 'https://free-api.heweather.com/s6/weather',
    hour: 'https://free-api.heweather.com/s6/weather/hourly',
    key: '76ff10b3d9bf46a98a85395b44c9b6cf'
};

module.exports = {
    normalWeather(param){
        return http({
            url: HF_API.normal,
            data: { key: HF_API.key, ...param },
        })
    },
    hourWeather(param){
        return http({
            url: HF_API.hour,
            data: { key: HF_API.key, ...param },
        })
    }
}