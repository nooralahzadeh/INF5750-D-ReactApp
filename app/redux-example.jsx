var redux = require('redux');
var axios = require('axios');

console.log('Starting redux example');





var reducer = redux.combineReducers({
  data: countryReducer,
  year:yearReducer
});

var store = redux.createStore(reducer, redux.compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

//subscribe to changes

var unsubscribe = store.subscribe(() => {
  var state = store.getState();
  console.log('New state', store.getState());
  if (state.data.isFetching) {
    document.getElementById('app').innerHTML = 'Loading...';
  } else if (state.data.countries) {

  }
});

var currentState = store.getState();
console.log('currentState', currentState);

fetchCountires(DHS_COUNTRY_API_URL);
fetchYear(DHS_SURVEY_API_URL,'AL');
