var redux = require('redux');
import Thunk from 'redux-thunk';
import { syncHistoryWithStore, routerReducer} from 'react-router-redux';
var {countryReducer, yearReducer,selectCounrtyReducer,yearSelectReducer} = require('reducers');

export var configure = (initialState = {}) => {
  // Add the reducer to your store on the `routing` key
  var reducer = redux.combineReducers({
    data: countryReducer,
    years:yearReducer,
    selectedCounrty: selectCounrtyReducer,
    selectedYears:yearSelectReducer,
    routing: routerReducer

  });

  var store = redux.createStore(reducer,initialState,
   redux.compose( redux.applyMiddleware(Thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  return store;
};
