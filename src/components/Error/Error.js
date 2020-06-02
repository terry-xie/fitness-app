import React from 'react';

const INVALID_INITIAL_BODY_FAT_FORMAT = 'INVALID_INITIAL_BODY_FAT_FORMAT'; 
const INVALID_INITIAL_BODY_WEIGHT_FORMAT = 'INVALID_INITIAL_BODY_WEIGHT_FORMAT';
const INVALID_GOAL_BODY_FAT_FORMAT = 'INVALID_GOAL_BODY_FAT_FORMAT';
const GOAL_BODY_FAT_GREATER_THAN_INITIAL_BODY_FAT = 'GOAL_BODY_FAT_GREATER_THAN_INITIAL_BODY_FAT';

const ErrorTexts = {
    INVALID_INITIAL_BODY_FAT_FORMAT: 'Invalid Current Body Fat %',
    INVALID_INITIAL_BODY_WEIGHT_FORMAT: 'Invalid Current Body Weight',
    INVALID_GOAL_BODY_FAT_FORMAT: 'Invalid Goal Body Fat %',
    GOAL_BODY_FAT_GREATER_THAN_INITIAL_BODY_FAT: 'Goal body fat % is greater than initial body fat %'
};

const Error = React.memo((props) => 
    <div>
        <ul>
            {props.errors.map(error => <li key={error}>{ErrorTexts[error]}</li>)}
        </ul>
    </div>
);

export {
    INVALID_INITIAL_BODY_FAT_FORMAT, 
    INVALID_INITIAL_BODY_WEIGHT_FORMAT, 
    INVALID_GOAL_BODY_FAT_FORMAT,
    GOAL_BODY_FAT_GREATER_THAN_INITIAL_BODY_FAT,
    ErrorTexts,
    Error
}
