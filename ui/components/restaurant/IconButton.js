import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {
    Animated,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

export default function IconButton(props) {

    const { name, onPress, style, color } = props

    return (
        <Animated.View style={[styles.iconContainer, style]}>
            <TouchableOpacity onPress={onPress}>
                <MaterialIcons style={styles.icon} name={name} size={24} color={color !== 'undefined' ? color : 'black'} />
            </TouchableOpacity>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    iconContainer: {
        borderRadius: 100,
        backgroundColor: 'white',
        opacity: 0.7,
    },
    icon: {
        padding: 4,
    },
});
