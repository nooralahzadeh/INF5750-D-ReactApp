var React=require('react');
var ReactDom = require('react-dom');
var {connect} = require('react-redux');
var actions = require('actions');

export var CountryForm=React.createClass({
    getInitialState() {
      return {
              selectValue:'',
              selectedCountryName:'',
              data:[]
            }
      },


    //to sent selected countries to another Component
  retriveSelected:function(){
       return (this.state.selectValue);
    },

    handleChange : function (e) {
        e.preventDefault();
        var {dispatch} = this.props;
        var DHS_SURVEY_API_URL='http://api.dhsprogram.com/rest/dhs/v4/surveys';
        dispatch(actions.fetchYear(DHS_SURVEY_API_URL,e.target.value));
        this.setState({
                  selectValue:e.target.value,
                  selectedCountryName:e.target.options[e.target.selectedIndex].text
                  });
                  },

  render:function(){

    //come from redux state
     var {data} = this.props;


     var options= data.countires.map((item,key)=>
          <option key={key} value={item.DHS_CountryCode}>
            {item.CountryName}
          </option>
        );

      var message='You selected: '+ this.state.selectedCountryName;
      return(

        <div>
           <select value={this.state.selectValue}
            onChange={this.handleChange}
           >
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
