var React = require('react');
var ReactDom = require('react-dom');
var CountryForm = require('CountryForm');
var YearForm = require('YearForm');
var VariableForm=require('VariableForm');
var {Steps, Step} = require('react-multistep-component');



var Main= React.createClass({

  getInitialState:function(){
    return {
      formFail: false,
      selected:[]
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
          <CountryForm  ref={(countires) => { this._countires = countires;}}/>
        </Step>
        <Step customNavigator="Year">
          <span className="form-title">Select Year(s)</span>
            <YearForm  countires={this.state.selected}/>
        </Step>
        <Step customNavigator="Variables">
          <span className="form-title">Select variables</span>
          <VariableForm/>
        </Step>
      </Steps>
    );
  },


  stepShouldChange:function() {
    //added to test
    var ls=this._countires.retriveSelected();

    if (ls.length>0 ) {
        this.setState({
          formFail: false,
          selected:ls
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
