var React=require('react');
var ReactDom = require('react-dom');
var uid= require('uid');
var {connect} = require('react-redux');
var actions = require('actions');
const dhis='http://localhost:8082';
const DHIS_POST_URL=`${dhis}/api/metadata`;
const DHIS_ID_API_URL=`${dhis}/api/system/id`;
const DHS_COUNTRY_API_URL='http://api.dhsprogram.com/rest/dhs/countries';
const DHIS_API_URL_ORG=`${dhis}/api/organisationUnits.json`;
const DHS_INDICATOR_API_URL='http://api.dhsprogram.com/rest/dhs/indicators';
const DHS_DATA_API_URL='http://api.dhsprogram.com/rest/dhs/data';
const DHIS_POST_DATASETELEMENT_URL=`${dhis}/api/dataSetElements`;
const PAGES_FORM_DHS=2;
var axios = require('axios');
export var Setup=React.createClass({


orgFirstHandler:function(btn){

    var{dispatch}=this.props;

    var world={
        "name": "World",
        "openingDate": "1900-01-01T00:00:00.000",
        "shortName": "World",
        "description":"dhs",
        "id":"worldinf575"
      };
//todo: check if there is no world
      dispatch(actions.createFirstLevel(DHIS_POST_URL,world,1));
      btn.target.className='success button';
      document.getElementById("btn_region").className="secondary hollow button";
  },

orgRegionHandler:function(btn){
  var{dhisHierarchy,dispatch} =this.props;
//todo: check if there is no second

  if(JSON.stringify(dhisHierarchy.levels.sort())===JSON.stringify([1].sort())){
    btn.target.className='success button';
    dispatch(actions.createSecondLevel(DHIS_POST_URL,2));
    document.getElementById("btn_sub_region").className="secondary hollow button";
  }


  },

  orgSubRegionHandler:function(btn){
    var{dhisHierarchy,dispatch} =this.props;

    var set=new Set(dhisHierarchy.levels);

      if(JSON.stringify([...set].sort())===JSON.stringify([1,2].sort())){
        btn.target.className='success button';
        dispatch(actions.createThirdLevel(DHIS_POST_URL,3));
        document.getElementById("btn_country").className="secondary hollow button";
          }

    },

  orgCountryHandler:function(btn){
    var{dhisHierarchy,dispatch} =this.props;

    var set=new Set(dhisHierarchy.levels);
      if(JSON.stringify([...set].sort())===JSON.stringify([1,2,3].sort())){
        btn.target.className='success button';
        dispatch(actions.createFourthLevel(DHIS_POST_URL,4));

      }
    },

  dhisDataelementHandler:function(btn){
      var{dhsCharacteristic,dispatch,dhsDataElements} =this.props;
      //we will post new data elements after

      if(dhsCharacteristic.length>1 && dhsDataElements.characteristic.length===0){
        var indicators=[];

        //lets get just first set regarding to child health since there are lots of data
        //for(let element of dhsCharacteristic ){

        var element=dhsCharacteristic[0];
           for(let indicator of element.indicators){
             indicators.push(indicator.IndicatorId);
          }
        //}

       if(indicators.length>0){
          var indicatorIds= indicators.map(function(ind){
            return ind;
            }).join(",");
          }


          //lets get some of them 1000
         var url = `${DHS_DATA_API_URL}?indicatorIds=${indicatorIds}&breakdown=all&perpage=1000`;
         dispatch(actions.fetchCharacteritics(url,'1'));
      }
        dispatch(actions.fetchOrgs(DHIS_API_URL_ORG,4));
      },



    dhisDataElement_DataSetCreater:function(btn){
        var{dispatch,dhsDataElementsToDHIS,dhsDataElements} =this.props;

        if(dhsDataElementsToDHIS.length>0){
        dispatch(actions.createDataElement(DHIS_POST_URL));
        dispatch(actions.createDataSet(DHIS_POST_URL));
      }


      },

    dhisDataSetToDataElement:function(btn){
        var{dispatch,dhisDataSets} =this.props;
        if(dhisDataSets.data.length>0){
        dispatch(actions.createDataSetElements(DHIS_POST_URL));
        }

      },

componentWillMount(){
    var{dispatch}=this.props;
    dispatch(actions.fetchCountires(DHS_COUNTRY_API_URL));
    dispatch(actions.fetchIndicators(DHS_INDICATOR_API_URL));
  },

 removeDuplicates(arr, prop) {
       var new_arr = [];
       var lookup  = {};

       for (var i in arr) {
           lookup[arr[i][prop]] = arr[i];
       }

       for (i in lookup) {
           new_arr.push(lookup[i]);
       }

       return new_arr;
   },

componentWillReceiveProps(nextProps){
    var{dispatch,dhsCharacteristic,dhsIndicators,dhisDataSets,dhisDataSetsElements,dhsDataElements,dhsDataElementsToDHIS,availableDataElements,availableDataSets}=nextProps;
  //Here we just keep 2 level indicators
  if(dhsIndicators.indicators!==undefined && dhsCharacteristic.length===0){
      var indictors=dhsIndicators.indicators.filter(indicator=> indicator.Level1==='Child Health')
      dispatch(actions.indicatorFilter('Child Health',indictors));
      var indictors=dhsIndicators.indicators.filter(indicator=> indicator.Level1==='Child Nutrition')
      dispatch(actions.indicatorFilter('Child Nutrition',indictors));
    };

//get 10 pages of data results of dhs
  if(PAGES_FORM_DHS!==dhsDataElements.retrievedPages && dhsDataElements.characteristic.length>0 ){
    document.getElementById("btn_DataElements").className="warning button";
      var indicators=[];

      var element=dhsCharacteristic[0];
         for(let indicator of element.indicators){
           indicators.push(indicator.IndicatorId);
        }

     if(indicators.length>0){
        var indicatorIds= indicators.map(function(ind){
          return ind;
          }).join(",");
        }
    var url = `${DHS_DATA_API_URL}?indicatorIds=${indicatorIds}&breakdown=all&perpage=1000`;
    var promises=[];
    var data=[];
    var retrievedPages='';
    //var nPages=dhsDataElements.pages;
    for (var i = 2; i <= PAGES_FORM_DHS; i++) {
    var pUrl=`${url}&page=${i}`;
      promises.push(axios.get(pUrl))
        };
    axios.all(promises).then(function(results) {
        results.forEach(function(res) {
          data.push(...res.data.Data);
          retrievedPages=res.data.Page;
        })
        dispatch(actions.completeCharacteriticFetch(data,dhsDataElements.pages,retrievedPages));
    });

  }

    //we get 10 pages of results from dhs
  if(dhsDataElements.retrievedPages===PAGES_FORM_DHS && dhsDataElementsToDHIS.length===0){
     document.getElementById("btn_DataElements").className="success button";
     var indicatorIds=new Set();
     dhsDataElements.characteristic.map(element=>indicatorIds.add(element.IndicatorId));
     var dhisIndicatorsWithCharactersitcs=[];
     for (let id of indicatorIds) {
       var Characteristic=[];
       dhsDataElements.characteristic.map(
         element=> element.IndicatorId=== id ?  Characteristic.push({

             CharacteristicId:`${element.ByVariableId}_${element.CharacteristicId}`,
             CharacteristicLabel:`${element.ByVariableLabel}_${element.CharacteristicCategory}_${element.CharacteristicLabel}`,
             IsPrefered:element.IsPreferred
           }) :'' )
          var indicator_with_Characteristic={
               indicator:id,
               Characteristics:[...Characteristic]
             };

       dhisIndicatorsWithCharactersitcs.push(indicator_with_Characteristic)
    }

    var characteristics=this.removeDuplicates(dhisIndicatorsWithCharactersitcs,'indicator');
     dispatch(actions.characteristicFilter(characteristics));

  }
  if(dhsDataElementsToDHIS.length>0){
     document.getElementById("btn_dhisDataElements").className=" secondary hollow button";
   }

   if(dhisDataSets.data.length>0){
     document.getElementById("btn_dhisDataElements").className=" success  button";
      document.getElementById("btn_dhisDataSetsToDataElement").className="secondary hollow  button";
    }

    if(dhisDataSetsElements.data.length>0){
       document.getElementById("btn_dhisDataSetsToDataElement").className="success button";
     }

  },




  render:function(){

    //come from redux state
    var{dhisHierarchy,dhsIndicators,data,dhsDataElements} =this.props;

    var dhsFetchingMessage= dhsIndicators.isFetching ? <div className="loader"></div>  : (((dhsIndicators.data  instanceof Object)  && (dhsIndicators.data.status===404 || importData.data.status===500)) ? <span className="error">{dhsIndicators.data.statusText}: No response from dhs!</span> :'')  ;
    var dhsDataElementsMessage=dhsDataElements.isFetching ? <div className="loader"></div> :(((dhsDataElements.data  instanceof Object)  && (dhsDataElements.data.status===404 || dhsDataElements.data.status===500)) ? <span className="error">{dhsDataElements.data.statusText}: No response from dhs!</span> :'')  ;
    var dhsDataAllElementsMessage=(PAGES_FORM_DHS!==dhsDataElements.retrievedPages && dhsDataElements.characteristic.length>0) ? <div className="loader"></div> :''  ;

    var levels=new Set(dhisHierarchy.levels);
    var message_level_1=(JSON.stringify([...levels].sort())===JSON.stringify([1].sort())) ? <span className="error"> First level is created </span> : ' ';
    var message_level_2=(JSON.stringify([...levels].sort())===JSON.stringify([1,2].sort()) ) ? <span className="error"> Region level is created </span> : '';
    var message_level_3=(JSON.stringify([...levels].sort())===JSON.stringify([1,2,3].sort()) )? <span className="error"> Sub-region level is created </span> : '';
    var message_level_4=(JSON.stringify([...levels].sort())===JSON.stringify([1,2,3,4].sort()))? <span className="error"> Country level is created </span> : '';

      return(

        <div>
        <p>Lets setup first the repository in DHIS to import the data ....</p>

          <div className="button-group">
          <a className="secondary hollow button" href="#" onClick={this.orgFirstHandler} id="btn_world">World</a>
          <a className="disabled hollow button" href="#" onClick={this.orgRegionHandler} id="btn_region">Regions</a>
          <a className="disabled hollow button" href="#" onClick={this.orgSubRegionHandler} id="btn_sub_region">SubRegions</a>
          <a className="disabled hollow button" href="#" onClick={this.orgCountryHandler} id="btn_country">Countries</a>
         </div>

         <div className="button-group">
           <a className="secondary hollow button" href="#" onClick={this.dhisDataelementHandler} id="btn_DataElements">DataElements</a>
           <a className="disabled hollow button" href="#" onClick={this.dhisDataElement_DataSetCreater} id="btn_dhisDataElements">DataSets</a>
           <a className="disabled hollow button" href="#" onClick={this.dhisDataSetToDataElement} id="btn_dhisDataSetsToDataElement">CreateDataSetElements</a>
        </div>
        <div>
          <div>{message_level_1}</div>
          <div>{message_level_2}</div>
          <div>{message_level_3}</div>
          <div>{message_level_4}</div>
          <div>{dhsFetchingMessage}</div>
          <div>{dhsDataElementsMessage}</div>
          <div>{dhsDataAllElementsMessage}</div>
        </div>
        </div>
        );
        }
      });

export default connect(
        (state) => {
          return state;
        }
    )(Setup);
