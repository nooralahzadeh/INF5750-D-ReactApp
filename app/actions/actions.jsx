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
      organisationUnitLevels: [{
          "name": "World",
          "level": 1,
          "offlineLevels": 3
          }, {
          "name": "Region",
          "level": 2
          }, {
          "name": "Sub Region",
          "level": 3
          }, {
          "name": "Country",
          "level": 4
          }],
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
                  "code":`${element.RegionName}-${level}`,
                  "id":uid(11),
                  "description":"dhs",
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
                  "description":"dhs",
                  "code":`${element}-${level}`,
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
            "code":country.DHS_CountryCode,
            "description":"dhs",
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
    var data={
      "status":res.response.status,
      "statusText":res.response.statusText
    };
      dispatch(completeCountiresFetch(data))
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
    var data={
      "status":res.response.status,
      "statusText":res.response.statusText
    };
      dispatch(completeDHSQuery(data))
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

export var showFirstModal = () => {
  return {
    type:'SHOW_FIRST_MODAL'
  };
};

export var showSecondModal = () => {
  return {
    type:'SHOW_SECOND_MODAL'
  };
};

export var hideFirstModal = () => {
  return {
    type:'HIDE_FIRST_MODAL'
  };
};
export var hideSecondModal = () => {
  return {
    type:'HIDE_SECOND_MODAL'
  };
};


export var emptyImportData = () => {
  return {
    type:'EMPTY_IMPORT_DATA'
  };
};

