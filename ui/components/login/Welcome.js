import React from 'react'
import { Text, View, Button } from 'react-native'

export default function Welcome({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button
                title="LOGIN"
                onPress={() => navigation.navigate("Login")} />
            <Button
                title="SIGNUP"
                onPress={() => navigation.navigate("SignUp")} />
        </View>
    )
}
