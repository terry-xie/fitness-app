import axios from 'axios';
import { dataConfig } from './config';
import moment from 'moment';

const WEIGHT_MEASTYPE = 1;
const BODY_FAT_MEASTYPE = 6;
const FAT_MASS_MEASTYPE = 8;
const MUSCLE_MASS_MEASTYPE = 76;
const WATER_WEIGHT_MEASTYPE = 77;

class DataApi {

    static getMeasurements = accessToken => {
        return axios({
            method: 'get',
            url: `${dataConfig.baseURL}/measure`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                action: 'getmeas',
                category: 1,
            }
        }).then((res) => {
            const transformedData = transformData(res.data.body.measuregrps);
            return Promise.resolve(transformedData);
        }).catch(err => {
            console.log(err);
            return Promise.reject(err);
        })
    }
}

const transformData = data => {
    const kgToLbRatio = 2.20462;
    const res = [];
    for(let i=0;i<data.length;i++){
        let muscleMass;
        let weight;
        let bodyFat;
        let fatMass;
        let waterWeight;

        for(let j=0;j<data[i].measures.length;j++){
            const measurement = data[i].measures[j];
            switch(measurement.type){
                case WEIGHT_MEASTYPE:
                    weight = measurement;
                    break;
                case BODY_FAT_MEASTYPE:
                    bodyFat = measurement;
                    break;
                case FAT_MASS_MEASTYPE:
                    fatMass = measurement;
                    break;
                case MUSCLE_MASS_MEASTYPE:
                    muscleMass = measurement;
                    break;
                case WATER_WEIGHT_MEASTYPE:
                    waterWeight = measurement;
                    break;
                default:
                    break;
            }
        }
        res.push({
            date: moment.unix(data[i].date),
            weight: weight ? (weight.value * Math.pow(10,weight.unit) * kgToLbRatio).toFixed(2) : undefined,
            bodyFat: bodyFat ? (bodyFat.value * Math.pow(10,bodyFat.unit)).toFixed(2) : undefined,
            fatMass: fatMass ? (fatMass.value * Math.pow(10,fatMass.unit) * kgToLbRatio).toFixed(2) : undefined,
            muscleMass: muscleMass ? (muscleMass.value * Math.pow(10,muscleMass.unit) * kgToLbRatio).toFixed(2) : undefined,
            waterWeight: waterWeight ? (waterWeight.value * Math.pow(10,waterWeight.unit)).toFixed(2) : undefined
        });
    }
    return res.sort((a,b) => a.date < b.date);
}



/*
{
    grpid,
    attrib,
    date,
    created,
    category,
    deviceid,
    measures: [
        {
            value,
            type,
            unit
        },
        ...
    ],
    more,
    offset
}
*/


export default DataApi;