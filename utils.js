import _ from 'lodash';
import validator from 'validator';


// TODO: tests
const isEmpty = any => _.isEmpty(any);

const getQueryParamObjFromReqQuery = (reqQuery, allowedParameters) => 
	allowedParameters.reduce((acc, e) => {
			if(reqQuery[e]){
				acc[e] = reqQuery[e];
			}
			return acc;
		}, {});

const sanitizeQueryParamObjValues = queryObj =>
	(
		(Object.keys(queryObj)).forEach(k =>
				queryObj[k] = validator.escape(queryObj[k])
			)
		,queryObj
	);

const makeDBQueryFromReqParamQuery = (reqQuery, allowedParameters) => 
	sanitizeQueryParamObjValues(
		getQueryParamObjFromReqQuery(reqQuery, allowedParameters)
	);


const compareTwoObjPropValues = (one, two, prop) => one[prop] === two[prop];

const getFnFilterObjsByPropValueAndGetArrOfPropValues = prop =>
	(e, i, a) =>
		i === a.findIndex(
			ae => compareTwoObjPropValues(ae, e, prop)
		) ? e[prop] : false	;



export default {
	isEmpty
	,getQueryParamObjFromReqQuery
	,sanitizeQueryParamObjValues
	,makeDBQueryFromReqParamQuery
	,compareTwoObjPropValues
	,getFnFilterObjsByPropValueAndGetArrOfPropValues
}
