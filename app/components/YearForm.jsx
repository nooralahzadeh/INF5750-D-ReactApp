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
  return {selectedOptions: []}
  },

  handleDeselect(index) {
    var selectedOptions = this.state.selectedOptions.slice()
    selectedOptions.splice(index, 1)
    this.setState({selectedOptions})
  },

  handleSelectionChange(selectedOptions) {
    this.setState({selectedOptions})
  },

  render:function(){
      var {selectedOptions} = this.state
      var countries = this.props.countires.map(function(country) {
         return (
           <ul className="menu">
               <li>
                 <p>{country.name}</p>
               </li>
           </ul>
           );
     }, this);


      return(
        <div>
        <FilteredMultiSelect
          onChange={this.handleSelectionChange}
          options={YEAR_LIST}
          selectedOptions={selectedOptions}
          textProp="name"
          valueProp="id"
        />
        {selectedOptions.length === 0 && <p>(nothing selected yet)</p>}
        {selectedOptions.length > 0 && <ul>
          {selectedOptions.map((year, i) => <li key={year.id}>
            {`${year.name} `}
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
