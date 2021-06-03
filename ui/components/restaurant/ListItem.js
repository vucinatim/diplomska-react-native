import React, { useRef } from 'react';
import {
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    Animated,
    View,
    Image,
    Easing,
} from 'react-native';
import { currencyFormatter } from '../../utils/Helpers';
import IconButton from './IconButton';

const ListItem = (props) => {
    const { item, priceColor, isExpanded, onPress } = props;
    const formattedPrice = currencyFormatter(item.price);
    const animation = useRef(new Animated.Value(!!isExpanded ? 1 : 0)).current;

    Animated.timing(animation, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,           // <-- animation duration
        easing: Easing.inOut(Easing.ease),   // <-- or any easing function
        useNativeDriver: false   // <-- need to set false to prevent yellow box warning
    }).start();

    const expandedImage = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200],
        extrapolate: 'clamp',
    });

    const iconTranslate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 0],
        extrapolate: 'clamp',
    });

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={{ marginVertical: 2 }}>
                <Animated.View style={{ height: expandedImage, opacity: animation, width: '100%', overflow: 'hidden' }}>
                    <Image style={styles.expandedImage} source={{ uri: item.image }} />
                    <IconButton
                        style={{
                            backgroundColor: 'lightgray',
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            transform: [{ translateY: iconTranslate }],
                        }}
                        name='close'
                        onPress={onPress} />
                </Animated.View>
                <View style={styles.listItem}>
                    <View style={styles.infoContainer}>
                        <Text numberOfLines={2} style={styles.itemName}>{item.name}</Text>
                        <Text numberOfLines={isExpanded ? 3 : 2} style={styles.description}>{item.description}</Text>
                        <Text numberOfLines={2} style={{ color: isExpanded ? priceColor : 'black', marginBottom: 3, }}>{formattedPrice}</Text>
                    </View>
                    <Animated.Image
                        style={[
                            styles.image, {
                                width: isExpanded ? 0 : 80,
                                height: 80
                            }
                        ]}
                        source={{ uri: item.image }} />
                </View>
                <Animated.View style={{ backgroundColor: 'lightgray', flexGrow: 1, height: animation, opacity: 0.5, marginTop: 3 }} />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    listItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    infoContainer: {
        flexShrink: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    description: {
        fontSize: 12,
        color: '#979799',
        marginBottom: 3,
    },
    image: {
        marginLeft: 5,
        resizeMode: 'cover',
        height: 80,
        width: 80,
        borderRadius: 10,
    },
    expandedImage: {
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
    },
});

export default ListItem;