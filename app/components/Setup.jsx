var React=require('react');
var ReactDom = require('react-dom');
var uid= require('uid');
var {connect} = require('react-redux');
var actions = require('actions');
const dhis='http://localhost:8082';
const DHIS_POST_URL=`${dhis}/api/metadata`;
const DHIS_ID_API_URL=`${dhis}/api/system/id`;
const DHS_COUNTRY_API_URL='http://api.dhsprogram.com/rest/dhs/countries';
const DHIS_API_URL=`${dhis}/api/organisationUnits.json`;
const DHS_INDICATOR_API_URL='http://api.dhsprogram.com/rest/dhs/indicators';
const DHS_DATA_API_URL='http://api.dhsprogram.com/rest/dhs/data';
const DHIS_POST_DATASETELEMENT_URL=`${dhis}/api/dataSetElements`;

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
    // if(dhisOrg.level===2 && dhisOrg.data.status==='OK' && regions.data===undefined){
    //   var parentId=uid.uid.codes[0];
    //   var url=`${DHIS_API_URL}?filter=parent.id:eq:${parentId}`;
    //
    //   //var url=`${DHIS_API_URL}?paging=false&level=2`;
    //   //means that we already created the region level so we can fetch their uid s
    //   dispatch(actions.fetchRegions(url));
    // }
    },

  orgCountryHandler:function(btn){
    var{dhisHierarchy,dispatch} =this.props;

    var set=new Set(dhisHierarchy.levels);
      if(JSON.stringify([...set].sort())===JSON.stringify([1,2,3].sort())){
        btn.target.className='success button';
        dispatch(actions.createFourthLevel(DHIS_POST_URL,4));
        document.getElementById("btn_DataElements").className="secondary hollow button";
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
         var requestUrl = `${DHS_DATA_API_URL}?indicatorIds=${indicatorIds}&breakdown=all&perpage=1000`;

         dispatch(actions.fetchCharacteritics(requestUrl));
      }

      },

      dhisDataElement_DataSetCreater:function(btn){
        var{dispatch,dhsDataElementsToDHIS} =this.props;
        if(dhsDataElementsToDHIS.length>0){
        dispatch(actions.createDataElement(DHIS_POST_URL));
        dispatch(actions.createDataSet(DHIS_POST_URL));
        }

      },


      dhisDataSetToDataElement:function(btn){
        var{dispatch,dhisDataSets} =this.props;
        if(dhisDataSets.data.length>0){
        dispatch(actions.createDataSetElements(DHIS_POST_DATASETELEMENT_URL));
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
    var{dispatch,dhsCharacteristic,dhsIndicators,dhsDataElements,dhsDataElementsToDHIS,availableDataElements,availableDataSets}=nextProps;
  //Here we just keep 2 level indicators
  if(dhsIndicators.indicators.length>0 && dhsCharacteristic.length===0){
      var indictors=dhsIndicators.indicators.filter(indicator=> indicator.Level1==='Child Health')
      dispatch(actions.indicatorFilter('Child Health',indictors));
      var indictors=dhsIndicators.indicators.filter(indicator=> indicator.Level1==='Child Nutrition')
      dispatch(actions.indicatorFilter('Child Nutrition',indictors));
    };

    
    // //here it doesnt work in componentWillReceiveProps
    // if(dhsCharacteristic.length>1 && dhsDataElements.characteristic.length===0){
    //   var indicators=[];
    //   //lets get just first set regarding to child health since there are lots of data
    //   //for(let element of dhsCharacteristic ){
    //
    //   var element=dhsCharacteristic[0];
    //     for(let indicator of element.indicators){
    //       indicators.push(indicator.IndicatorId);
    //     }
    //   //}
    //
    //   if(indicators.length>0){
    //     var indicatorIds= indicators.map(function(ind){
    //       return ind;
    //       }).join(",");
    //     }
    //     var testind=indicators[0];
    //     //lets get some of them 1000
    //    var requestUrl = `${DHS_DATA_API_URL}?indicatorIds=${testind}&breakdown=all&perpage=1000`;
    //
    //    dispatch(actions.fetchCharacteritics(requestUrl));
    // };



  if(dhsDataElements.characteristic.length>1 && dhsDataElementsToDHIS.length===0){
     document.getElementById("btn_DataElements").className="sucess button";

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

  },




  render:function(){

    //come from redux state
    var{dhisHierarchy} =this.props;
    var levels=new Set(dhisHierarchy.levels);
    var message_level_1=(JSON.stringify([...levels].sort())===JSON.stringify([1].sort())) ? 'Firs level is created ' : ' ';
    var message_level_2=(JSON.stringify([...levels].sort())===JSON.stringify([1,2].sort()) ) ? 'Region level is created ' : '';
    var message_level_3=(JSON.stringify([...levels].sort())===JSON.stringify([1,2,3].sort()) )? 'Sub-region level is created ' : '';
    var message_level_4=(JSON.stringify([...levels].sort())===JSON.stringify([1,2,3,4].sort()))? 'Country level is created ' : '';

      return(

        <div>
        <p>Lets setup first the repository in DHIS to import the data ....</p>

          <div className="button-group">
          <a className="secondary hollow button" href="#" onClick={this.orgFirstHandler} id="btn_world">World</a>
          <a className="disabled hollow button" href="#" onClick={this.orgRegionHandler} id="btn_region">Regions</a>
          <a className="disabled hollow button" href="#" onClick={this.orgSubRegionHandler} id="btn_sub_region">SubRegions</a>
          <a className="disabled hollow button" href="#" onClick={this.orgCountryHandler} id="btn_country">Countries</a>
          <a className="secondary hollow button" href="#" onClick={this.dhisDataelementHandler} id="btn_DataElements">DataElements</a>
          <a className="secondary hollow button" href="#" onClick={this.dhisDataElement_DataSetCreater} id="btn_dhisDataElements">DataSets</a>
          <a className="secondary hollow button" href="#" onClick={this.dhisDataSetToDataElement} id="btn_dhisDataSetsToDataElement">CreateDataSetElements</a>

         </div>
          <div>{message_level_1}</div>
         <div>{message_level_2}</div>
         <div>{message_level_3}</div>
         <div>{message_level_4}</div>
        </div>
        );
        }
      });

export default connect(
        (state) => {
          return state;
        }
    )(Setup);
