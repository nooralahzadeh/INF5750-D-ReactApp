var axios = require('axios');
var moment=require('moment');
var uid = require('uid');
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

//setup actions



//first level: world
export var startOrganizationCreation = () => {
  return {
    type: 'START_ORG_CREATION'
  };
};


export var completeOrganizationCreation = (res,data,level) => {
  return {
    type: 'COMPLETE_ORG_CREATION',
    res,
    data,
    level
  };
};

export function createFirstLevel (url,data,level)  {
  return function (dispatch) {
      dispatch(startOrganizationCreation());
      var obj = {
  	  organisationUnits: [data]
        };


        axios.post(url,JSON.stringify(obj), config).then(function (res) {
               var res=res.data;
               dispatch(completeOrganizationCreation(res,data,level));
               dispatch(setDHISHierarchy(data,level))
          }, function (res) {
            throw new Error(res.data.message);
          });
      }
  };

//second level: region

export var setDHISHierarchy = (data,level) => {
  return {
    type: 'SET_DHIS_HIERARCHY',
    data,
    level
  };
};

export function createSecondLevel (url,level)  {
  return function (dispatch,getState) {
    dispatch(startOrganizationCreation());
        var  state = getState();
        var hierarchy=[];
        var regions=new Set();
        state.data.countires.map(country=>regions.add(country.RegionName));
        for (let region of regions) {
          var SubregionName=new Set();
          state.data.countires.map(
            country=> country.RegionName===region? SubregionName.add(country.SubregionName):''
          )
        var element={
            RegionName:region,
            SubregionName:[...SubregionName]
          };
        hierarchy.push(element);
        };


      //post for region
        var organisationUnits=[];
        hierarchy.map(function(element){
          var region=
                  {
                  "name":element.RegionName,
                  "openingDate":moment().format(),
                  "shortName":element.RegionName,
                  "id":uid(11),
                  "parent":{"id": state.dhisOrg.data.id}
                };
          organisationUnits.push(region);
          dispatch(setDHISHierarchy(region,level));
        });

            var regions={
                organisationUnits:organisationUnits
              };

        axios.post(url,JSON.stringify(regions), config).then(function (res) {
               var res=res.data;
               dispatch(completeOrganizationCreation(res,organisationUnits,level))
          }, function (res) {
            throw new Error(res.data.message);
          });
      }
    };

//get created codes in dhis for regions
export var startRegionFetch = () => {
  return {
    type: 'START_REGION_FETCH',
  };
};

export var completeRegionFetch = (data) => {
  return {
    type: 'COMPLETE_REGION_FETCH',
    data
  };
};

export function fetchRegions (url)  {
  return function (dispatch) {
    dispatch(startRegionFetch());
  axios.get(url, config).then(function (res) {
      var data=res.data;
      dispatch(completeRegionFetch(data))
  }, function (res) {
    throw new Error(res.data.message);
  });
  };
};
//get created codes in dhis for subregions

export var startSubRegionFetch = () => {
  return {
    type: 'START_SUB_REGION_FETCH',
  };
};

export var completeSubRegionFetch = (data) => {
  return {
    type: 'COMPLETE_SUB_REGION_FETCH',
    data
  };
};

export function fetchSubRegions (url)  {
  return function (dispatch,getState) {
    dispatch(startSubRegionFetch());
    var output=[]
    var state=getState();

      var data = [],
          promises = [];

      state.regions.data.organisationUnits.map(function(region){
        var myUrl =`${url}?filter=parent.id:eq:${region.id}&paging=false`;
        promises.push(axios.get(myUrl,config))
      });

      axios.all(promises).then(function(results) {
          results.forEach(function(response) {
            data.push(...response.data.organisationUnits);
          })
          dispatch(completeSubRegionFetch(data));
      });

  };
};



//SubRegions
export function createThirdLevel (url,level)  {
  return function (dispatch,getState) {
       dispatch(startOrganizationCreation());
        var  state = getState();
        var hierarchy=[];
        var regions=new Set();
        state.data.countires.map(country=>regions.add(country.RegionName));
        for (let region of regions) {
          var SubregionName=new Set();

          state.data.countires.map(
            country=> country.RegionName===region? SubregionName.add(country.SubregionName):''
          )
          var regionWithCode=state.dhisHierarchy.data.filter(element=> element.name===region);

          var element={
              RegionName:region,
              RegionCode:regionWithCode[0].id,
              SubregionName:[...SubregionName]
            };
          hierarchy.push(element);
        };
      //post for region
      var organisationUnits=[];
      for (let region of hierarchy) {
        for (let element of region.SubregionName) {
          var subregion=
                  {
                  "name":element,
                  "openingDate":moment().format(),
                  "id":uid(11),
                  "shortName":element,
                  "parent":{"id": region.RegionCode}
                };
          organisationUnits.push(subregion);
          dispatch(setDHISHierarchy(subregion,level));
        }
      };

        var subregions={
                organisationUnits:organisationUnits
              };

        axios.post(url,JSON.stringify(subregions), config).then(function (res) {
               var res=res.data;
               dispatch(completeOrganizationCreation(res,organisationUnits,level))
          }, function (res) {
            throw new Error(res.data.message);
          });
      }
    };
