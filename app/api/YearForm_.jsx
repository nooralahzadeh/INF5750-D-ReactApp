
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

export var YearForm=React.createClass({


  render:function(){
     //var {selectedOptions} = this.state;
      var {years,dispatch,selectedYears} = this.props;

      return(

      <div className="row">
        <div className="large-6 columns">
        <FilteredMultiSelect
          onChange={(selectedOptions)=>{

            dispatch(actions.onSelectYear(selectedOptions));
           }}
          classNames={FOUNDATION_CLASSES}
          options={years.years}
          selectedOptions={selectedYears}
          textProp="name"
          valueProp="id"
        />
       </div>
     <div className="large-6 columns">
        {selectedYears.length === 0 && <p>(nothing selected yet)</p>}
        {selectedYears.length > 0 && <ol>
        {selectedYears.map((year, i) => <li key={year.id}>
            {`${year.name} `}
            <span style={{cursor: 'pointer'}} className="warning label" onClick={()=>{
                dispatch(actions.onDeSelectYear(year.id));
            }}>
              &times;
            </span>
             </li>)}
           </ol>}
         {selectedYears.length > 0 && <button style={{marginLeft: 20}} className="button warning hollow" onClick={()=>{
            dispatch(actions.onBackWard());
          }}>
          Clear Selection
        </button>}
      </div>

    </div>
    );
    }
});

export default connect(
          (state) => {
            return state;
          }
    )(YearForm);
