import React, { useState, useRef, useEffect } from 'react';
import MapView from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useTheme } from '@react-navigation/native';
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
} from 'react-native';

import IconButton from './IconButton';
import OptionsButton from './OptionsButton';
import { MIN_HEADER_HEIGHT } from './Menu';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export default function RestaurantDetails(props) {
    const { restaurant } = props.route.params
    const animation = useRef(new Animated.Value(0)).current;
    const [scrollY, setScrollY] = useState(new Animated.Value(0))
    const { colors } = useTheme();

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

    const parseTime = (day) => {
        let opens = day.opens_at.toString().substring(0, 2) + ':' + day.opens_at.toString().substring(2, 4)
        let closes = day.closes_at.toString().substring(0, 2) + ':' + day.closes_at.toString().substring(2, 4)
        return opens + ' - ' + closes
    }

    const contactInfoTile = (onPress, leading, trailing) => {
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
                <Text style={{ fontSize: 14 }}>{leading}</Text>
                <Text style={{ color: colors.primary, fontSize: 14 }}>{trailing}</Text>
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
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton
                        name='arrow-back'
                        onPress={() => props.navigation.goBack()}
                        style={{ backgroundColor: 'lightgray', transform: [{ scale: animation }] }}
                    />
                    <Animated.View style={{
                        opacity: appBarTitleOpacity,
                        transform: [{ translateY: appBarTitleTranslate }],
                    }} >
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 16 }}>{restaurant.name}</Text>
                    </Animated.View>
                </View>
                <OptionsButton
                    icon='more-vert'
                    style={{ backgroundColor: 'lightgray', transform: [{ scale: animation }] }}
                    options={[
                        {
                            text: 'Call restaurant',
                            onPress: () => console.log('call')
                        },
                        {
                            text: 'Visit web page',
                            onPress: () => console.log('web page')
                        }
                    ]}
                />
            </Animated.View>
            <ScrollView
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
                    }}>{restaurant.name}</Text>
                    <Text style={{
                        fontSize: 16,
                        marginTop: 20,
                    }}>{restaurant.description}</Text>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginTop: 40,
                    }}>{'Address'}</Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10,
                    }}>
                        <View>
                            <Text>{restaurant.contact_info.address}</Text>
                            <Text>{restaurant.contact_info.post_number + ' ' + restaurant.contact_info.city}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => console.log('Getting directions')}
                            style={{ padding: 10 }}
                        >
                            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{'Get Directions'}</Text>
                        </TouchableOpacity>
                    </View>
                    <MapView style={{ height: 250, width: '100%', marginTop: 20 }}
                        initialRegion={{
                            latitude: restaurant.contact_info.location.latitude,
                            longitude: restaurant.contact_info.location.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude: restaurant.contact_info.location.latitude,
                                longitude: restaurant.contact_info.location.longitude,
                            }}
                            title={restaurant.name}
                        />
                    </MapView>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginTop: 40,
                        marginBottom: 10,
                    }}>{'Opening Hours'}</Text>
                    <View style={{ paddingHorizontal: 15, marginTop: 5 }}>
                        {DAYS.map((day) => {
                            return <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 5,
                            }}>
                                <Text style={{ color: 'gray' }}>{day}</Text>
                                <Text style={{ color: 'gray' }}>{parseTime(restaurant.open_hours[day])}</Text>
                            </View>
                        })}
                    </View>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginTop: 40,
                        marginBottom: 10,
                    }}>{'Contact Info'}</Text>
                </View>
                {contactInfoTile(() => console.log('call'), 'Restaurant Phone', restaurant.contact_info.phone)}
                <View style={{ backgroundColor: 'lightgray', flexGrow: 1, height: 1, opacity: 0.5 }} />
                {contactInfoTile(() => console.log('website'), 'Web Site', 'Open web site')}
                <View style={{ backgroundColor: 'lightgray', flexGrow: 1, height: 1, opacity: 0.5 }} />
                {contactInfoTile(() => console.log('support'), 'Web Menu Support', 'Chat with us')}
                <View style={{ height: 20 }}></View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
