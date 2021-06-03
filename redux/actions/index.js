import firebase from 'firebase'
import { USER_STATE_CHANGE, RESTAURANTS_STATE_CHANGE } from '../constants/index'

export function fetchUser() {
    let currentUser = firebase.auth().currentUser
    if (currentUser == null) {
        return ((dispatch) => dispatch({ type: USER_STATE_CHANGE, currentUser: null }))
    }
    return ((dispatch) => {
        firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let user = snapshot.data()
                    firebase.firestore()
                        .collection('restaurants')
                        .where('id', 'array-contains', user.favorites)
                        .get()
                        .then((snapshot) => {
                            let restaurants = snapshot.docs.map(doc => {
                                const data = doc.data()
                                const id = doc.id
                                return { id, ...data }
                            })
                            user.favorites = restaurants
                        })
                    console.log(user)
                    dispatch({ type: USER_STATE_CHANGE, currentUser: user })
                }
                else {
                    console.log('user fetch failed!')
                }
            })
    })
}

export function fetchRestaurants(search) {
    if (search) {
        return ((dispatch) => {
            firebase.firestore()
                .collection('restaurants')
                .where('name', '>=', search.toUpperCase())
                .where('name', '<=', search.toLowerCase() + '\uf8ff')
                // .where('search_tags', 'array-contains', search.toLowerCase())
                .get()
                .then((snapshot) => {
                    let restaurants = snapshot.docs.map(doc => {
                        const data = doc.data()
                        const id = doc.id
                        return { id, ...data }
                    })
                    dispatch({ type: RESTAURANTS_STATE_CHANGE, restaurants })
                })
        })
    } else {
        return ((dispatch) => {
            firebase.firestore()
                .collection('restaurants')
                .get()
                .then((snapshot) => {
                    let restaurants = snapshot.docs.map(doc => {
                        const data = doc.data()
                        const id = doc.id
                        return { id, ...data }
                    })
                    dispatch({ type: RESTAURANTS_STATE_CHANGE, restaurants })
                })
        })
    }
}