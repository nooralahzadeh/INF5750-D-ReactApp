var React=require('react');
var Loading = require('react-loading');
import Collapsible from 'react-collapsible';
var {connect} = require('react-redux');
var actions = require('actions');
var Modal = require('react-modal');
var store = require('configureStore').configure();

const customStyles = {
    content : {
    position                   : 'absolute',
    top                        : '100px',
    left                       : '350px',
    right                      : '350px',
    bottom                     : '200px',
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
const DHIS_GET_ORG_URL='https://play.dhis2.org/demo/api/organisationUnits?paging=false&level=2'

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

  // dispatch(actions.dhisGetQuery(DHIS_GET_ORG_URL));
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

  var{importData,step,orgUnits}=nextProps;
  if (importData.isFetching && orgUnits.isFetching){
        this.setState({isFetching:true,show:false});
      }else if(importData.data!==undefined && step===3) {
         this.setState({show:true,
                  isFetching:false
              });
      }
  },

  handleImportModal:function(){
      var {dispatch} = this.props;
      this.queryBuilder();
      debugger;
      },

  afterOpenModal: function() {

    },

    closeModal: function() {
      var{importData}=this.props;
      importData.data=undefined;
      importData.isFetching=false;
      this.setState({show:false});
      },



  render:function(){

    var {dispatch,showModal,data,levels} = this.props;

    var isloading= this.state.isFetching ? <Loading type='bubbles' color='#e3e3e3' /> : '';
    //option for organization units
    var defaultOption= <option disabled selected value> -- select an option -- </option>;
    var unit_options= data.countires.map((item,key)=>
         <option key={key} value={item.DHS_CountryCode}>
           {item.CountryName}
         </option>
       );

    var level_options= levels.levels.map((item,key)=>
         <option key={key} value={item.id}>
           {item.name}
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
          {isloading}
            <Modal
                  isOpen={this.state.show}
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
                           var selectOrgCode = this.refs.selectOrgLevel.value;
                           var selectOrgName=this.refs.selectOrgLevel.options
                                        [this.refs.selectOrgLevel.selectedIndex].text;
                          dispatch(actions.onSelectOrgLevel(selectOrgCode,selectOrgName));
                          var DHS_SURVEY_API_URL='http://api.dhsprogram.com/rest/dhs/v4/surveys';
                          dispatch(actions.fetchLevels(DHS_SURVEY_API_URL,selectOrgCode));
                      }}  >
                     {defaultOption}
                     {unit_options}
                       </select>
                    </label>

                    <div className="row">
                    <div className="medium-5 columns">
                      <p>here will come somethings!</p>
                    </div>
                    <div className="medium-5 columns">
                      <label>
                          <select multiple >
                            {level_options}
                          </select>
                      </label>
                      </div>
                    </div>
              </div>

              <div>
                  <a className="success button float-right" href="#" onClick={this.import}>Import</a>
                  <a className="alert button float-left" href="#" onClick={this.closeModal}>Cancel</a>
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
