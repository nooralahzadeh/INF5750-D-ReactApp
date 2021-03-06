var React=require('react');
var ReactDOM=require('react-dom');
var {Provider} = require('react-redux');
var axios = require('axios');
var {Route,Router,IndexRoute,browserHistory}=require('react-router');
var { syncHistoryWithStore, routerReducer } =require('react-router-redux');
var DHISimport=require('DHISimport');
var actions = require('actions');
var store = require('configureStore').configure();
import Main from 'Main';


store.subscribe(() => {
  var state = store.getState();
  console.log('New state', state);
});



// load foundation'
require('style!css!foundation-sites/dist/foundation.min.css');
$(document).foundation();

// $(document).on('click', 'a.disabled', function(e) {
//   e.preventDefault();
// });

//App css
require('style!css!sass!applicationStyles');

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
      { /* Tell the Router to use our enhanced history */ }
      <Router history={history}>
        <Route path="/" component={DHISimport}>
          <Route path=":step" component={Main}/>
        </Route>
      </Router>
    </Provider>,
  document.getElementById('app')
  );
