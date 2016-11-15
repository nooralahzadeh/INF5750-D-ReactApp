var React=require('react');
var ReactDom = require('react-dom');
import Collapsible from 'react-collapsible';
var VariableForm=React.createClass({

  render:function(){

      return(
        <div className="row">
          <div className="large-6 columns">
                <Collapsible trigger="Child health">
                  <fieldset class="fieldset">
                    <div>
                           <input id="checkbox12" type="checkbox"/><label for="checkbox12">Checkbox 1</label>
                    </div>
                    <div>
            <input id="checkbox22" type="checkbox"/><label for="checkbox22">Checkbox 2</label>
            </div>
            <div>
          <input id="checkbox32" type="checkbox"/><label for="checkbox32">Checkbox 3</label>
          </div>
                  </fieldset>
                </Collapsible>
                  <Collapsible trigger="Immunisation">
                    <fieldset class="fieldset">
                      <div>
                             <input id="checkbox12" type="checkbox"/><label for="checkbox12">Checkbox 1</label>
                      </div>
                      <div>
              <input id="checkbox22" type="checkbox"/><label for="checkbox22">Checkbox 2</label>
              </div>
              <div>
            <input id="checkbox32" type="checkbox"/><label for="checkbox32">Checkbox 3</label>
            </div>
                    </fieldset>
                </Collapsible>
          </div>
            <div className="large-6 columns">
            <p>another panel</p>
            </div>
            </div>


      );
    }
  });

module.exports=VariableForm;
