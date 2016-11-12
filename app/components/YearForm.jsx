var React=require('react');
var {connect} = require('react-redux');
var FilteredMultiSelect = require('react-filtered-multiselect');

// const DHIS_SURVEY_API_URL='http://api.dhsprogram.com/rest/dhs/v4/surveys';

export var YearForm=React.createClass({
  getInitialState() {
  return {
    selectedOptions: []
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

  render:function(){
     var {selectedOptions} = this.state;
      var {years} = this.props;
      var year_list = [];
      years.years.map(function(survey) {
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

  export default connect(
          (state) => {
            return state;
          }
        )(YearForm);
