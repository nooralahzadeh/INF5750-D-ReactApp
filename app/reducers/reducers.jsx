//countires reducer and action generators
export var countryReducer = (state = {isFetching: false, countires: []}, action) => {
  switch (action.type) {
    case 'START_COUNTRY_FETCH':
      return {
        isFetching: true,
        countires: []
      };
    case 'COMPLETE_COUNTRY_FETCH':
      return {
        isFetching: false,
        countires: action.data
      }  ;
    default:
      return state;
  }
};

export var yearReducer = (state = {isFetching: false, country:'', years: []}, action) => {
  switch (action.type) {
    case 'START_YEAR_FETCH':
      return {
        isFetching: true,
        country:action.country,
        years: []
      };
    case 'COMPLETE_YEAR_FETCH':
      return {
        isFetching: false,
        country:action.country,
        years: action.data
      }  ;
    default:
      return state;
  }
};
