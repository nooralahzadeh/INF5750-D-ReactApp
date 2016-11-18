var React = require('react');
var ReactDom = require('react-dom');
var {connect} = require('react-redux');
var actions = require('actions');

var {Steps, Step} = require('react-multistep-component');

import CountryForm from 'CountryForm';
import YearForm from 'YearForm';
import VariableForm from 'VariableForm';  

export var Main= React.createClass({
  getInitialState:function(){
    return {
      formFail: false

    }
  },

  render:function(){
    var {dispatch,data,years,selectedCounrty} = this.props;

    var message=(!data.isFetching && !years.isFetching) ? '': 'is rendering...';
    return(


      <Steps
        currentStep={1}
        prevButton='&#8592;'
        nextButton='&#8594;'
        stepShouldChange={this.stepShouldChange}
        onStepChange={(stepNumber)=>{
          dispatch(actions.onStepChange(stepNumber));
        }}
        >
        <Step customNavigator="Counrty">
          <span className="form-title">Select Country</span>
          <CountryForm/>
            <div>
              <p>{message}</p>
              <p>
                  {
                   (selectedCounrty.code!==undefined) ? (years.years.length>0 ? '' : <span className="error">The seleted counrty does't have any survey!</span>) : ''
                  }
              </p>


            </div>
        </Step>
         <Step customNavigator="Year">
          <span className="form-title">Select Year(s)</span>
            <YearForm/>
        </Step>
        <Step customNavigator="Variables">

          <VariableForm/>
        </Step>
      </Steps>
    );
  },

  stepShouldChange:function() {
    var {years} = this.props;
    if (years.years.length>0) {
       return true;
     }
   },


});
export default connect(
        (state) => {
          return state;
        }
  )(Main);
