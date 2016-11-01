var React=require('react');
var ReactDom = require('react-dom');

var VariableForm=React.createClass({

  render:function(){

      return(
        <div>
        <div>
          <h3>Varibles  changes come here!</h3>
        </div>


        <button className="button expanded hollow">Import</button>
    </div>
      );
    }
  });

module.exports=VariableForm;
