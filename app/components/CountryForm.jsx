var React=require('react');
var ReactDom = require('react-dom');
var {connect} = require('react-redux');
var actions = require('actions');


export var CountryForm=React.createClass({

componentWillReceiveProps(nextProps){

  // var{subRegions,dhisOrg}=nextProps;
  //   this.createCountires(subRegions,dhisOrg);

    },


createCountires(subRegions,dhisOrg){
    var{dispatch}=this.props;
    if(dhisOrg.level===3 && subRegions.data!==undefined ){
      debugger;
      const DHIS_POST_URL='https://play.dhis2.org/test/api/metadata';
      dispatch(actions.createFourthLevel(DHIS_POST_URL,4));
        }
    },
  render:function(){

    //come from redux state
     var {data,dispatch,selectedCounrty,selectedYears,indicators,breakdown} = this.props;

    // var selected=!selectedCounrty.length>0 ? data.countires[0].CountryName: selectedCounrty.name;
    var defaultOption= <option disabled selected value> -- select an option -- </option>;
     var options= data.countires.map((item,key)=>
          <option key={key} value={item.DHS_CountryCode}>
            {item.CountryName}
          </option>
        );

      var message=!data.isFetching ? 'You selected: '+ selectedCounrty.name : <div className="loader"></div>;


      return(

        <div>
           <select  ref="selectCountry"
            onChange={()=>{
               var selectCountryCode = this.refs.selectCountry.value;
               var selectCountryName=this.refs.selectCountry.options
                            [this.refs.selectCountry.selectedIndex].text;

              dispatch(actions.onSelectCountry(selectCountryCode,selectCountryName));
              var DHS_SURVEY_API_URL='http://api.dhsprogram.com/rest/dhs/v4/surveys';
              dispatch(actions.fetchYear(DHS_SURVEY_API_URL,selectCountryCode));
              if(selectedYears.length>0){
                dispatch(actions.onBackWard());
              }
            }}>
          {defaultOption}
          {options}
            </select>
            <div>{message}</div>
            </div>
        );
        }
      });

export default connect(
        (state) => {
          return state;
        }
    )(CountryForm);
