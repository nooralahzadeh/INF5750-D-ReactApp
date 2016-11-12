var React=require('react');
var ReactDom = require('react-dom');

var CountryForm=React.createClass({
    getInitialState() {
      return {
              selectedValue:'' ,
              selectedCountryName:'',
              data:[]
            }
      },

 loadCountries: function() {
      $.ajax({
      url: "http://api.dhsprogram.com/rest/dhs/countries",
      dataType: 'json',
      cache:false,
      success: function(data) {
         this.setState({data: data.Data});
      }.bind(this),
      error: function(xhr, status, err) {
      console.error("http://api.dhsprogram.com/rest/dhs/countries", status, err.toString());
      }.bind(this)});},


  componentDidMount: function() {
      this.loadCountries();
    },

    //to sent selected countries to another Component
  retriveSelected:function(){
       return (this.state.selectValue);
    },

  handleChange:function(e){
           this.setState({
             selectValue:e.target.value,
             selectedCountryName:e.target.options[e.target.selectedIndex].text
           });
       },
  render:function(){

      var options= this.state.data.map((item,key)=>
          <option key={key} value={item.DHS_CountryCode}>
            {item.CountryName}
          </option>
        );
        
      var message='You selected: '+ this.state.selectedCountryName;
      return(

        <div>
           <select value={this.state.selectValue}
            onChange={this.handleChange}
           >
           {options}
            </select>
            <p>{message}</p>
            </div>
        );
        }
      });


module.exports=CountryForm;
