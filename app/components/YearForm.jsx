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
// const DHIS_SURVEY_API_URL='http://api.dhsprogram.com/rest/dhs/v4/surveys';

var YearForm=React.createClass({
  getInitialState() {
  return {selectedOptions: []
    }
  },

  // getSurveyYears: function(country_code) {
  //
  //     var requestUrl = `${DHIS_SURVEY_API_URL}?countryIds=${country_code}`;
  //     $.ajax({
  //     url: requestUrl,
  //     dataType: 'json',
  //     cache:false,
  //     success: function(data) {
  //        this.setState({data: data.Data});
  //     }.bind(this),
  //     error: function(xhr, status, err) {
  //     console.error("http://api.dhsprogram.com/rest/dhs/v4/surveys?", status, err.toString());
  //     }.bind(this)});},


  // componentWillReceiveProps: function() {
  //   debugger;
  //     var list_of_counry = [];
  //     this.props.countires.map(function(country) {
  //       var newObject=country.DHS_CountryCode;
  //       list_of_counry.push(newObject);
  //         }
  //       );
  //
  //     var contry_id=list_of_counry[0];
  //     this.getSurveyYears(contry_id);
  //
  //   },


  handleDeselect(index) {
    var selectedOptions = this.state.selectedOptions.slice()
    selectedOptions.splice(index, 1)
    this.setState({selectedOptions})
  },

  handleSelectionChange(selectedOptions) {
    this.setState({selectedOptions})
  },

  render:function(){
      var {selectedOptions} = this.state;
      var year_list = [];
      this.props.years.map(function(survey) {
        var newObject={"id":survey.SurveyYear,"name":survey.SurveyYear};
        year_list.push(newObject);
        }
      );

      return(
        <div>
        <FilteredMultiSelect
          onChange={this.handleSelectionChange}
          options={year_list}
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

      </div>
    );
    }
  });

module.exports=YearForm;
