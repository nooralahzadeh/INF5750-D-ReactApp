var React = require('react');
var ReactDom = require('react-dom');
var {connect} = require('react-redux');
var actions = require('actions');
var VariableForm=require('VariableForm');
var {Steps, Step} = require('react-multistep-component');

import CountryForm from 'CountryForm';
import YearForm from 'YearForm';

export var Main= React.createClass({
  getInitialState:function(){
    return {
      formFail: false
    }
  },

  render:function(){

    return(

      <Steps
        currentStep={1}
        prevButton='&#8592;'
        nextButton='&#8594;'
        stepShouldChange={this.stepShouldChange}>
        <Step customNavigator="Counrty">
          <span className="form-title">Select Country</span>
          <CountryForm/>
             {
                this.state.formFail ? <span className="error">The seleted counrty does't have any survey!</span> : ''
              }
        </Step>
         <Step customNavigator="Year">
          <span className="form-title">Select Year(s)</span>
            <YearForm/>
        </Step>
        <Step customNavigator="Variables">
          <span className="form-title">Select variables</span>
          <VariableForm/>
        </Step>
      </Steps>
    );
  },

  stepShouldChange:function() {

    var {years,selectedYears,dispatch} = this.props;
    if (years.years.length>0 && selectedYears.length===0) {
       this.setState({
         formFail: false
       });
       return true;

     } else if(selectedYears.length>0){
          dispatch(actions.onBackWard());
          this.setState({
            formFail: false
          });
          return true;
     } else {
       this.setState({
         formFail: true
       });
     }

   }

});

export default connect(
        (state) => {
          return state;
        }
  )(Main);
