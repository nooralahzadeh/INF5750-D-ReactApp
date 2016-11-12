
var axios = require('axios');
var actions = require('actions');
var store = require('configureStore').configure();

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
