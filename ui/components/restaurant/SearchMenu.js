import React, { useState, useRef } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useTheme } from '@react-navigation/native';
import {
    Animated,
    TextInput,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Easing,
} from 'react-native';

import ListItem from './ListItem';
import IconButton from './IconButton';

import { MIN_HEADER_HEIGHT } from './Menu';

export default function SearchMenu(props) {
    const [menu, setMenu] = useState(props.route.params.menu)
    const [expandedItem, setExpandedItem] = useState([])
    const [searchEntry, setSearchEntry] = useState('');
    const { colors } = useTheme();

    const animation = useRef(new Animated.Value(0)).current;

    Animated.timing(animation, {
        toValue: 1,
        duration: 600,           // <-- animation duration
        easing: Easing.elastic(),   // <-- or any easing function
        useNativeDriver: false   // <-- need to set false to prevent yellow box warning
    }).start();

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

    return (
        <SafeAreaView style={styles.container}>

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: MIN_HEADER_HEIGHT,
                backgroundColor: 'white',
                paddingTop: StatusBar.currentHeight,
                paddingHorizontal: 16,
                elevation: 6,
            }}>
                <IconButton
                    name='arrow-back'
                    onPress={() => props.navigation.goBack()}
                    style={{ transform: [{ scale: animation }] }}
                />
                <TextInput
                    value={searchEntry}
                    style={styles.searchInput}
                    placeholder="Search..."
                    onChangeText={(search) => {
                        let entry = search.toLowerCase()
                        let filteredMenu = []
                        for (const ci in props.route.params.menu) {
                            let category = props.route.params.menu[ci]
                            let filteredCategoryItems = category.data.filter((item) => {
                                if (item.name.toLowerCase().includes(entry)) {
                                    return true
                                }
                            })
                            if (filteredCategoryItems.length > 0) {
                                filteredMenu.push({ title: category.title, data: filteredCategoryItems })
                            }
                        }
                        setSearchEntry(entry)
                        setMenu(filteredMenu)
                    }}
                />
                <IconButton
                    name={'cancel'}
                    color={searchEntry.length === 0 ? 'lightgray' : 'black'}
                    style={{ backgroundColor: 'transparent', transform: [{ scale: animation }] }}
                    onPress={() => {
                        setSearchEntry('')
                        setMenu(props.route.params.menu)
                    }} />
            </View>

            <Animated.SectionList
                showsVerticalScrollIndicator={false}
                sections={menu}
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
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchInput: {
        height: 40,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginHorizontal: 16,
        flexGrow: 1,
    },
    categoryName: {
        marginHorizontal: 16,
        fontSize: 22,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    }
});
