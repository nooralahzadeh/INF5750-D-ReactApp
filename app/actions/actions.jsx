var axios = require('axios');

var actions = require('actions');

var store = require('configureStore').configure();
const config = {
  auth: {
    username: 'admin',
    password: 'district'
  },
  headers: {
        'content-type':'application/json'
      }

}

export var startCounrtyFetch = () => {
  return {
    type: 'START_COUNTRY_FETCH'
  };
};

export var completeCountiresFetch = (data) => {
  return {
    type: 'COMPLETE_COUNTRY_FETCH',
    data
  };
};

export function fetchCountires (url) {
  return function (dispatch) {
    dispatch(startCounrtyFetch());
  axios.get(url).then(function (res) {
       var data=res.data.Data;
       dispatch(completeCountiresFetch(data))
  }, function (res) {
    throw new Error(res.data.message);
  });
  }
};


export var startYearFetch = (country) => {
  return {
    type: 'START_YEAR_FETCH',
    country
  };
};

export var completeYearFetch = (country,data) => {
  return {
    type: 'COMPLETE_YEAR_FETCH',
    country,
    data
  };
};

//const DHS_SURVEY_API_URL='http://api.dhsprogram.com/rest/dhs/v4/surveys';
export function fetchYear (url,country)  {
  return function (dispatch) {
    dispatch(startYearFetch(country));
  var requestUrl = `${url}?countryIds=${country}`;
  axios.get(requestUrl).then(function (res) {
       var data=res.data.Data;
       dispatch(completeYearFetch(country,data))
  }, function (res) {
    throw new Error(res.data.message);
  });
  };
};

export var onSelectCountry = (CountryCode,CounrtyName)=>{
  return {
    type:'SELECT_COUNRTY',
    CountryCode,
    CounrtyName
  };
};

export var onSelectYear = (years) =>{
  return {
    type:'SELECT_YEAR',
    years
  };
};

export var onDeSelectYear = (id) => {
  return {
    type:'DESELECT_YEAR',
    id
  };
};

export var onBackWard = () => {
  return {
    type:'DESELECT_YEAR_ALL',
  };
};

export var onStepChange = (step) => {
    return {
      type:'ON_STEP_CHANGE',
      step
    };
};

export var onSelectCheckBox = (id,checked) => {
    return {
      type:'ON_SELECT_CHECKBOX_CHANGE',
      id,
      checked

    };
};

export var onDeSelectCheckBox = (id,checked) => {
    return {
      type:'ON_DESELECT_CHECKBOX_CHANGE',
      id,
      checked

    };
};

export var onChangeRadioButton = (id) => {
    return {
      type:'ON_CHANGE_RADIO_BUTTON',
      id
    };
};


//extraction part
export var startDHSQuery = () => {
  return {
    type: 'START_DHS_QUERY'
  };
};

export var completeDHSQuery = (data) => {
  return {
    type: 'COMPLETE_DHS_QUERY',
    data
  };
};

export function dhsQuery (url) {

  return function (dispatch) {
    dispatch(startDHSQuery());
  axios.get(url).then(function (res) {
       var data=res.data;
       dispatch(completeDHSQuery(data))
  }, function (res) {
    throw new Error(res.data.message);
  });
  }
};

export var dhsQueryBuilder = (query) => {
  return {
    type: 'DHS_QUERY_BUILDER',
    query
  };
};

export var startDHISGETSQuery = () => {
  return {
    type: 'START_DHIS_GET_QUERY'
  };
};

export var completeDHISGETQuery = (data) => {
  return {
    type: 'COMPLETE_DHIS_GET_QUERY',
    data
  };
};

export function dhisGetQuery (url) {

  return function (dispatch) {
    dispatch(startDHISGETSQuery());
   axios.get(url, config).then(function (res) {
       var data=res.data;
       dispatch(completeDHISGETQuery(data))
  }, function (res) {
    throw new Error(res.data.message);
  });
  }
};

export var onSelectOrgLevel = (level)=>{
  return {
    type:'SELECT_ORG_LEVEL',
    level
  };
};

export var startOrgFetch = () => {
  return {
    type: 'START_ORG_FETCH'
  };
};

export var completeOrgFetch = (data) => {
  return {
    type: 'COMPLETE_ORG_FETCH',
    data
  };
};

//const DHISS_
export function fetchOrgs (url,level)  {
  return function (dispatch) {
    dispatch(startOrgFetch());
  var requestUrl = `${url}?level=${level}&paging=false`;
  axios.get(requestUrl,config).then(function (res) {
       var data=res.data.organisationUnits;
       dispatch(completeOrgFetch(data))
  }, function (res) {
    throw new Error(res.data.message);
  });
  };
};


export var onSelectOrg = (orgs) =>{
  return {
    type:'SELECT_ORG',
    orgs
  };
};

export var onDeSelectOrg = (id) => {
  return {
    type:'DESELECT_ORG',
    id
  };
};

export var onCancelModalSelectedOrg = () => {
  return {
    type:'DESELECT_ORG_ALL',
  };
};

export var onCancelModalorgs = () => {
  return {
    type:'CLEAR_ORG_ALL',
  };
};

export var showModal = () => {
  return {
    type:'SHOW_MODAL'
  };
};

export var hideModal = () => {
  return {
    type:'HIDE_MODAL'
  };
};

export var emptyImportData = () => {
  return {
    type:'EMPTY_IMPORT_DATA'
  };
};


export var startImportToDHIS = () => {
  return {
    type: 'START_IMPORT_TO_DHIS'
  };
};

export var completeImportToDHIS = (data) => {
  return {
    type: 'COMPLETE_IMPORT_TO_DHIS',
    data
  };
};

export function importToDHIS (url,data)  {
  return function (dispatch) {
    dispatch(startImportToDHIS());
   var postUrl = `${url}`;
  var obj = {
	  organisationUnits: [data]
      };

 var importdata=JSON.stringify(obj);

 console.log(importdata)
  axios.post(postUrl,importdata, config).then(function (res) {
       var data=res.data;
       dispatch(completeImportToDHIS(data))
  }, function (res) {
    throw new Error(res.data.message);
  });




  };
};
