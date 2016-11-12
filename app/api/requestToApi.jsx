var axios=require('axios');

const DHIS_COUNTRY_API_URL='http://api.dhsprogram.com/rest/dhs/countries';
module.exports = {
  getTemp: function () {

    var requestUrl = `${DHIS_COUNTRY_API_URL}`;

    return axios.get(requestUrl).then(function (res) {

      if (res.Data) {
        throw new Error(res.data.message);
      } else {
        return res.data.Data;
      }
    }, function (res) {
      throw new Error(res.data.message);
    });
  }
}

//extras
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

  getSurveyYears: function(country_code) {
         var requestUrl = `${DHIS_SURVEY_API_URL}?countryIds=${country_code}`;
         $.ajax({
         url: requestUrl,
         dataType: 'json',
         cache:false,
         success: function(data) {
            this.setState({data: data.Data});
         }.bind(this),
         error: function(xhr, status, err) {
         console.error("http://api.dhsprogram.com/rest/dhs/v4/surveys?", status, err.toString());
         }.bind(this)});},
