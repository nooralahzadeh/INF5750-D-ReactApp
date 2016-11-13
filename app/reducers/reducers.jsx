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
        years: action.data.map((item)=>{ return {id:item.SurveyYear, name:item.SurveyYear}})
      }  ;
    default:
      return state;
  }
};

export var selectCounrtyReducer = (state = [], action) => {
  switch (action.type) {
    case 'SELECT_COUNRTY':
      return {
        code:action.CountryCode,
        name:action.CounrtyName
      }
    default:
      return state;
  };
};

export var yearSelectReducer =  (state=[], action) => {
  switch (action.type) {
    case 'SELECT_YEAR':
    return action.years.map((year)=> {return {id:year.id, name:year.name}}) ;

    case 'DESELECT_YEAR':
      return state.filter((year)=> year.id !== action.id) ;

    case 'DESELECT_YEAR_ALL':
      return [];

    default:
      return state;
  }
};
