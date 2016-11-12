var React = require('react');
var ReactDom = require('react-dom');
var CountryForm = require('CountryForm');
var YearForm = require('YearForm');
var VariableForm=require('VariableForm');
var {Steps, Step} = require('react-multistep-component');


const DHIS_SURVEY_API_URL='http://api.dhsprogram.com/rest/dhs/v4/surveys';
var Main= React.createClass({

  getInitialState:function(){
    return {
      formFail: false,
      selected:[],
      data:[]
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
            <YearForm  countires={this.state.selected} years={this.state.data}/>
        </Step>
        <Step customNavigator="Variables">
          <span className="form-title">Select variables</span>
          <VariableForm/>
        </Step>
      </Steps>
    );
  },

  getSurveyYears: function(country_code) {
      var requestUrl = `${DHIS_SURVEY_API_URL}?countryIds=${country_code}`;
      $.ajax({
      url: requestUrl,
      dataType: 'json',
      cache:false,
      success: function(data) {
         this.setState({data: data.Data});
      }.bind(this),
      error: function(xhr, status, err) {
      console.error("http://api.dhsprogram.com/rest/dhs/v4/surveys?", status, err.toString());
      }.bind(this)});},

  stepShouldChange:function() {
    //added to test
    var ls=[];
    this.setState({data:[]});
    ls=this._countires.retriveSelected();

    debugger;
    if (ls.length>0 ) {
      this.getSurveyYears(ls[0].id);
      if (this.state.data.length>0){
      this.setState({
          formFail: false,
          selected:ls
        });
        return true;
      } else{
        this.setState({
          formFail: true
        });
      }

    } else {
        this.setState({
          formFail: true
        });
      }
  }
});

module.exports=Main;
