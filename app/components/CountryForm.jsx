var React=require('react');
var FilteredMultiSelect = require('react-filtered-multiselect');
var ReactDom = require('react-dom');

var CountryForm=React.createClass({
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



  loadCountries: function() {
      $.ajax({
      url: "http://api.dhsprogram.com/rest/dhs/countries",
      dataType: 'json',
      cache:false,
      success: function(data) {
         this.setState({data: data.Data});
      }.bind(this),
      error: function(xhr, status, err) {
      console.error("http://api.dhsprogram.com/rest/dhs/countries", status, err.toString());
      }.bind(this)});},


  componentDidMount: function() {
      this.loadCountries();
    },

    //to sent selected countries to another Component
  retriveSelected:function(){
       return (this.state.selectedOptions);
    },

  render:function(){
      var list = [];
      this.state.data.map(function(country) {
        var newObject={"id":country.DHS_CountryCode,"name":country.CountryName};
        list.push(newObject);
        }
      );

    var {selectedOptions} = this.state
      return(
      <div>
      <FilteredMultiSelect
        onChange={this.handleSelectionChange}
        options={list}
        selectedOptions={selectedOptions}
        textProp="name"
        valueProp="id"
      />
      {selectedOptions.length === 0 && <p>(nothing selected yet)</p>}
      {selectedOptions.length > 0 && <ul>
        {selectedOptions.map((counrty, i) => <li key={counrty.id}>
          {`${counrty.name} ` + `${counrty.id}`}
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
