var React=require('react');
var FilteredMultiSelect = require('react-filtered-multiselect');
var YEAR_LIST =[
    {"id": 1, "name": "1999"},
    {"id": 2, "name": "2000"},
    {"id": 3, "name": "2001"},
    {"id": 4, "name": "2002"},
    {"id": 5, "name": "2003"},
    {"id": 6, "name": "2004"},
]


var YearForm=React.createClass({
    getInitialState() {
	return {
	    selectedOptions: [],
	    data:[]
	}
    },
    
    handleDeselect(index) {
	var selectedOptions = this.state.selectedOptions.slice()
	selectedOptions.splice(index, 1)
	this.setState({selectedOptions})
    },

    handleSelectionChange(selectedOptions) {
	this.setState({selectedOptions})
    },

    /*
      * Gets countrycode from props
      * uses cc in ajax call to retrieve possible years
      * Tried to run this code in loop to get years from several countries, but this failed for now. see    commented code.
      *
     */
    loadYears: function() {
	var cc = this.props.countires.map(function(country) {
            return (
		country.id
            );
	}, this);
	//console.log("cc :" + cc);
	var tmp = [];
	//var i = 0;
	//for (i = 0; i < cc.length; i++) {
	$.ajax({
  	    url: "http://api.dhsprogram.com/rest/dhs/surveys/" + cc[0] + "/",
  	    dataType: 'json',
  	    cache: false,
  	    success: function(data) {		    
		this.setState({data: data.Data});
		//tmp.push(data.Data);
		
  	    }.bind(this),
  	    error: function(xhr, status, err) {
  		console.error("http://api.dhsprogram.com/rest/dhs/surveys/" + cc[0] + "/", status, err.toString());
  	    }.bind(this)

  	});
	//}

	/*
	console.log("tmpArr: ");
	console.log(tmp.keys);
	
	
	this.setState({data: tmp});
    */

	},
    componentWillReceiveProps:function() {
    //componentDidMount: function() {
	this.loadYears();
    },
    
    retriveSelected:function(){
	return (this.state.selectedOptions);
    },
    

    render:function(){
	var list = [];
	this.state.data.map(function(year) {
            var newObject={
		"id":year.SurveyId,
		"year":year.SurveyYear};
            list.push(newObject);
	});
	
	
	var countries = this.props.countires.map(function(country) {
            return (
		    <ul className="menu">
		    <li>
                    <p>{country.name}</p>
		    </li>
		    </ul>
            );
	}, this);
	
	
	
	var {selectedOptions} = this.state
	return(
		<div>
		<FilteredMultiSelect
            onChange={this.handleSelectionChange}
            options={list}
            selectedOptions={selectedOptions}
            textProp="year"
            valueProp="id"
		/>
		{selectedOptions.length === 0 && <p>(nothing selected yet)</p>}
            {selectedOptions.length > 0 && <ul>
             {selectedOptions.map((year, i) => <li key={year.id}>
				  {`${year.year} `}
				  <button type="button" onClick={this.handleDeselect.bind(null, i)}>
				  &times;
				  </button>
				  </li>)}
             </ul>}
		<p>Selected Countires from previous step</p>
		{countries}
	    </div>
	);
    }
});

module.exports=YearForm;
