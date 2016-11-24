//countires reducer and action generators
var moment=require('moment');


export var setUpReducer = (state = {inProgress: false, data:[]}, action) => {
  switch (action.type) {
    case 'START_ORG_CREATION':
      return {
        inProgress: true,
        data:[]
      };
    case 'COMPLETE_ORG_CREATION':
      return {
        inProgress: false,
        data:action.data
      };
    default:
      return state;
  }
};

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
        shortName:action.CountryCode,
        openingDate:moment().format(),
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

export var optionReducer = (state ='', action) => {
  switch (action.type) {
    case 'ON_CHANGE_RADIO_BUTTON':
      return action.id
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
    case 'COMPLETE_DHS_QUERY':
      return {
        isFetching: false,
        data:action.data
        }  ;
    case 'EMPTY_IMPORT_DATA':
        return {
          isFetching: false,
          data:undefined
        } ;
    default:
      return state;
  };
};

export var dhsQueryBuilderReducer = (state =[], action) => {
  switch (action.type) {
    case 'DHS_QUERY_BUILDER':
     return [
       action.query
     ];

    default:
      return state;
  };
};


export var getDHISReducer = (state = {isFetching: false, data:[]}, action) => {
  switch (action.type) {
    case 'START_DHIS_GET_QUERY':
      return {
        isFetching: true,
        data:[]
      };
    case 'COMPLETE_DHIS_GET_QUERY':
      return {
        isFetching: false,
        data:action.data
      };
    default:
      return state;
  }
};


export var selectOrgLevelReducer = (state=[], action) => {
  switch (action.type) {
    case 'SELECT_ORG_LEVEL':
      return action.level;
    default:
      return state;
  };
};



export var orgReducer = (state = {isFetching: false, orgs: []}, action) => {
  switch (action.type) {
    case 'START_ORG_FETCH':
      return {
        isFetching: true,
        orgs: []
      };
    case 'COMPLETE_ORG_FETCH':
      return {
        isFetching: false,
        orgs: action.data.map((item)=>{ return {id:item.id, name:item.displayName}})
      }  ;

    case 'CLEAR_ORG_ALL':
        return {
          isFetching: false,
          orgs: []
        }  ;
    default:
      return state;
  }
};


export var orgSelectReducer =  (state=[], action) => {
  switch (action.type) {
    case 'SELECT_ORG':
    return action.orgs.map((org)=> {return {id:org.id, name:org.name}}) ;

    case 'DESELECT_ORG':
      return state.filter((org)=> org.id !== action.id) ;

    case 'DESELECT_ORG_ALL':
      return [];

    default:
      return state;
  }
};

export var showModalReducer = (state=false, action) => {
  switch (action.type) {
    case 'SHOW_MODAL':
      return true;
    case 'HIDE_MODAL':
      return false;
    default:
      return state;
  };
};


export var importDHISReducer = (state = {isImporting: false, numberofdata:[]}, action) => {
  switch (action.type) {
    case 'START_IMPORT_TO_DHIS':
      return {
        isImporting: true,
        data:[]
      };
    case 'COMPLETE_IMPORT_TO_DHIS':
      return {
        isImporting: false,
        numberofdata:action.data
      };
    default:
      return state;
  }
};
