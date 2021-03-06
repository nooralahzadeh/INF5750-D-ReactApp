var React = require('react');
var ReactDom = require('react-dom');
var {connect} = require('react-redux');
var actions = require('actions');


var {Steps, Step} = require('react-multistep-component');
import Setup from 'Setup';
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

    var message=(!data.isFetching && !years.isFetching) ? '': <div className="loader"></div>;
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
        <Step customNavigator="Setup">
          <span className="form-title">Setup</span>
          <Setup/>
        </Step>
        <Step customNavigator="Counrty">
          <span className="form-title">Select Country</span>
          <CountryForm/>
            <div>
              <p>{message}</p>
              <p>
                  {
                    (years.isFetching) ?'':
                    ((selectedCounrty.code!==undefined) ? ( (years.years.length>0 && !years.isFetching)?
                        '' : <span className="error">The seleted counrty does not have any survey!</span>) : '')
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

    var {years,step,dhisOrg,dispatch,selectedYears,availableDataElements,availableDataSets} = this.props;
    if(step===1){
      return true;
    }

    dispatch(actions.emptyImportData());
    dispatch(actions.emptyImportedData());

    if(step===4){
      return true;
      }

    if (step===2 && years.years.length>0) {
       return true;
     }

     if(step==3 && selectedYears.length>0){
       return true;
     }

   },


});
export default connect(
        (state) => {
          return state;
        }
  )(Main);
