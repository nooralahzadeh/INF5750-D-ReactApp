var React=require('react');
var ReactDom = require('react-dom');

var VariableForm=React.createClass({
    getInitialState() {

	return {
	    selectedOptions: []
	}
    },
    
  render:function(){

/*
      	var c = this.props.years.map(function(years) {
            return (
		    <ul className="menu">
		    <li>
                    <p>{years.year}</p>
		    
		    </li>
		    </ul>
            );
	}, this);

      console.log(c);
  */    
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