//create 4th level , country
//SubRegions
export function createFourthLevel (url,level)  {
  return function (dispatch,getState) {
       dispatch(startOrganizationCreation());
        var  state = getState();

        var data = [],
          organisationUnits=[],
          promises = [];

        for (let country of state.data.countires){
        //var country=state.data.countires[0];
          var subregion=state.dhisHierarchy.data.filter(element=> element.name===country.SubregionName);

          var element={
            "name":country.CountryName,
            "openingDate":moment().format(),
            "id":uid(11),
            "shortName":country.DHS_CountryCode,
            "parent":{"id": subregion[0].id}
          };
          organisationUnits.push(element);
          dispatch(setDHISHierarchy(element,level));
        };

        var cnt={
                organisationUnits:organisationUnits
              };
      axios.post(url,JSON.stringify(cnt), config).then(function (res) {
             var data=res.data;
            dispatch(completeOrganizationCreation(res,organisationUnits,level))
        }, function (res) {
          throw new Error(res.data.message);
        });
      }
    };



//counrty actions
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


export function fetchAllOrgs (url)  {
  return function (dispatch) {
    dispatch(startOrgFetch());
  var requestUrl = `${url}?paging=false`;
  axios.get(requestUrl,config).then(function (res) {
       var data=res.data.organisationUnits;
       dispatch(completeOrgFetch(data))
  }, function (res) {
    throw new Error(res.data.message);
  });
  };
};

//fetch org based on parent id
export var startLevelFetch = () => {
  return {
    type: 'START_LEVEL_FETCH'
  };
};

export var completeLevelFetch = (data) => {
  return {
    type: 'COMPLETE_LEVEL_FETCH',
    data
  };
};

//const DHISS_
export function fetchLevel (url,level,parent) {
  return function (dispatch) {
    dispatch(startLevelFetch());
  var requestUrl = `${url}?level=${level}&filter=parent.id:eq:${parent}&paging=false`;
  axios.get(requestUrl,config).then(function (res) {
       var data=res.data.organisationUnits;
       dispatch(completeLevelFetch(data))
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
  axios.post(postUrl,importdata, config).then(function (res) {
       var data=res.data;
       dispatch(completeImportToDHIS(data))
  }, function (res) {
    throw new Error(res.data.message);
  });
  };

};

//actiond for uid in dhis
export var startGetIdFormDHIS = () => {
  return {
    type: 'START_GET_ID_DHIS'
  };
};

export var completeGetIdFormDHIS = (data) => {
  return {
    type: 'COMPLETE_GET_ID_DHIS',
    data
  };
};

export function getIdFormDHIS (url)  {
  return function (dispatch) {
    dispatch(startGetIdFormDHIS());

  axios.get(url, config).then(function (res) {
       var data=res.data;
       dispatch(completeGetIdFormDHIS(data))
  }, function (res) {
    throw new Error(res.data.message);
  });
  };
};


//indicator action
export var startIndicatorFetch = () => {
  return {
    type: 'START_INDICATOR_FETCH'
  };
};

export var completeIndicatorFetch = (data) => {
  return {
    type: 'COMPLETE_INDICATOR_FETCH',
    data
  };
};

export function fetchIndicators (url) {
  return function (dispatch) {
    dispatch(startIndicatorFetch());

  axios.get(url).then(function (res) {
       var data=res.data.Data;
       dispatch(completeIndicatorFetch(data))
  }, function (res) {
    throw new Error(res.data.message);
  });
  }
};

//indicator filter action
export var indicatorFilter = (level,data) => {
  return {
    type: 'INDICATOR_FILTER',
    level,
    data
  };
};

//charateristic from dhs to create data elements in dhis

//indicator action
export var startCharacteriticFetch = () => {
  return {
    type: 'START_CHARACTERISTIC_FETCH'
  };
};

export var completeCharacteriticFetch = (data) => {
  return {
    type: 'COMPLETE_CHARACTERISTIC_FETCH',
    data
  };
};

export function fetchCharacteritics (url) {
  return function (dispatch) {
    dispatch(startCharacteriticFetch());

  axios.get(url).then(function (res) {
    debugger;
       var data=res.data.Data;
       dispatch(completeCharacteriticFetch(data))
  }, function (res) {
    console.log(res);
  });
  }
};

//indicator filter action
export var characteristicFilter = (data) => {
  return {
    type: 'CHARACTERISTIC_FILTER',
    data
  };
};
