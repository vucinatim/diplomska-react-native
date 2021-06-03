import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native'

import firebase from 'firebase'

export default class SignUp extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
        }

        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {
        const { email, password, confirmPassword } = this.state

        if (password === confirmPassword) {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((authResult) => {
                    // Store the new user in the database
                    firebase.firestore.CollectionReference("users")
                        .doc(authResult.user.uid)
                        .set({
                            name: 'react-native-user',
                            favorites: []
                        })
                    console.log(authResult)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    render() {
        return (
            <View>
                <TextInput
                    placeholder="Your Email"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />
                <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                />

                <Button
                    onPress={() => this.onSignUp()}
                    title="SIGN UP"
                />
            </View>
        )
    }
}
