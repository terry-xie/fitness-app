import React from 'react';
import DatePicker from 'react-datepicker';



const Date = (props) => {

    return(
        <DatePicker selected={props.date} onChange={props.dateChange}/>
    )


};


export default Date;