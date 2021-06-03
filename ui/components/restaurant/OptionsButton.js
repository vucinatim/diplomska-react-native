import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Animated,
    View,
    Modal,
    Easing,
} from 'react-native';

import IconButton from './IconButton';

const OptionsButton = (props) => {
    const { options, icon, style } = props;
    const [isShown, setIsShown] = useState(false)
    const animation = useRef(new Animated.Value(!!isShown ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: isShown ? 1 : 0,
            duration: 300,           // <-- animation duration
            easing: Easing.elastic(1),   // <-- or any easing function
            useNativeDriver: false   // <-- need to set false to prevent yellow box warning
        }).start();
    }, [isShown])

    return (
        <View>
            <IconButton
                name={icon}
                style={style}
                onPress={() => setIsShown(!isShown)} />
            <Modal
                animationType="fade"
                transparent={true}
                visible={isShown}
            >
                <TouchableWithoutFeedback onPress={() => setIsShown(false)}>
                    <View style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                    }} />
                </TouchableWithoutFeedback>
                <Animated.View
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: 10,
                        position: 'absolute',
                        width: 200,
                        right: 16,
                        top: 50,
                        transform: [{ scale: animation }]
                    }}>
                    {options.map((option) => {
                        return (<TouchableOpacity
                            key={option.text}
                            onPress={option.onPress}
                            style={{ padding: 10 }}
                        >
                            <Text numberOfLines={2}>{option.text}</Text>
                        </TouchableOpacity>)
                    })}
                </Animated.View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({

});

export default OptionsButton;