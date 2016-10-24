var React=require('react');
var FilteredMultiSelect = require('react-filtered-multiselect');
var COUNTRIES_LIST =[
  {"id": 1, "name": "NORWAY"},
  {"id": 2, "name": "FRANCE"},
  {"id": 3, "name": "ITALY"},
  {"id": 4, "name": "IRAN"},
  {"id": 5, "name": "ENGLAND"},
  {"id": 6, "name": "SWEEDEN"},
  {"id": 7, "name": "USA"},
  {"id": 8, "name": "ROMANIA"},
  {"id": 9, "name": "POLAND"},
  {"id": 10, "name": "RUSSIA"}
]


var CountryForm=React.createClass({
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
      return(
        <div>
        <FilteredMultiSelect
          onChange={this.handleSelectionChange}
          options={COUNTRIES_LIST}
          selectedOptions={selectedOptions}
          textProp="name"
          valueProp="id"
        />
        {selectedOptions.length === 0 && <p>(nothing selected yet)</p>}
        {selectedOptions.length > 0 && <ul>
          {selectedOptions.map((counrty, i) => <li key={counrty.id}>
            {`${counrty.name} `}
            <button type="button" onClick={this.handleDeselect.bind(null, i)}>
              &times;
            </button>
          </li>)}
        </ul>}
      </div>
    );
    }
  });

module.exports=CountryForm;
