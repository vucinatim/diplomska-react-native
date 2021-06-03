import React, { useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useTheme } from '@react-navigation/native';
import {
    FlatList,
    TextInput,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image
} from 'react-native';

import { fetchRestaurants } from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const ListHeader = () => {
    return (
        <View style={styles.headerStyle}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search..."
                onChangeText={(search) => props.fetchRestaurants(search)} />
        </View>
    );
};

const ITEM_HEIGHT = 200
const Item = ({ item, onPress, style, color }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
        <Image style={styles.image} source={{ uri: item.thumbnail }} />
        <View style={styles.infoContainer}>
            <Text style={styles.title}>{item.name}</Text>
            <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
            <View style={styles.location}>
                <MaterialIcons name='location-pin' style={styles.locationText} />
                <Text style={styles.locationText}>{item.contact_info.city}</Text>
            </View>
        </View>
        <MaterialIcons name='favorite-outline' size={23} color={color} style={styles.favoriteIcon} />
    </TouchableOpacity>
);

function Restaurants(props) {
    const { restaurants } = props
    const { colors } = useTheme();

    const renderItem = ({ item }) => {
        return <Item item={item} onPress={() => props.navigation.navigate('Menu', { id: item.id })} color={colors.primary} />;
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={restaurants}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ListHeaderComponent={ListHeader}
                stickyHeaderIndices={[0]}
                getItemLayout={(data, index) => (
                    { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
                )}
            />
        </SafeAreaView>
    );
}

const mapStateToProps = (store) => ({
    restaurants: store.restaurantsState.restaurants
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchRestaurants }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Restaurants)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    headerStyle: {
        width: '100%',
        justifyContent: 'center',
    },
    searchBar: {
        height: 40,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginHorizontal: 16,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 7,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    item: {
        marginVertical: 5,
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        resizeMode: 'cover',
        width: 69,
        height: 69,
        borderRadius: 10,
        marginRight: 10
    },
    infoContainer: {
        flexShrink: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 12,
    },
    location: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    locationText: {
        marginTop: 3,
        fontSize: 12,
        color: '#888'
    },
    favoriteIcon: {
        marginLeft: 5
    }
});
