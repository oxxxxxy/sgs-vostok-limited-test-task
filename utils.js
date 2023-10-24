import _ from 'lodash';
import validator from 'validator';


// TODO: tests
const isEmpty = any => _.isEmpty(any);

const pipeTwo = (f, s) => (...args) => s(f(...args)); //exec func from left to right

const pipeLine = (...args) => //make sequence of funcs
	args.reduce(
		(acc, e, i, a) => {
				if(i){
					if(i === a.length - 1){

						return acc;
					}

					return pipeTwo(acc, a[i + 1]);	
				}else{

					return pipeTwo(e, a[i + 1]);
				}
			}
			,null
		);

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

const parseWorkSchelude = queryObj => {
	if(!queryObj.workSchelude){
		return queryObj;
	}

	let [workFrom, workUntil] = queryObj.workSchelude.split('-');
	delete queryObj.workSchelude;

	workFrom = parseInt(workFrom, 10);
	workUntil = parseInt(workUntil, 10);
							
	if(isNaN(workFrom) || isNaN(workUntil)){
		return queryObj;
	}
	
	queryObj.workFrom = workFrom;
	queryObj.workUntil = workUntil;

	return queryObj;
};

const makeDBQueryFromReqParamQuery = (reqQuery, allowedParameters) => {
	const piped	= pipeLine(
		getQueryParamObjFromReqQuery
		,sanitizeQueryParamObjValues
		,parseWorkSchelude
	);

	return piped(reqQuery, allowedParameters);
};

const compareTwoObjPropValues = (one, two, prop) => one[prop] === two[prop];

const getFnFilterObjsByPropValueAndGetArrOfPropValues = prop =>
	(e, i, a) =>
		i === a.findIndex(
			ae => compareTwoObjPropValues(ae, e, prop)
		) ? e[prop] : false	;



export default {
	isEmpty
	,pipeTwo
	,pipeLine
	,getQueryParamObjFromReqQuery
	,sanitizeQueryParamObjValues
	,parseWorkSchelude
	,makeDBQueryFromReqParamQuery
	,compareTwoObjPropValues
	,getFnFilterObjsByPropValueAndGetArrOfPropValues
}
