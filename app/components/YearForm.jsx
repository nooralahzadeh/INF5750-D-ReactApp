var React=require('react');
var {connect} = require('react-redux');
var actions = require('actions');

var FilteredMultiSelect = require('react-filtered-multiselect');

const FOUNDATION_CLASSES = {
  filter: 'form-control',
  select: 'form-control',
  button: 'button success hollow',
  buttonActive: 'btn btn btn-block btn-primary'
}


export var YearForm = React.createClass({


  render() {
    var {years,dispatch,selectedYears} = this.props;
    return <div className="row">
       <div className="large-6 columns">
        <FilteredMultiSelect
          buttonText="Add"
          classNames={FOUNDATION_CLASSES}
          onChange={(selectedOptions)=>{
            dispatch(actions.onSelectYear(selectedOptions));
           }}
          options={years.years}
          selectedOptions={selectedYears}
          textProp="name"
          valueProp="id"
        />
      </div>
       <div className="large-6 columns">
        <FilteredMultiSelect
          buttonText="Remove"
          classNames={{
            filter: 'form-control',
            select: 'form-control',
            button: 'button alert hollow',
            buttonActive: 'btn btn btn-block btn-primary'
          }}
          onChange={(deselectedOption)=>{
              dispatch(actions.onDeSelectYear(deselectedOption[0].id));
          }}
          options={selectedYears}
          textProp="name"
          valueProp="id"
        />
      </div>
    </div>
  }
});

export default connect(
          (state) => {
            return state;
          }
    )(YearForm);
