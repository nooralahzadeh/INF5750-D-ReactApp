var React=require('react');
var ReactDom = require('react-dom');
import Collapsible from 'react-collapsible';
var {connect} = require('react-redux');
var actions = require('actions');
export var VariableForm=React.createClass({

  render:function(){
    var {dispatch} = this.props;
      return(

        <div className="row">
          <div className="large-7 columns">
                <Collapsible trigger="Child health">
                  <fieldset className="fieldset">
                    <div>
                           <input id="CN_NUTS_C_HA2" type="checkbox" onChange={(e)=>{
                               dispatch(actions.onCheckBox(e.target.id,e.target.checked));
                             }} /> <label htmlFor="CN_NUTS_C_HA2">Children stunted</label>
                    </div>
                    <div>
                        <input id="CN_NUTS_C_WH2" type="checkbox"/><label htmlFor="CN_NUTS_C_WH2">Children wasted</label>
                    </div>
                    <div>
                        <input id="CN_NUTS_C_WA2" type="checkbox"/><label htmlFor="CN_NUTS_C_WA2">Children moderately underweight</label>
                    </div>
                    <div>
                        <input id="CN_NUTS_C_WA3" type="checkbox"/><label htmlFor="CN_NUTS_C_WA3">Children severely underweight	</label>
                    </div>
                    <div>
                        <input id="CP_CLBS_C_SCH" type="checkbox"/><label htmlFor="CP_CLBS_C_SCH">Children age 5-14 attending school	</label>
                    </div>
                  </fieldset>
                </Collapsible>
                  <Collapsible trigger="Immunisation">
                    <fieldset className="fieldset">
                      <div>
                             <input id="checkbox12" type="checkbox"/><label htmlFor="checkbox12">Checkbox 1</label>
                      </div>
                      <div>
              <input id="checkbox22" type="checkbox"/><label htmlFor="checkbox22">Checkbox 2</label>
              </div>
              <div>
            <input id="checkbox32" type="checkbox"/><label htmlFor="checkbox32">Checkbox 3</label>
            </div>
                    </fieldset>
                </Collapsible>
          </div>
            <div className="large-3 columns">
            <p>another panel</p>
            </div>
            </div>


      );
    }
  });

  export default connect(
            (state) => {
              return state;
            }
      )(VariableForm);
