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


const DHS_DATA_API_URL='http://api.dhsprogram.com/rest/dhs/data';
const DHIS_GET_LEVEL_URL='https://play.dhis2.org/test/api/filledOrganisationUnitLevels'

export var VariableForm=React.createClass({

  getInitialState: function() {
     return {show: false,
      checked:false,
      isFetching:false};
   },

 queryBuilder:function(){
  var{dispatch,selectedCounrty,selectedYears,indicators,breakdown}=this.props;

      if (selectedYears.length>0){
        var surveyYear= selectedYears.map(function(yr){
          return yr.id;
          }).join(",");

      }

    var inds=indicators.filter(indicator => indicator.status);
     if(inds.length>0){
       var indicatorIds= inds.map(function(ind){
         return ind.id;
         }).join(",");

      }

      if(breakdown!==''){
        var breakdown=breakdown;
      }

   var requestUrl = `${DHS_DATA_API_URL}?countryIds=${selectedCounrty.code}&surveyYear=${surveyYear}&indicatorIds=${indicatorIds}&breakdown=${breakdown}`;
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

  var{importData,step,orgUnitsLevels,dispatch}=nextProps;
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
    var {dispatch,showModal,orgUnitsLevels,orgs,selectedOrgs,importData} = this.props;

    var isloading= importData.isFetching ? 'is loading...' : '';
    var isloadingOrg= orgs.isFetching ? 'is loading....' : '';
    //option for organization units
    var defaultOption= <option disabled selected value> -- select an option -- </option>;
    var level_options= orgUnitsLevels.data.map((item,key)=>
         <option key={key} value={item.level}>
           {item.name}
         </option>
       );

    var org_options= orgs.orgs.map((item,key)=>
         <option key={key} value={item.id}>
           {item.displayName}
         </option>
      );


      return(

        <div>
        <div className="row">
          <div className="large-7 columns">
                <Collapsible trigger="Child health">
                  <fieldset className="fieldset">
                    <div>
                           <input id="CN_NUTS_C_HA2" type="checkbox" onChange={this.handlechange} />
                              <label htmlFor="CN_NUTS_C_HA2">Children stunted</label>
                    </div>
                    <div>
                        <input id="CN_NUTS_C_WH2" type="checkbox" onChange={this.handlechange}/><label htmlFor="CN_NUTS_C_WH2">Children wasted</label>
                    </div>
                    <div>
                        <input id="CN_NUTS_C_WA2" type="checkbox" onChange={this.handlechange}/><label htmlFor="CN_NUTS_C_WA2">Children moderately underweight</label>
                    </div>
                    <div>
                        <input id="CN_NUTS_C_WA3" type="checkbox" onChange={this.handlechange}/><label htmlFor="CN_NUTS_C_WA3">Children severely underweight	</label>
                    </div>
                    <div>
                        <input id="CP_CLBS_C_SCH" type="checkbox" onChange={this.handlechange} /><label htmlFor="CP_CLBS_C_SCH">Children age 5-14 attending school	</label>
                    </div>
                  </fieldset>
                </Collapsible>
                <Collapsible trigger="Immunisation"/>
                <Collapsible trigger="Maternal health"/>
                <Collapsible trigger="Malaria"/>

          </div>
            <div className="large-5 columns">
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
                    options={orgs.orgs}
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
                      <a className="success button float-right" href="#" onClick={this.import}>Import</a>
                      <a className="alert button float-left" href="#" onClick={this.closeModal}>Cancel</a>
                  </div>
              </div>
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
