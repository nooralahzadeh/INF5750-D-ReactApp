var React=require('react');
var {connect} = require('react-redux');
var actions = require('actions');

var FilteredMultiSelect = require('react-filtered-multiselect');

const BOOTSTRAP_CLASSES = {
  filter: 'form-control',
  select: 'form-control',
  button: 'btn btn btn-block btn-default',
  buttonActive: 'btn btn btn-block btn-primary'
}


export var YearForm=React.createClass({

  // handleDeselect(index) {
  //   var selectedOptions = this.state.selectedOptions.slice()
  //   selectedOptions.splice(index, 1)
  //   this.setState(
  //     {selectedOptions}
  //   )
  // },


  handleSelectionChange(selectedOptions) {
    debugger;
    var {dispatch} = this.props;
    selectedOptions.map((item)=> dispatch(actions.onSelectYear(item.id,item.name)));
  },

  render:function(){
     //var {selectedOptions} = this.state;
      var {years,dispatch,selectedYears} = this.props;
      return(
      <div className="row">
        <div className="col-md-5">
        <FilteredMultiSelect
          onChange={(selectedOptions)=>{
            dispatch(actions.onSelectYear(selectedOptions));
           }}
           classNames={BOOTSTRAP_CLASSES}
          options={years.years}
          selectedOptions={selectedYears}
          textProp="name"
          valueProp="id"
        />
       </div>
     <div className="col-md-5">
        {selectedYears.length === 0 && <p>(nothing selected yet)</p>}
        {selectedYears.length > 0 && <ul>
        {selectedYears.map((year, i) => <li key={year.id}>
            {`${year.name} `}
            <button type="button" style={{marginLeft: 20}} className="btn btn-default" onClick={()=>{
                dispatch(actions.onDeSelectYear(year.id));
            }}>
              &times;
            </button>
          </li>)}
        </ul>}
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
