var React=require('react');
var ReactDOM=require('react-dom');
var {Route,Router,IndexRoute,hashHistory}=require('react-router');
var Main=require('Main');
var DHISimporter=require('DHISimporter');


// load foundation'
require('style!css!foundation-sites/dist/foundation.min.css');
$(document).foundation();

//App css
require('style!css!sass!applicationStyles');

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={DHISimporter}>
      <Route component={Main}/>

    </Route>
  </Router>,

    document.getElementById('app')
  );
