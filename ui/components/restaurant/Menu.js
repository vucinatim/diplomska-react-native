import React, { useState, useEffect } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useTheme } from '@react-navigation/native';
import {
    Animated,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Easing,
    FlatList,
} from 'react-native';

import Header from './Header';
import ListItem from './ListItem';
import IconButton from './IconButton';
import OptionsButton from './OptionsButton';

import firebase from 'firebase'
require('firebase/firestore')

export const MAX_HEADER_HEIGHT = 200 + StatusBar.currentHeight;
export const MIN_HEADER_HEIGHT = 60 + StatusBar.currentHeight;
export const TAB_HEADER_HEIGHT = 50;

const ListHeader = (restaurant, navigation) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.listHeader, { marginTop: MAX_HEADER_HEIGHT }]}>
            <View style={{ marginVertical: 20 }}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{restaurant.name}</Text>
                    <MaterialIcons name='favorite-outline' size={23} color={colors.primary} style={styles.favoriteIcon} />
                </View>
                <Text numberOfLines={2} style={{ marginBottom: 20 }}>{restaurant.description}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name='access-time' size={16} />
                        <Text style={{ marginLeft: 5 }}>{'Open • Closes at 22:00'}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('RestaurantDetails', { restaurant })} style={{ backgroundColor: colors.border, borderRadius: 5, padding: 5 }}>
                        <Text style={{ fontSize: 13, color: colors.primary }}>{'More Info'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ backgroundColor: 'lightgray', flexGrow: 1, height: 1, opacity: 0.5 }} />
        </View>
    );
};

