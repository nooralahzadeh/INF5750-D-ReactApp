var React = require('react');
var ReactDOM=require('react-dom');
var ReactDOMServer=require('react-dom/server');
var {connect} = require('react-redux');
var actions = require('actions');

export var ImportModal = React.createClass({

  componentDidMount: function () {
    var {dispatch}=this.props;
    var modalMarkup=(
      <div id="import-modal" className="reveal small text-center" data-reveal="">
          <div>
            <label>Map organization units
              <select   onChange={this.handleImportModal}>
                <option value="husker">Husker</option>
                <option value="starbuck">Starbuck</option>
              </select>
            </label>
          </div>

          <button className="button hollow" data-close=""  >
            cancel
          </button>
          <a className="alert button float-right">import</a>

      </div>
    );
    var $modal=$(ReactDOMServer.renderToString(modalMarkup));
    $(ReactDOM.findDOMNode(this)).html($modal);

    var modal = new Foundation.Reveal($('#import-modal'));
    modal.open();

  },

  handleImportModal: function(){
     var {dispatch} = this.props;
     dispatch(actions.hideImportModel(false));
     $('#import-modal').bind('closed', function() {
    console.log("myModal closed!");
});

  },

  render: function () {

    return (
      <div>

      </div>

    );
  }
});

export default connect(
    )(ImportModal);
//module.exports = ImportModal;
