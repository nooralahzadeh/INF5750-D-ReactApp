var React=require('react');
var ReactDom = require('react-dom');
import Collapsible from 'react-collapsible';
var {connect} = require('react-redux');
var actions = require('actions');

export var VariableForm=React.createClass({

handlechange:function(e) {
   var {dispatch} = this.props;
    if(e.target.checked){
        dispatch(actions.onSelectCheckBox(e.target.id,e.target.checked));
      } else{
        dispatch(actions.onDeSelectCheckBox(e.target.id,e.target.checked));
      }
    },

    handleOption:function(e) {
       var {dispatch} = this.props;

          dispatch(actions.onChangeRadioButton(e.target.value));

        },
  render:function(){
      return(
        <div className="row">
          <div className="large-7 columns">
                <Collapsible trigger="Child health">
                  <fieldset className="fieldset">
                    <div>
                           <input id="CN_NUTS_C_HA2" type="checkbox" onChange={this.handlechange} />
                              <label htmlFor="CN_NUTS_C_HA2">Children stunted</label>
                    </div>
                    <div>
                        <input id="CN_NUTS_C_WH2" type="checkbox" onChange={this.handlechange}/><label htmlFor="CN_NUTS_C_WH2">Children wasted</label>
                    </div>
                    <div>
                        <input id="CN_NUTS_C_WA2" type="checkbox" onChange={this.handlechange}/><label htmlFor="CN_NUTS_C_WA2">Children moderately underweight</label>
                    </div>
                    <div>
                        <input id="CN_NUTS_C_WA3" type="checkbox" onChange={this.handlechange}/><label htmlFor="CN_NUTS_C_WA3">Children severely underweight	</label>
                    </div>
                    <div>
                        <input id="CP_CLBS_C_SCH" type="checkbox" onChange={this.handlechange} /><label htmlFor="CP_CLBS_C_SCH">Children age 5-14 attending school	</label>
                    </div>
                  </fieldset>
                </Collapsible>
                <Collapsible trigger="Immunisation"/>
                <Collapsible trigger="Maternal health"/>
                <Collapsible trigger="Malaria"/>

          </div>
            <div className="large-5 columns">
              <fieldset>
              <span className="form-title">Options</span>
              <div>
                <input type="radio" name="option" value="national" id="national" required onChange={this.handleOption}/>
                  <label htmlFor="national">Data-National</label>
              </div>
              <div>
              <input type="radio" name="option" value="subnational" id="subnational" onChange={this.handleOption} />
                <label htmlFor="subnational">Data-Subnational</label>
              </div>
              <div>
              <input type="radio" name="option" value="all" id="all" onChange={this.handleOption} />
                <label htmlFor="all">Data-All</label>
              </div>
              </fieldset>
            </div>
          </div>


      );
    }
  });

//http://api.dhsprogram.com/rest/dhs/data?breakdown=national&indicatorIds=CN_NUTS_C_HA2,CN_NUTS_C_WH2&countryIds=EG&surveyIds=EG2000DHS&f=json
  export default connect(
            (state) => {
              return state;
            }
      )(VariableForm);
