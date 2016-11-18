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

export var selectCounrtyReducer = (state={}, action) => {
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

export var stepChangeReducer = (state = [], action) => {
  switch (action.type) {
    case 'ON_STEP_CHANGE':
      return action.step;
    default:
      return state;
  };
};
export var variablesReducer = (state = [], action) => {

  switch (action.type) {
    case 'ON_SELECT_CHECKBOX_CHANGE':
      return [
        ...state,
        {id:action.id,
        status:action.checked
      }
    ];
    case 'ON_DESELECT_CHECKBOX_CHANGE':
      return state.map((variable) => {
        if (variable.id === action.id) {
        return {
          ...variable,
          status: action.checked
        };
      } else {
          return  variable;
      }
    });
    default:
      return state;
  };
};

export var optionReducer = (state = [], action) => {

  switch (action.type) {
    case 'ON_CHANGE_RADIO_BUTTON':
      return action.id

    default:
      return state;
  };
};


export var importModalReducer = (state=false, action) => {

  switch (action.type) {
    case 'SHOW_IMPORT_MODAL':
      return true;
    case 'HIDE_IMPORT_MODAL':
      return false;
    default:
      return state;
  };
};


export var importDHSReducer = (state = {isFetching: false, data:undefined}, action) => {
  switch (action.type) {
    case 'START_DHS_QUERY':
      return {
        isFetching: true,
      };
    case 'COMPLETE_DHS_FETCH':
      return {
        isFetching: false,
        data:action.data
      }  ;
    default:
      return state;
  }
};
