var React=require('react');

import Collapsible from 'react-collapsible';
var {connect} = require('react-redux');
var actions = require('actions');
var Modal = require('react-modal');
var store = require('configureStore').configure();

var FilteredMultiSelect = require('react-filtered-multiselect');

const FOUNDATION_CLASSES = {
  filter: 'form-control',
  select: 'form-control',
  button: 'button success hollow',
  buttonActive: 'btn btn btn-block btn-primary'
}

const customStyles = {
    content : {
    position                   : 'absolute',
    top                        : '100px',
    left                       : '300px',
    right                      : '300px',
    bottom                     : '50px',
    border                     : '1px solid #ccc',
    background                 : '#fff',
    overflow                   : 'auto',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '20px'
    }
  };

const dhis='http://localhost:8082/';
const DHS_DATA_API_URL='http://api.dhsprogram.com/rest/dhs/data';
const DHIS_GET_LEVEL_URL=`${dhis}/api/filledOrganisationUnitLevels`;
const DHIS_POST_URL=`${dhis}/api/metadata`;
const DHIS_POST_DATAVALUES_URL=`${dhis}/api/dataValueSets?orgUnitIdScheme=name`;
export var VariableForm=React.createClass({

  getInitialState: function() {
     return {show: false,
      checked:false,
      isFetching:false};
   },

 queryBuilder:function(){
  var{dispatch,selectedCounrty,selectedYears,indicators,breakdown,dhsIndicators}=this.props;

      if (selectedYears.length>0){
        var surveyYear= selectedYears.map(function(yr){
          return yr.id;
          }).join(",");

      }

    //fetch indicators under each selected categories
    var categories=indicators.filter(indicator => indicator.status);
    if(categories.length>0){
      var indicators=[];
        for(let category of categories){
          dhsIndicators.indicators.map(
            indicator=> indicator.Level2===category.id? indicators.push(indicator.IndicatorId):''
          );
        }
       if(indicators.length>0){
         var indicatorIds= indicators.map(function(ind){
           return ind;
           }).join(","); }
        }

      if(breakdown!==''){
        var breakdown=breakdown;
      }
   var requestUrl = `${DHS_DATA_API_URL}?countryIds=${selectedCounrty.shortName}&surveyYear=${surveyYear}&indicatorIds=${indicatorIds}&breakdown=${breakdown}`;
   dispatch(actions.dhsQuery(requestUrl));
   dispatch(actions.dhisGetQuery(DHIS_GET_LEVEL_URL));

},


handlechange:function(e) {

   var {dispatch} = this.props;
    if(e.target.checked){
        dispatch(actions.onSelectCheckBox(e.target.id,e.target.checked));
      } else{
        dispatch(actions.onDeSelectCheckBox(e.target.id,e.target.checked));
      }
    },

    handleOption:function(e) {
       var {dispatch} = this.props;
       dispatch(actions.onChangeRadioButton(e.target.value));

      },

componentWillReceiveProps(nextProps){

  var{importData,step,orgUnitsLevels,dispatch,dhsCharacteristic,dhsIndicators}=nextProps;
  if (importData.data===undefined || !importData.data.Data.length>0){
        dispatch(actions.hideModal());
      } else {
        dispatch(actions.showModal());
      }




  if (orgUnitsLevels.isFetching){
            this.setState({isFetching:true});
          }else {
             this.setState({isFetching:false});
          }
  },

  handleImportModal:function(){
      this.queryBuilder();
      },

 importToDHIS:function(){
   var{dispatch,selectedCounrty}=this.props;
   dispatch(actions.importToDHIS(DHIS_POST_DATAVALUES_URL,selectedCounrty));
   dispatch(actions.hideModal());
   dispatch(actions.emptyImportData());

 },

  afterOpenModal: function() {
      var {dispatch} = this.props;
      dispatch(actions.onCancelModalSelectedOrg());
      dispatch(actions.onCancelModalorgs());
    },

    closeModal: function() {
      var {dispatch} = this.props;
      dispatch(actions.hideModal());
      dispatch(actions.emptyImportData());

      },



  render:function(){
    var {dispatch,showModal,orgUnitsLevels,dhis_orgs,selectedOrgs,importData,dhsCharacteristic,step} = this.props;

    var isloading= importData.isFetching ? 'is loading...' : '';
    var isloadingOrg= dhis_orgs.isFetching ? 'is loading....' : '';
    //option for organization units
    var defaultOption= <option disabled selected value> -- select an option -- </option>;
    var level_options= orgUnitsLevels.data.map((item,key)=>
         <option key={key} value={item.level}>
           {item.name}
         </option>
       );

    var org_options= dhis_orgs.orgs.map((item,key)=>
         <option key={key} value={item.id}>
           {item.displayName}
         </option>
      );

//since we create 2 set 'Child Health' and 'Child Nutrition'
if(step===4 && dhsCharacteristic.length>1){
    var child_health_ind=dhsCharacteristic.filter(indicator=> indicator.level==='Child Health');
    var level2s=new Set();
    child_health_ind[0].indicators.map(charateristic=>level2s.add(charateristic.Level2));
    var child_health_options=[...level2s].map((item,key)=>
    <div>
        <input id={item} type="checkbox" onChange={this.handlechange}/><label htmlFor={item}>{item}</label>
    </div>
  );


  var child_nutrition_ind=dhsCharacteristic.filter(indicator=> indicator.level==='Child Nutrition');
  var level2s=new Set();
  child_nutrition_ind[0].indicators.map(charateristic=>level2s.add(charateristic.Level2));
  var child_nutrition_options=[...level2s].map((item,key)=>
  <div>
      <input id={item} type="checkbox" onChange={this.handlechange}/><label htmlFor={item}>{item}</label>
  </div>
);
};

      return(

        <div>
        <div className="row">
          <div className="large-9 columns">
                <Collapsible trigger="Child Health">
                  <fieldset className="fieldset">
                    {child_health_options}
                  </fieldset>
                </Collapsible>
                <Collapsible trigger='Child Nutrition'>
                  <fieldset className="fieldset">
                    {child_nutrition_options}
                  </fieldset>
                </Collapsible>
                <Collapsible trigger="Maternal health"/>
                <Collapsible trigger="Malaria"/>

          </div>
            <div className="large-3 columns">
              <fieldset>
              <span className="form-title">Options</span>
              <div>
                <input type="radio" name="option" value="national" id="national" required onChange={this.handleOption}/>
                  <label htmlFor="national">Data-National</label>
              </div>
              <div>
              <input type="radio" name="option" value="subnational" id="subnational" onChange={this.handleOption} />
                <label htmlFor="subnational">Data-Subnational</label>
              </div>
              <div>
              <input type="radio" name="option" value="all" id="all" onChange={this.handleOption} />
                <label htmlFor="all">Data-All</label>
              </div>
              </fieldset>

            </div>
          </div>

          <div>
            <a className="success button float-right" href="#" onClick={this.handleImportModal}>Import</a>
          </div>

          <div>
            <p>
            {
              (importData.isFetching) ?'':
              ((importData.data!==undefined) ? ( (importData.data.Data.length>0 && !importData.isFetching)?
                  '' : <span className="error">There is no data to import!</span>) : '')
            }
            </p>
          </div>
          <div>{isloading}</div>

          <div>


            <Modal
                  isOpen={showModal}
                  onAfterOpen={this.afterOpenModal}
                  onRequestClose={this.closeModal}
                  style={customStyles}
                  shouldCloseOnOverlayClick={false}
                  contentLabel="Import"
              >
                <div>
                    <label>Map organization units
                      <select  ref="selectOrgLevel"
                        onChange={()=>{
                          var selectedLevel = this.refs.selectOrgLevel.value;
                          dispatch(actions.onSelectOrgLevel(selectedLevel));
                          var DHIS_ORG_QRY_URL='https://play.dhis2.org/test/api/organisationUnits.json';
                          dispatch(actions.fetchOrgs(DHIS_ORG_QRY_URL,selectedLevel));
                          dispatch(actions.onCancelModalSelectedOrg());
                      }} >
                     {defaultOption}
                     {level_options}
                       </select>
                    </label>
                  </div>

              <div className="row">
                 <div className="large-6 columns">
                  <FilteredMultiSelect
                    buttonText="Add"
                    classNames={FOUNDATION_CLASSES}
                    onChange={(selectedOptions)=>{
                     dispatch(actions.onSelectOrg(selectedOptions));
                    }}
                    options={dhis_orgs.orgs}
                    selectedOptions={selectedOrgs}
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
                        dispatch(actions.onDeSelectOrg(deselectedOption[0].id));
                     }}
                    options={selectedOrgs}
                    textProp="name"
                    valueProp="id"
                  />
                </div>

              </div>
              <div>
                <p>{isloadingOrg}</p>
              </div>
              <div>
                  <div>
                      <a className="success button float-right" href="#" onClick={this.importToDHIS}>Import</a>
                      <a className="alert button float-left" href="#" onClick={this.closeModal}>Cancel</a>
                  </div>
              </div>
              </Modal>

              <Modal
                    isOpen={false}
                    onAfterOpen={this.afterOpenModal2}
                    onRequestClose={this.closeModal2}
                    style={customStyles}
                    shouldCloseOnOverlayClick={false}
                    contentLabel="Import..."
                >
                <p>How many data importedt!</p>
              </Modal>
          </div>
    </div>
      );
    }
  });

//http://api.dhsprogram.com/rest/dhs/data?breakdown=national&indicatorIds=CN_NUTS_C_HA2,CN_NUTS_C_WH2&countryIds=EG&surveyIds=EG2000DHS&f=json
export default connect(
  (state) => {
    return state;
  }
)(VariableForm);