export default function Menu(props) {
    const [restaurant, setRestaurant] = useState([])
    const [menu, setMenu] = useState([])
    const [expandedItem, setExpandedItem] = useState([])
    const [selectedTab, setSelectedTab] = useState([])
    const [listRef, setListRef] = useState(null);
    const [tabBarRef, setTabBarRef] = useState(null);
    const [isScrollListenerLocked, setIsScrollListenerLocked] = useState(false);
    const [scrollY, setScrollY] = useState(new Animated.Value(0))
    const { colors } = useTheme();

    useEffect(() => {
        firebase.firestore()
            .collection('restaurants')
            .doc(props.route.params.id)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let result = snapshot.data()
                    firebase.firestore()
                        .collection('restaurants')
                        .doc(props.route.params.id)
                        .collection('menu-items')
                        .get()
                        .then((snapshot) => {
                            let itemsResult = snapshot.docs.map(doc => {
                                const data = doc.data()
                                const id = doc.id
                                return { id, ...data }
                            })
                            let menu = []
                            for (let categoryIndex in result.menu) {
                                let category = result.menu[categoryIndex]
                                let menuItem = {
                                    title: category.category,
                                    data: [],
                                }
                                for (let itemRefIndex in category.items) {
                                    let itemRef = category.items[itemRefIndex]
                                    menuItem.data.push(itemsResult.find(item => item.id === itemRef.id))
                                }
                                menu.push(menuItem)
                            }
                            setMenu(menu)
                        })
                    setRestaurant(snapshot.data())
                }
            })
    }, [props.route.params.id])

    const scrollDistance = MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT;

    const appBarTitleTranslate = scrollY.interpolate({
        inputRange: [scrollDistance, MAX_HEADER_HEIGHT - StatusBar.currentHeight],
        outputRange: [10, 0],
        extrapolate: 'clamp',
        easing: Easing.inOut(Easing.ease),
    });

    const appBarTitleOpacity = scrollY.interpolate({
        inputRange: [scrollDistance, MAX_HEADER_HEIGHT - StatusBar.currentHeight],
        outputRange: [0, 1],
        extrapolate: 'clamp',
        easing: Easing.inOut(Easing.ease),
    });

    const iconTranslate = scrollY.interpolate({
        inputRange: [scrollDistance, MAX_HEADER_HEIGHT - StatusBar.currentHeight],
        outputRange: [0, 39],
        extrapolate: 'clamp',
        easing: Easing.inOut(Easing.poly(3))
    });

    const iconScale = scrollY.interpolate({
        inputRange: [scrollDistance, MAX_HEADER_HEIGHT - StatusBar.currentHeight],
        outputRange: [1, 0],
        extrapolate: 'clamp',
        easing: Easing.out(Easing.sin),
    });

    const iconOpacity = scrollY.interpolate({
        inputRange: [scrollDistance, MAX_HEADER_HEIGHT - StatusBar.currentHeight],
        outputRange: [1, 0],
        extrapolate: 'clamp',
        easing: Easing.inOut(Easing.ease),
    });

    const iconBackground = scrollY.interpolate({
        inputRange: [0, scrollDistance],
        outputRange: ['white', 'lightgray'],
        extrapolate: 'clamp',
    });

    const tabBarTranslate = scrollY.interpolate({
        inputRange: [MAX_HEADER_HEIGHT - TAB_HEADER_HEIGHT, MAX_HEADER_HEIGHT],
        outputRange: [0, MIN_HEADER_HEIGHT - StatusBar.currentHeight],
        extrapolate: 'clamp',
        easing: Easing.inOut(Easing.ease),
    });

    const tabBarOpacity = scrollY.interpolate({
        inputRange: [MAX_HEADER_HEIGHT - (TAB_HEADER_HEIGHT / 2), MAX_HEADER_HEIGHT],
        outputRange: [0, 1],
        extrapolate: 'clamp',
        easing: Easing.inOut(Easing.ease),
    });

    const _onScroll = (event) => {
        // console.log(event.nativeEvent.contentOffset.y);
    }

    const viewabilityConfig = {
        waitForInteraction: true,
        viewAreaCoveragePercentThreshold: 100
    }

    const onViewableItemsChanged = ({ viewableItems }) => {
        // viewableItems will show you what items are in view
        if (isScrollListenerLocked)
            return
        if (viewableItems !== 'undefined' && viewableItems.length > 0) {
            if (viewableItems[0].index == null) {
                if (selectedTab !== viewableItems[0].item.title) {
                    setSelectedTab(viewableItems[0].item.title)
                    let index = menu.indexOf(viewableItems[0].item)
                    if (index > 0) {
                        index--;
                    }
                    tabBarRef.scrollToIndex({ animated: true, index: index })
                }
            }
        }
    }

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false, listener: _onScroll.bind(this) }
    );

    const renderListItem = ({ item }) => {
        let isExtended = (expandedItem !== 'undefined' && expandedItem.id === item.id) ? true : false;
        return <ListItem
            item={item}
            priceColor={colors.primary}
            isExpanded={isExtended}
            onPress={() => {
                if (expandedItem !== 'undefined' && expandedItem.id === item.id) {
                    setExpandedItem('undefined')
                } else {
                    setExpandedItem(item)
                }
            }} />;
    };

    if (restaurant === 'undefined' || menu === 'undefined') {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator />
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            {/* <StatusBar backgroundColor="#1c1c1c" style="light" /> */}
            <View style={{ zIndex: 10 }}>
                <Header {...{ imgUri: restaurant.header_img, scrollY }} />
            </View>
            <Animated.View style={{
                position: 'absolute',
                top: StatusBar.currentHeight,
                left: 0,
                right: 0,
                height: TAB_HEADER_HEIGHT,
                zIndex: 11,
                opacity: tabBarOpacity,
                transform: [{ translateY: tabBarTranslate }],
            }}>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={menu}
                    ref={(ref) => {
                        setTabBarRef(ref);
                    }}
                    contentContainerStyle={{
                        flexGrow: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 10,
                    }}
                    renderItem={({ item, index }) => {
                        let isSelected = selectedTab !== 'undefined' && selectedTab === item.title
                        return <TouchableOpacity
                            key={index}
                            onPress={() => {
                                setIsScrollListenerLocked(true)
                                setTimeout(function () {
                                    setIsScrollListenerLocked(false);
                                }, 400);
                                listRef.scrollToLocation({
                                    sectionIndex: index,
                                    itemIndex: 0,
                                    viewOffset: MIN_HEADER_HEIGHT + StatusBar.currentHeight,
                                    animated: true,
                                });
                                setSelectedTab(item.title)
                                tabBarRef.scrollToIndex({ animated: true, index: index })
                            }}>
                            <View style={{
                                marginHorizontal: 3,
                                borderRadius: 90,
                                backgroundColor: isSelected ? colors.border : 'white',
                                borderRadius: 30,
                            }} >
                                <Text style={{
                                    textTransform: 'uppercase',
                                    fontWeight: '700',
                                    fontSize: 14,
                                    paddingVertical: 5,
                                    paddingHorizontal: 9,
                                    color: isSelected ? colors.primary : 'gray',
                                }}>{item.title}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    }
                />
            </Animated.View>
            <View style={[styles.utilRow]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton
                        style={{ backgroundColor: iconBackground }}
                        name='arrow-back'
                        onPress={() => props.navigation.goBack()} />
                    <Animated.View style={{
                        opacity: appBarTitleOpacity,
                        transform: [{ translateY: appBarTitleTranslate }],
                    }} >
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 16 }}>{restaurant.name}</Text>
                    </Animated.View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Animated.View style={{
                        transform: [{ translateX: iconTranslate }],
                    }} >
                        <IconButton
                            style={{ backgroundColor: iconBackground }}
                            name='search'
                            onPress={() => props.navigation.navigate('SearchMenu', { menu })}
                        />
                    </Animated.View>
                    <Animated.View style={{
                        marginLeft: 7,
                        opacity: iconOpacity,
                        transform: [{ scale: iconScale }],
                    }} >
                        <OptionsButton
                            icon='more-vert'
                            options={[
                                {
                                    text: 'More info about ' + restaurant.name,
                                    onPress: () => console.log('more info')
                                },
                                {
                                    text: 'Choose adifferent language',
                                    onPress: () => console.log('language')
                                }
                            ]}
                        />
                        {/* <IconButton
                            style={{ backgroundColor: iconBackground }}
                            name='more-vert'
                            onPress={() => console.log('Icon Pressed')} /> */}
                    </Animated.View>
                </View>
            </View>
            <Animated.SectionList
                ref={(ref) => {
                    setListRef(ref);
                }}
                showsVerticalScrollIndicator={false}
                sections={menu}
                viewabilityConfig={viewabilityConfig}
                onViewableItemsChanged={onViewableItemsChanged}
                keyExtractor={(item, index) => item + index}
                renderItem={renderListItem}
                renderSectionHeader={({ section }) => {
                    const index = menu.indexOf(section);
                    return <Text style={[
                        styles.categoryName,
                        {
                            marginTop: index == 0 ? 10 : 30,
                            marginBottom: 6
                        }
                    ]}>{section.title}</Text>
                }}
                scrollEventThrottle={16}
                onScroll={handleScroll}
                ListHeaderComponent={ListHeader(restaurant, props.navigation)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listHeader: {
        marginHorizontal: 16,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    title: {
        fontSize: 29,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    utilRow: {
        marginTop: StatusBar.currentHeight,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        zIndex: 99,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
    },
    categoryName: {
        marginHorizontal: 16,
        fontSize: 22,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    }
});
