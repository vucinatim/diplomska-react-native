import React, { useState, useRef, useEffect } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Animated,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Easing,
    ScrollView,
    FlatList,
    useWindowDimensions,
} from 'react-native';

import IconButton from '../restaurant/IconButton';
import { MIN_HEADER_HEIGHT } from '../restaurant/Menu';

import firebase from 'firebase'

export default function Profile(props) {
    // const { user } = props.route.params
    const user = {
        name: 'Tim Vucina',
        email: 'tim.vucina@gmail.com',
        favorites: [1, 2, 3],
    }
    const animation = useRef(new Animated.Value(0)).current;
    const [scrollRef, setScrollRef] = useState(null);
    const [scrollY, setScrollY] = useState(new Animated.Value(0))
    const { colors } = useTheme();

    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;

    Animated.timing(animation, {
        toValue: 1,
        duration: 600,           // <-- animation duration
        easing: Easing.elastic(),   // <-- or any easing function
        useNativeDriver: false   // <-- need to set false to prevent yellow box warning
    }).start();

    const appBarElevation = scrollY.interpolate({
        inputRange: [0, MIN_HEADER_HEIGHT],
        outputRange: [0, 10],
        extrapolate: 'clamp',
        easing: Easing.inOut(Easing.ease),
    });

    const appBarColor = scrollY.interpolate({
        inputRange: [0, MIN_HEADER_HEIGHT],
        outputRange: [colors.background, 'white'],
        extrapolate: 'clamp',
        easing: Easing.inOut(Easing.ease),
    });

    const appBarTitleTranslate = scrollY.interpolate({
        inputRange: [0, MIN_HEADER_HEIGHT],
        outputRange: [10, 0],
        extrapolate: 'clamp',
        easing: Easing.inOut(Easing.ease),
    });

    const appBarTitleOpacity = scrollY.interpolate({
        inputRange: [0, MIN_HEADER_HEIGHT],
        outputRange: [0, 1],
        extrapolate: 'clamp',
        easing: Easing.inOut(Easing.ease),
    });

    const getInitials = (fullName) => {
        let words = fullName?.split(' ');
        if (words === 'undefined') {
            return '??';
        } else if (words.length == 1) {
            if (words.first.length > 1) {
                return words[0][0] + words[0][1]
            } else {
                return '??';
            }
        } else {
            return words[0][0] + words[1][0]
        }
    }

    const quickLinkTile = (onPress, title, leading, trailing) => {
        return (
            <TouchableOpacity
                onPress={onPress}
                style={{
                    paddingVertical: 16,
                    marginHorizontal: 16,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons name={leading} size={16} color={'gray'} />
                    <Text style={{ fontSize: 14, colors: 'gray', marginLeft: 20 }}>{title}</Text>
                </View>
                {trailing && <MaterialIcons name={trailing} size={16} color={'gray'} />}
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: MIN_HEADER_HEIGHT,
                backgroundColor: appBarColor,
                paddingTop: StatusBar.currentHeight,
                paddingHorizontal: 16,
                elevation: appBarElevation,
            }}>
                <Animated.View style={{
                    opacity: appBarTitleOpacity,
                    transform: [{ translateY: appBarTitleTranslate }],
                }} >
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 16 }}>{'Profile'}</Text>
                </Animated.View>
                <IconButton
                    style={{ backgroundColor: 'lightgray' }}
                    name='settings'
                    onPress={() => { scrollRef.scrollToEnd({ animated: true }) }} />
            </Animated.View>
            <ScrollView
                ref={(ref) => {
                    setScrollRef(ref);
                }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                <View style={{ marginHorizontal: 16 }}>
                    <Text style={{
                        fontSize: 30,
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                        marginTop: 20,
                    }}>{'Hello ' + user.name?.split(' ')[0]}</Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                    }}>

                        <View style={{
                            borderRadius: 999,
                            overflow: 'hidden',
                            height: 80,
                            width: 80,
                            flexShrink: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <LinearGradient
                                colors={[colors.primary, colors.border]}
                                style={styles.gradientOverlay}
                            />
                            <Text style={{
                                color: 'white',
                                fontSize: 37,
                                fontWeight: '500'
                            }}>{getInitials(user.name)}</Text>
                        </View>
                        <View style={{ marginLeft: 20 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{user.name}</Text>
                            <Text style={{ color: 'gray', fontSize: 12 }}>{user.email}</Text>
                        </View>
                    </View>
                    <View style={{ borderRadius: 10, elevation: 5, backgroundColor: 'white', marginVertical: 20, padding: 16 }}>
                        <Text>{'Invite friends and earn bonus credit points'}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 20 }}>
                            <TouchableOpacity
                                onPress={() => console.log('Hide invite card')}
                                style={{ paddingRight: 10 }}
                            >
                                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{'Hide'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => console.log('Send invite')}
                            >
                                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{'Send Invite'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}>{'Your Favorites'}</Text>
                        <TouchableOpacity
                            onPress={() => console.log('Show all favorites')}
                            style={{ backgroundColor: colors.border, borderRadius: 5, padding: 5 }}>
                            <Text style={{ fontSize: 13, color: colors.primary }}>{'Show All'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList
                    style={{ marginTop: 10, paddingLeft: 16 }}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={user.favorites}
                    contentContainerStyle={{ paddingRight: 26 }}
                    // ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                    renderItem={({ item, index }) => {
                        return <TouchableOpacity
                            key={index}
                            onPress={() => props.navigation.navigate('Menu', { id: item.id })}
                            style={{
                                height: 180,
                                width: (windowWidth - 32 - 6) / 2,
                                backgroundColor: 'white',
                                marginTop: 2,
                                marginBottom: 8,
                                marginRight: 6,
                                overflow: 'hidden',
                                borderRadius: 10,
                                elevation: 3,
                            }}
                        >

                            <Text style={{ height: 100, backgroundColor: 'green' }}>{'ITEM'}</Text>
                        </TouchableOpacity>
                    }
                    }
                />
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginTop: 20,
                    marginHorizontal: 16,
                    marginBottom: 10,
                }}>{'Quick Links'}</Text>
                {quickLinkTile(() => console.log('Settings'), 'Settings', 'settings', 'keyboard-arrow-right')}
                <View style={{ backgroundColor: 'lightgray', flexGrow: 1, height: 1, opacity: 0.5 }} />
                {quickLinkTile(() => console.log('Customer Support'), 'Customer Support', 'help', 'keyboard-arrow-right')}
                <View style={{ backgroundColor: 'lightgray', flexGrow: 1, height: 1, opacity: 0.5 }} />
                {quickLinkTile(() => console.log('Report a Bug'), 'Report a Bug', 'bug-report', 'keyboard-arrow-right')}
                <View style={{ backgroundColor: 'lightgray', flexGrow: 1, height: 1, opacity: 0.5 }} />
                {quickLinkTile(() => firebase.auth().signOut(), 'Logout', 'logout')}
                <View style={{ height: 20 }}></View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
    }
});
