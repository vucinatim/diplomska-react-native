import React, { useState } from 'react';
import { useTheme } from '@react-navigation/native';
import {
    View,
    Button,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/FontAwesome'
import * as Google from 'expo-google-app-auth';

import firebase from 'firebase'

import {
    FACEBOOK_APP_ID,
    ANDROID_CLIENT_ID,
    IOS_CLIENT_ID
} from '@env'

const facebookAppId = {
    FACEBOOK_APP_ID
}
const androidClientId = {
    ANDROID_CLIENT_ID,

}
const IOSClientId = {
    IOS_CLIENT_ID
}

export default function Login(props) {
    const { colors } = useTheme();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onLoginSuccess = () => {
        console.log('Login Succeded')
    }
    const onLoginFailure = (errorMessage) => {
        console.log('Login failed!' + errorMessage)
    }

    const signInWithEmail = async () => {
        await firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(onLoginSuccess())
            .catch(error => {
                let errorCode = error.code;
                let errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                    onLoginFailure('Weak Password!')
                } else {
                    onLoginFailure(errorMessage);
                }
            });
    }
    const signInWithFacebook = async () => {
        try {
            const { type, token } = await Facebook.logInWithReadPermissionsAsync(facebookAppId, {
                permissions: ['public_profile'],
            });
            if (type === 'success') {
                await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
                const credential = firebase.auth.FacebookAuthProvider.credential(token);
                const facebookProfileData = await firebase.auth().signInWithCredential(credential);
                onLoginSuccess()
            }
        } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
        }
    }
    const signInWithGoogle = async () => {
        try {
            const result = await Google.logInAsync({
                androidClientId: androidClientId,
                iosClientId: IOSClientId,
                behavior: 'web',
                scopes: ['profile', 'email']
            });

            if (result.type === 'success') {
                await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
                const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
                const googleProfileData = await firebase.auth().signInWithCredential(credential);
                onLoginSuccess()
            }
        } catch ({ message }) {
            alert('login: Error:' + message);
        }
    }

    const socialIconButton = (onPress, icon) => {
        return (<TouchableOpacity
            onPress={onPress}
        >
            <View style={{
                flexShrink: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 999,
                borderWidth: 3,
                borderColor: colors.primary,
                width: 69,
                height: 69,
            }}>
                <MaterialIcons name={icon} size={40} color={colors.primary} />
            </View>
        </TouchableOpacity>)
    }

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss();
            }}
        >
            <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 30 }}>
                <TextInput
                    placeholder="email"
                    onChangeText={setEmail}
                />
                <TextInput
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                />

                <Button
                    onPress={signInWithEmail}
                    title="LOGIN"
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    {socialIconButton(signInWithFacebook, 'facebook')}
                    {socialIconButton(() => console.log('twitter'), 'twitter')}
                    {socialIconButton(signInWithGoogle, 'google')}
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}