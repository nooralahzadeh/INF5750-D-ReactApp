var React = require('react');
var ReactDom = require('react-dom');
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
        stepShouldChange={this.stepShouldChange}
      >
        <Step customNavigator="Counrty">
          <span className="form-title">Selecr Contry(ies)</span>
          <div className="form-data">
            <label>Name</label>
            <input ref="name"/>
            {
              this.state.formFail ? <span className="error">Invalid slection</span> : ''
            }
          </div>
          <div className="form-data">
            <label>Lastname</label>
            <input/>
          </div>
          <div className="form-data">
            <label>Email</label>
            <input/>
          </div>
          <div className="form-data">
            <label>Age</label>
            <input/>
          </div>
        </Step>
        <Step customNavigator="Year">
          <span className="form-title">Select Year(s)</span>
          <div className="form-data">
            <label>Number</label>
            <input/>
          </div>
          <div className="form-data">
            <label>Date</label>
            <input/>
          </div>
          <div className="form-data">
            <label>Passenger number</label>
            <input/>
          </div>
        </Step>
        <Step customNavigator="Variables">
          <span className="form-title">Select variables</span>
          <div className="form-data">
            <label>Card</label>
            <input/>
          </div>
          <div className="form-data">
            <label>Number</label>
            <input/>
          </div>
          <div className="form-data">
            <label>Code</label>
            <input/>
          </div>
          <div className="finish-button">FINISH</div>
        </Step>
      </Steps>
    );
  },
  stepShouldChange:function() {
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
