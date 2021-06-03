import React from 'react';
import { StyleSheet, Animated, Easing, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { MAX_HEADER_HEIGHT, MIN_HEADER_HEIGHT, TAB_HEADER_HEIGHT } from './Menu';

const Header = (props) => {
    const { imgUri, scrollY } = props;

    const scrollDistance = MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT;

    const headerTranslate = scrollY.interpolate({
        inputRange: [0, scrollDistance],
        outputRange: [0, -scrollDistance],
        extrapolate: 'clamp',
    });

    const animateHeaderImageScale = scrollY.interpolate({
        inputRange: [0, scrollDistance],
        outputRange: [1.2, 1],
        extrapolate: 'clamp',
        easing: Easing.inOut(Easing.ease),
    });

    const animateHeaderImageOpacity = scrollY.interpolate({
        inputRange: [0, scrollDistance],
        outputRange: [1, 0],
        extrapolate: 'clamp',
        easing: Easing.inOut(Easing.ease),
    });

    const animateHeaderShadow = scrollY.interpolate({
        inputRange: [0, scrollDistance],
        outputRange: [0, 6],
        extrapolate: 'clamp',
        easing: Easing.inOut(Easing.ease),
    });

    const tabBarHeight = scrollY.interpolate({
        inputRange: [MAX_HEADER_HEIGHT - TAB_HEADER_HEIGHT, MAX_HEADER_HEIGHT],
        outputRange: [MAX_HEADER_HEIGHT, MAX_HEADER_HEIGHT + TAB_HEADER_HEIGHT],
        extrapolate: 'clamp',
        easing: Easing.inOut(Easing.ease),
    });

    return (
        <Animated.View style={[
            styles.header,
            {
                elevation: animateHeaderShadow,
                height: tabBarHeight,
                transform: [{ translateY: headerTranslate }],
            }
        ]}>
            <Animated.Image
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '100%',
                    zIndex: -1,
                    opacity: animateHeaderImageOpacity,
                    transform: [
                        {
                            scale: animateHeaderImageScale,
                        },
                    ],
                }}
                // resizestate={Image.resizeMode.cover}
                source={{ uri: imgUri }}
            />
            <LinearGradient
                colors={['rgba(255,255,255,0.4)', 'transparent', 'transparent']}
                style={styles.gradientOverlay}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    header: {
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        position: 'absolute',
        backgroundColor: 'white',
        zIndex: 10,
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        zIndex: 11,
    }
});
export default Header;