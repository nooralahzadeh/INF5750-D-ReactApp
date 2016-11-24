var React=require('react');
var { TitleBar, Toolbar,ToolbarNav, ToolbarNavItem , Text } =require('react-desktop/macOs');
var { View, TitleBar }  =require('react-desktop/macOs');
var {Link,IndexLink}=require('react-router');

var Nav =React.createClass({
  getInitialState:function(){
    return {
      isFullscreen: false
    }
  },
  render:function(){
    return(

      <TitleBar
        title="DHIS importer"
        controls
        isFullscreen={this.state.isFullscreen}
        onCloseClick={() => console.log('Close window')}
        onMinimizeClick={() => console.log('Minimize window')}
        onMaximizeClick={() => console.log('Mazimize window')}
        onResizeClick={() => this.setState({ isFullscreen: !this.state.isFullscreen })}
        >
      
      </TitleBar>


    );
  }

});


module.exports=Nav;
