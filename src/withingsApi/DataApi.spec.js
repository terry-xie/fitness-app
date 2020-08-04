import { DataApi, transformData, convertKgToLb,
    WEIGHT_MEASTYPE, 
    BODY_FAT_MEASTYPE, 
    FAT_MASS_MEASTYPE,
    MUSCLE_MASS_MEASTYPE,
    WATER_WEIGHT_MEASTYPE
} from './DataApi';
import axios from 'axios';
import moment from 'moment';

jest.mock('axios');

describe('DataApi', () => {
    describe('convertKgToLb', () => {
        test('should convert kg input to lb', () => {
            const expectedConversion = '22.05';

            expect(convertKgToLb(10)).toEqual(expectedConversion);
        });
    });

    describe('transformData', () => {
        test('should transform data and be sorted by date', () => {
            const earlierUnixDate = 1596153600;
            const laterUnixDate = 1596240000;
            const dataMock = [
                {
                    date: earlierUnixDate,
                    measures: [
                        {
                            type: WEIGHT_MEASTYPE,
                            value: .1,
                            unit: 2
                        },
                        {
                            type: BODY_FAT_MEASTYPE,
                            value: .1,
                            unit: 2
                        },
                        {
                            type: FAT_MASS_MEASTYPE,
                            value: .1,
                            unit: 2,
                        },
                        {
                            type: MUSCLE_MASS_MEASTYPE,
                            value: .1,
                            unit: 2
                        },
                        {
                            type: WATER_WEIGHT_MEASTYPE,
                            value: .1,
                            unit: 2
                        }
                    ]
                },
                {
                    date: laterUnixDate,
                    measures: [
                        {
                            type: WEIGHT_MEASTYPE,
                            value: .1,
                            unit: 2
                        },
                        {
                            type: BODY_FAT_MEASTYPE,
                            value: .1,
                            unit: 2
                        },
                        {
                            type: FAT_MASS_MEASTYPE,
                            value: .1,
                            unit: 2,
                        },
                        {
                            type: MUSCLE_MASS_MEASTYPE,
                            value: .1,
                            unit: 2
                        },
                        {
                            type: WATER_WEIGHT_MEASTYPE,
                            value: .1,
                            unit: 2
                        }
                    ]
                }
            ];

            const expectedData = [
                {
                    date: moment.unix(laterUnixDate),
                    weight: '22.05',
                    bodyFat: '10.00',
                    fatMass: '22.05',
                    muscleMass: '22.05',
                    waterWeight: '22.05'
                },
                {
                    date: moment.unix(earlierUnixDate),
                    weight: '22.05',
                    bodyFat: '10.00',
                    fatMass: '22.05',
                    muscleMass: '22.05',
                    waterWeight: '22.05'
                },
            ];
            
            const result = transformData(dataMock);
            expect(result).toEqual(expectedData);
            expect(result).toHaveLength(2);
            expect((result[0].date).isAfter(result[1].date));
        });
    });

    describe('getMeasurements', () => {
        test('should transform result and resolve it when successful', () => {
            const dataMock = {
                data: {
                    body: {
                        measuregrps: []
                    }
                }
            };
            const expectedData = transformData(dataMock);
            axios.mockResolvedValue(dataMock);

            expect(DataApi.getMeasurements('token')).resolves.toEqual(expectedData);
        });

        test('should reject with error when unsuccessful', () => {
            const errorMock = "error";
            axios.mockRejectedValue(errorMock);

            expect(DataApi.getMeasurements('token')).rejects.toEqual(errorMock);
        });
    });
});