export var emptyImportedData = () => {
  return {
    type:'EMPTY_IMPORTED_DATA'
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
  return function (dispatch,getState) {
    dispatch(startImportToDHIS());
    var  state = getState();
    var dataToImport=[];

    for ( let data of state.importData.data){

      var dataSetId=state.availableDataSets.datasets.filter(element=>element.shortName===data.IndicatorId);
      var dataElementId=`${data.ByVariableId}_${data.CharacteristicId}`;

      var dataElelemtExist=state.availableDataElements.dataElements.filter(element=>element.shortName===dataElementId);

      if(dataElelemtExist.length>0 && dataSetId.length>0 && data.Value!==0){

        var period = String(data.SurveyYearLabel).split("-");

        var second=parseInt(period[1], 10);

              if (second >12 || second < 1 || isNaN(second)){
              	  period=period[0]+'01'
                }
             else if(second < 10){
               period=period[0]+"0"+second
            }
            else {
              period=period[0]+second
            }

      var dataValue=
          {
          "dataSet.id":dataSetId[0].id,
           "dataElement": dataElelemtExist[0].id,
           "period": period,
           "orgUnit":data.CountryName,
           "value": data.Value
         };

    dataToImport.push(dataValue);
    }

    }

         var dataValues={
           "dataValues":dataToImport
         };


    // console.log(JSON.stringify(dataValues));


      axios.post(url,JSON.stringify(dataValues), config).then(function (res) {
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
    var data={
      "status":res.response.status,
      "statusText":res.response.statusText
    };
    dispatch(completeIndicatorFetch(data))
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
       var data=res.data.Data;
       dispatch(completeCharacteriticFetch(data))
  }, function (res) {
    var data={
      "status":res.response.status,
      "statusText":res.response.statusText
    };
    dispatch(completeCharacteriticFetch(data))
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

// data element creation in dhis
export var startDataElementCreation = () => {
  return {
    type: 'START_DATAELEMT_CREATION'
  };
};


export var completeDataElementCreation = (res,data) => {
  return {
    type: 'COMPLETE_DATAELEMENT_CREATION',
    res,
    data,
  };
};

// pad the id to be in 11 length
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n.substr(1,width) : new Array(width - n.length + 1).join(z) + n;
};

function removeDuplicates(arr, prop) {
     var new_arr = [];
     var lookup  = {};

     for (var i in arr) {
         lookup[arr[i][prop]] = arr[i];
     }

     for (i in lookup) {
         new_arr.push(lookup[i]);
     }

     return new_arr;
 };


export function createDataElement (url)  {
  return function (dispatch,getState) {
      dispatch(startDataElementCreation());
      var  state = getState();
      var dataElements=[];


      var charactersitics=[];
      for (let indicator of state.dhsDataElementsToDHIS){
        indicator.Characteristics.map(element=>charactersitics.push(element));
      }

      var characteristicsSet=removeDuplicates(charactersitics,'CharacteristicId');

      for(let element of characteristicsSet){


        var dataElement={
            "id":pad(element.CharacteristicId,11),
            "name":element.CharacteristicLabel,
            "shortName": element.CharacteristicId.substr(0,49),
            "code": element.CharacteristicId.substr(0,49),
            "description":"dhs",
            "valueType": "NUMBER",
            "aggregationType": "SUM",
            "domainType": "AGGREGATE",
            "categoryCombo": {
                "id": "p0KPaWEg3cf"
              },
      }
        dataElements.push(dataElement)
      }




      var data_elements =
        {
      "dataElements": dataElements
        };

        axios.post(url,JSON.stringify(data_elements), config).then(function (res) {
               var res=res.data;
               dispatch(completeDataElementCreation(res,dataElements));
          }, function (res) {
            throw new Error(res.data.message);
          });
      }
  };



  // data set creation in dhis
  export var startDataSetCreation = () => {
    return {
      type: 'START_DATASET_CREATION'
    };
  };


  export var completeDataSetCreation = (res,data) => {
    return {
      type: 'COMPLETE_DATASET_CREATION',
      res,
      data,
    };
  };

  export function createDataSet (url)  {
    return function (dispatch,getState) {
        dispatch(startDataSetCreation());
        var  state = getState();
        var dataSets=[]


        for(let element of state.dhsDataElementsToDHIS){
          var indicator=state.dhsIndicators.indicators.filter(ind=>ind.IndicatorId===element.indicator);
        //  var dataSetElements=[];

        //  for (let characteristic of element.Characteristics){
        //        var id=state.dhisDataElements.data.filter(element=>characteristic.CharacteristicId===element.shortName)[0].id;
        //        dataSetElements.push({"id": id});
        //     };


          var dataSet={
              "id":pad(String(indicator[0].IndicatorId).split("_").join(""),11),
              "name":indicator[0].Label,
              "shortName":indicator[0].IndicatorId,
              "code":indicator[0].IndicatorId,
              "description":'dhs',
              "periodType": "Monthly",
              "categoryCombo": {"id": "p0KPaWEg3cf"}
              }

          dataSets.push(dataSet)
        }

        var datasets =
          {
        "dataSets": dataSets
          };

        axios.post(url,JSON.stringify(datasets), config).then(function (res) {
                 var res=res.data;
                 dispatch(completeDataSetCreation(res,dataSets));
            }, function (res) {
              throw new Error(res.data.message);
            });
        }
    };


// data set elemets creation in dhis
    export var startDataSetElemntCreation = () => {
      return {
        type: 'START_DATASET_ELEMENT_CREATION'
      };
    };


    export var completeDataSetElemntCreation = (data) => {
      return {
        type: 'COMPLETE_DATASET_ELEMENT_CREATION',
        //res,
        data,
      };
    };

    export function createDataSetElements (url)  {
      return function (dispatch,getState) {
          dispatch(startDataSetElemntCreation());
          var  state = getState();

          var data=[];
          var promises=[];
          for(let dataset of state.dhisDataSets.data){
            var dataElements=state.dhsDataElementsToDHIS.filter(member=>member.indicator===dataset.shortName)[0].Characteristics;

            for(let dataElement of dataElements){
              var dElement= state.dhisDataElements.data.filter(member=>dataElement.CharacteristicId===member.shortName)[0].id;

              var dataSetElement={
                    "dataElement": {
                    "id": dElement
                    }, "dataSet": {
                    "id": dataset.id
                    }
                  }
              data.push(dataSetElement);
              }
          }

              var dataSetElements={
                  "dataSetElements":data
                }

              axios.post(url,JSON.stringify(dataSetElements), config).then(function (res) {
                        dispatch(completeDataSetElemntCreation(dataSetElements));
                    }, function (res) {
                      console.log(res)
                    });



          }
      };


  //Fetch dataSets from DHIS:
  export var startDataSetFetch = () => {
    return {
      type: 'START_DATASET_FETCH'
    };
  };

  export var completeDataSetFetch = (data) => {
    return {
      type: 'COMPLETE_DATASET_FETCH',
      data
    };
  };

  //const DHISS_
  export function fetchDataSets (url)  {
    return function (dispatch) {
      dispatch(startDataSetFetch());
    axios.get(url,config).then(function (res) {
         var data=res.data.dataSets;
         dispatch(completeDataSetFetch(data))
    }, function (res) {
      throw new Error(res.data.message);
    });
    };
  };

  //Fetch dataElement from DHIS:
  export var startDataElementFetch = () => {
    return {
      type: 'START_DATAELEMENT_FETCH'
    };
  };

  export var completeDataElementFetch = (data) => {
    return {
      type: 'COMPLETE_DATAELEMENT_FETCH',
      data
    };
  };

  //const DHISS_
  export function fetchDataElements (url)  {
    return function (dispatch) {
      dispatch(startDataElementFetch());
    axios.get(url,config).then(function (res) {
         var data=res.data.dataElements;
         dispatch(completeDataElementFetch(data))
    }, function (res) {
      throw new Error(res.data.message);
    });
    };
  };
