var React=require('react');
var ReactDom = require('react-dom');
var {connect} = require('react-redux');
var actions = require('actions');

export var CountryForm=React.createClass({

  render:function(){

    //come from redux state
     var {data,dispatch,selectedCounrty,selectedYears} = this.props;

     var options= data.countires.map((item,key)=>
          <option key={key} value={item.DHS_CountryCode}>
            {item.CountryName}
          </option>
        );

      var message='You selected: '+ selectedCounrty.name;
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
           {options}
            </select>
            <p>{message}</p>
            </div>
        );
        }
      });

export default connect(
        (state) => {
          return state;
        }
      )(CountryForm);
