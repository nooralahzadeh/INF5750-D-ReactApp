var React = require('react');
var ReactDom = require('react-dom');
var CountryForm = require('CountryForm');
var YearForm = require('YearForm');
var VariableForm=require('VariableForm');
var {Steps, Step} = require('react-multistep-component');



var Main= React.createClass({

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
          <span className="form-title">Selecr Country(ies)</span>
          <CountryForm/>
        </Step>
        <Step customNavigator="Year">
          <span className="form-title">Select Year(s)</span>
            <YearForm/>
        </Step>
        <Step customNavigator="Variables">
          <span className="form-title">Select variables</span>
          <VariableForm/>
          <div className="finish-button">Import</div>
        </Step>
      </Steps>
    );
  },
  stepShouldChange:function() {
    this.setState({
      formFail: false
      });
      return true;
      if (this.refs.name.value === 'joe') {
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

module.exports=Main;
