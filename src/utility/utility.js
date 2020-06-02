import moment from 'moment';
import format from 'date-fns/format';

export function createDataSet(info){
    let [initialInfo, goalInfo] = info;

    const weightLossRate = 1; //percentage

    const initialBodyFat = parseFloat(initialInfo.bodyFat);
    const initialBodyWeight = parseFloat(initialInfo.bodyWeight);
    const goalBodyFat = parseFloat(goalInfo.bodyFat);
    const goalBodyWeight = parseFloat(goalInfo.bodyWeight);

    const dataset = [];
    
    const leanMass = (100 - initialBodyFat)/100 * initialBodyWeight; //% of lean mass times bodyweight
    //const calculatedGoalWeight = leanMass/((100 - goalBodyFat)/100); //lean mass divided by percentage of goal lean mass %

    let currentBodyWeight = initialBodyWeight;
    let currentBodyFat = initialBodyFat;

    let date = moment();
    while(currentBodyFat >= goalBodyFat){
        dataset.push({date: moment(date).format('MMM D'), bodyFat: currentBodyFat.toFixed(2), bodyWeight: currentBodyWeight.toFixed(2)});
        date.add(1,'w');
        currentBodyWeight = currentBodyWeight * (100-weightLossRate)/100;
        currentBodyFat = ((currentBodyWeight - leanMass)/currentBodyWeight)*100; 
    }
    return dataset;
};

export function createBodyFatGoal(info, rate = 1){
    const {startDate, startBodyFat, startBodyWeight, endDate} = info;

    const data = [];

    let date = moment(startDate,'MM-DD-YYYY');
    let finishDate = moment(endDate, 'MM-DD-YYYY');
    let bodyFat = startBodyFat;
    let bodyWeight = startBodyWeight;
    let fatMass = bodyWeight * (bodyFat/100);

    while(date < finishDate){
        data.push([
            date.format('MM-DD-YYYY'),
            bodyFat
        ]);
        date.add(1,'w');
        fatMass = fatMass - rate;
        bodyWeight = bodyWeight - rate;
        bodyFat = (fatMass/bodyWeight)*100;
    }
    
    return data;
};

export function toFormattedDate(date){
    return format(date, "L/d/yy");
};

export function formatDate(momentDate){
    return momentDate.format("MM-DD-YYYY");
}