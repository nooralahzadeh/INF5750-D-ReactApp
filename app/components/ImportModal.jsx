var React = require('react');
var {connect} = require('react-redux');


export var ImportModal = React.createClass({

  componentDidMount: function () {
    var modal = new Foundation.Reveal($('#import-modal'));
    modal.open();
  },
  render: function () {

    return (
      <div id="import-modal" className="reveal tiny text-center" data-reveal="">
        <p>
          <button className="button hollow" data-close="">
            Import
          </button>
        </p>
      </div>
    );
  }
});

export default connect(
    )(ImportModal);
//module.exports = ImportModal;
