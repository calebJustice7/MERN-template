import { initState } from '../index';

const todoReducer = (state = initState, action) => {
  if(action.type === 'users/auth') {
    return {
      ...state,
      user: action.user
    }
  }
  else if (action.type === 'users/logout') {
    return {
      ...state,
      user: null
    }
  }
  else {
    return {
      ...state
    };
  }
}

export default todoReducer;