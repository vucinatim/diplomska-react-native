import React from 'react';

import WelcomeScreen from '../login/Welcome'
import ProfileScreen from './Profile'

// import { fetchUser } from '../../../redux/actions/index'
// import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

export function ProfileOrLogin(props) {
    const { user } = props
    if (!user) {
        return <WelcomeScreen navigation={props.navigation} />
    } else {
        return <ProfileScreen />
    }
}

const mapStateToProps = (store) => ({
    user: store.userState.currentUser
})

export default connect(mapStateToProps, null)(ProfileOrLogin)
