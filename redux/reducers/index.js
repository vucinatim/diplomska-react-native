import { combineReducers } from 'redux'
import { user } from './user'
import { restaurant } from './restaurant'

const Reducers = combineReducers({
    userState: user,
    restaurantsState: restaurant
})

export default Reducers