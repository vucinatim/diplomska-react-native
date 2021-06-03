const initialState = {
    restaurants: null
}

export const restaurant = (state = initialState, action) => {
    return {
        ...state,
        restaurants: action.restaurants
    }
}