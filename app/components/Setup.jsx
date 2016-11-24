var React=require('react');
var ReactDom = require('react-dom');
var {connect} = require('react-redux');
var actions = require('actions');

const DHIS_POST_URL='https://play.dhis2.org/demo/api/metadata';
export var Setup=React.createClass({


  orgHandler:function(){
    var{dispatch}=this.props;
    var world={
        "name": "World",
        "openingDate": "1900-01-01T00:00:00.000",
        "shortName": "world"
      };

        dispatch(actions.createOrganizations(DHIS_POST_URL,world));

  },

componentWillMount(){
    var{dispatch}=this.props;
    const DHS_COUNTRY_API_URL='http://api.dhsprogram.com/rest/dhs/countries';
    dispatch(actions.fetchCountires(DHS_COUNTRY_API_URL));

},
  render:function(){

    //come from redux state


      return(

        <div>
        <p>Lets setup first the repository in DHIS to import the data ....</p>

          <div className="button-group">
          <a className="secondary hollow button" href="#" onClick={this.orgHandler}>organizations</a>
          <a className="secondary hollow button" href="#">indicators</a>
          <a className="secondary hollow button" href="#">Share</a>

          </div>
        </div>
        );
        }
      });

export default connect(
        (state) => {
          return state;
        }
    )(Setup);
