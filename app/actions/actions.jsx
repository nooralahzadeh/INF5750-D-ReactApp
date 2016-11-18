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
       var data=res.data.Data;
       dispatch(completeDHSQuery(data))
  }, function (res) {
    throw new Error(res.data.message);
  });
  }
};

// import modal
export var showImportModel = (show) => {
  return {
    type: 'SHOW_IMPORT_MODAL',
    show
  };
};

export var hideImportModel = (show) => {
  return {
    type: 'HIDE_IMPORT_MODAL',
    show
  };
};
