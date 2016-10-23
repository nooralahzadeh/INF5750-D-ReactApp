var axios=require('axios');

const OPEN_API_URL='http://api.......?appid=...';
module.exports = {
  getTemp: function (location) {
    var encodedLocation = encodeURIComponent(location);
    var requestUrl = `${OPEN_API_URL}&q=${encodedLocation}`;

    return axios.get(requestUrl).then(function (res) {
      if (res.data.cod && res.data.message) {
        throw new Error(res.data.message);
      } else {
        return res.data.main.temp;
      }
    }, function (res) {
      throw new Error(res.data.message);
    });
  }
}
