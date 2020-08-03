import axios from 'axios';
import { dataConfig } from './config';
import moment from 'moment';

export const WEIGHT_MEASTYPE = 1;
export const BODY_FAT_MEASTYPE = 6;
export const FAT_MASS_MEASTYPE = 8;
export const MUSCLE_MASS_MEASTYPE = 76;
export const WATER_WEIGHT_MEASTYPE = 77;

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

const convertKgToLb = kg => {
    const kgToLbRatio = 2.20462;
    return (kg * kgToLbRatio).toFixed(2);
}

const transformData = data => {
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
            weight: weight ? convertKgToLb(weight.value * Math.pow(10,weight.unit)) : undefined,
            bodyFat: bodyFat ? (bodyFat.value * Math.pow(10,bodyFat.unit)).toFixed(2) : undefined,
            fatMass: fatMass ? convertKgToLb(fatMass.value * Math.pow(10,fatMass.unit)) : undefined,
            muscleMass: muscleMass ? convertKgToLb(muscleMass.value * Math.pow(10,muscleMass.unit)) : undefined,
            waterWeight: waterWeight ? convertKgToLb(waterWeight.value * Math.pow(10,waterWeight.unit)) : undefined
        });
    }
    return res.sort((a,b) => b.date - a.date);
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


export {
    DataApi,
    convertKgToLb,
    transformData
};