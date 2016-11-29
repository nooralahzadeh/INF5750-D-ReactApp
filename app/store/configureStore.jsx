var redux = require('redux');
import Thunk from 'redux-thunk';
import { syncHistoryWithStore, routerReducer} from 'react-router-redux';
var {setUpReducer,DHISHierarchyReducer,dataEelemntReducer,dataSetReducer,dhisDataSetMemberReducer,dhisDataSetReducer,dhisDataElemenReducer,dhsCharacteristicFilterReducer,countryReducer,orgReducer,indicatorReducer,dhsIndicatorFilterReducer,characteristicReducer, yearReducer,selectCounrtyReducer,yearSelectReducer,stepChangeReducer,variablesReducer,optionReducer,importDHSReducer,dhsQueryBuilderReducer,getDHISReducer,selectOrgLevelReducer,orgSelectReducer,showModalReducer,importDHISReducer} = require('reducers');

export var configure = (initialState = {}) => {
  // Add the reducer to your store on the `routing` key
  var reducer = redux.combineReducers({
    dhisOrg:setUpReducer,
    dhisHierarchy:DHISHierarchyReducer,
    data: countryReducer,
    dhsIndicators:indicatorReducer,
    dhsCharacteristic:dhsIndicatorFilterReducer,
    dhsDataElements:characteristicReducer,
    dhsDataElementsToDHIS:dhsCharacteristicFilterReducer,
    dhisDataElements:dhisDataElemenReducer,
    dhisDataSets:dhisDataSetReducer,
    dhisDataSetsElements:dhisDataSetMemberReducer,
    years:yearReducer,
    selectedCounrty: selectCounrtyReducer,
    selectedYears:yearSelectReducer,
    step:stepChangeReducer,
    indicators:variablesReducer,
    breakdown:optionReducer,
    query:dhsQueryBuilderReducer,
    importData:importDHSReducer,
    orgUnitsLevels:getDHISReducer,
    selectOrgLevel:selectOrgLevelReducer,
    availableDataSets:dataSetReducer,
    availableDataElements:dataEelemntReducer,
    dhis_orgs:orgReducer,

    //levels:levelReducer,
    selectedOrgs:orgSelectReducer,
    showModal:showModalReducer,
    importedData:importDHISReducer,
    routing: routerReducer

  });


var store = redux.createStore(reducer,initialState,
   redux.compose( redux.applyMiddleware(Thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  return store;
};
