import * as React from 'react'
import {Text,View,ScrollView,StyleSheet,Image, FlatList} from 'react-native'
import { useEffect,useState, useCallback,useMemo } from 'react'
import styles,{colors} from '../assets/styles'
import { SearchBar } from 'react-native-screens'
import debounce from 'lodash.debounce';
import AsyncStorage from '@react-native-async-storage/async-storage'


import { createTable, saveMenuItems,
    filterByQueryAndCategories, getMenuItems
 } from '../Database'




//importing components
import HomeHeader from '../components/HomeHeader'
import Filters from '../components/Filters'
import { getSectionListData,calculateImageText,useUpdateEffect } from '../utils/validate'
//constants
const sections = ['Starters', 'Mains', 'Desserts', 'Drinks'];

const Separator = () => <View style={menuStyles.separator}></View>
const Item = ({ name, price, description, image }) => {
    return (
        <View style={menuStyles.itemContainer}>
            <View style={{ flex: 0.9 }}>
                <Text style={menuStyles.cardTitle}>{name}</Text>
                <Text style={menuStyles.cardParagraph} numberOfLines={2}>{description}</Text>
                <Text style={menuStyles.highlightedText}>${price}</Text>
            </View>
            <Image
                source={{ uri: image }}
                resizeMode='contain'
                accessible={true}
                accessibilityLabel={'Menu item image'}
                style={menuStyles.cardImage}
            />
        </View>
    );
}


export default function Home({navigation}){


    //app logic section

    //the rendering section of the list
    const renderItem = ({ item }) => <Item name={item.name} price={item.price} description={item.description} image={item.imageFileName} />


    //hooks
    const [imageText, setImageText] = React.useState('');
    const [imagePath, setImagePath] = React.useState('');
    const [menuItems, setMenuItems] = React.useState([]);

    const [filterSelections, setFilterSelections] = React.useState(
        sections.map(() => false)
    );

    //search bar hooks
    const [searchBarText, setSearchBarText] = React.useState('');
    const [query, setQuery] = React.useState('');

    function goToProfile() {
        navigation.navigate('user Profile');
    }
    function goToHome() {
    }

    //just throwing the get user data incase I need it 
    React.useEffect(() => {
        (async () => {
            try {
                let loadedUserData = await AsyncStorage.getItem("userData");
                if (loadedUserData != null) {
                    loadedUserData = JSON.parse(loadedUserData);
                    if (loadedUserData.firstName) firstName = loadedUserData.firstName;
                    if (loadedUserData.lastName) lastName = loadedUserData.lastName;
                    if (loadedUserData.imagePath) setImagePath(loadedUserData.imagePath);
                    setImageText(calculateImageText(loadedUserData.imagePath, loadedUserData.lastName, loadedUserData.firstName));
                }

                await createTable();
                let dbMenuItems = await getMenuItems();
                // The application only fetches the menu data once from a remote URL
                // and then stores it into a SQLite database.
                // After that, every application restart loads the menu from the database
                if (!dbMenuItems.length) {
                    dbMenuItems = await fetchData();
                    await saveMenuItems(dbMenuItems);
                    console.log('From URL');
                }
                else {
                    console.log('From DB');
                }
                setMenuItems(dbMenuItems);
            }
            catch (err) { console.log(err); }
        })();
    }, []);


    useUpdateEffect(() => {
        (async () => {
            const activeCategories = sections.filter((s, i) => {
                // If all filters are deselected, all categories are active
                if (filterSelections.every((item) => item === false)) {
                    return true;
                }
                return filterSelections[i];
            });
            try {
                const dbMenuItems = await filterByQueryAndCategories(
                    query,
                    activeCategories
                );
                setMenuItems(getSectionListData(dbMenuItems));
            } catch (e) {
                console.log(e.message);
            }
        })();
    }, [filterSelections, query]);

    const lookup = useCallback((q) => {
        setQuery(q);
    }, []);

    const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);


    //handelers
    const handleSearchChange = (text) => {
        setSearchBarText(text);
        debouncedLookup(text);
    };

    const handleFiltersChange = async (index) => {
        const arrayCopy = [...filterSelections];
        arrayCopy[index] = !filterSelections[index];
        setFilterSelections(arrayCopy);
    };

    //fetching data
    const fetchData = async () => {
        // 1. Implement this function

        // Fetch the menu from the API_URL endpoint. You can visit the API_URL in your browser to inspect the data returned
        // The category field comes as an object with a property called "title". You just need to get the title value and set it under the key "category".
        // So the server response should be slighly transformed in this function (hint: map function) to flatten out each menu item in the array,
        try {
            const response = await fetch("https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json");
            const json = await response.json();
            let id = 1;
            return json.menu.map((item) => {
                item.imageFileName = "https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/" + item.image + "?raw=true";
                item.id = id;
                id++;
                return item;
            });
        }
        catch (err) { console.log(err); return []; }
    }
    //taken straigt from that old exercise


    //======rendering section=======
    return(
        <View style={{ flex: 1,
            paddingVertical: 40,
            paddingHorizontal: 20,
            backgroundColor: 'white'}}>

                <HomeHeader imagePath={imagePath} imageText={imageText} goToProfile={goToProfile} />

                <View style={stylesOhome.heroSection}>
                 <Text style={stylesOhome.heroTitle}>Little Lemon</Text>
                 <Text style={styles.subTitle}>Chicago</Text>
                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 }}>
                    <Text style={styles.lead}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
                    <Image
                        source={require('../assets/Hero image.png')}
                        resizeMode='contain'
                        accessible={true}
                        accessibilityLabel={'Chef cooking in little lemon'}
                        style={stylesOhome.heroImage}
                    />
                </View>
                <SearchBar
                    placeholder="Search"
                    placeholderTextColor={colors.secondaryDarkGrey}
                    onChangeText={handleSearchChange}
                    value={searchBarText}
                    style={stylesOhome.searchBar}
                    iconColor={colors.secondaryDarkGrey}
                    inputStyle={{ color: colors.secondaryDarkGrey }}
                    elevation={0}
                />
            </View>
            <View style={{ padding: 10, marginTop: 20 }}>
                <Text style={styles.sectionTitle}>ORDER FOR DELIVERY! </Text>
            </View>
            <Filters
                selections={filterSelections}
                onChange={handleFiltersChange}
                sections={sections}
            />
            <FlatList
                keyExtractor={item => item.id}
                data={menuItems}
                renderItem={renderItem}
                ItemSeparatorComponent={Separator}
                style={menuStyles.container} />

        </View>
    );

}

const stylesOhome = StyleSheet.create({
    heroSection: {
        padding: 20,
        paddingHorizontal: 10,
        backgroundColor: colors.primaryGreen,
    },
    heroTitle: {
        fontWeight: 'medium',
        fontSize: 40,
        color: colors.primaryYellow
    },
    heroImage: {
        width: 140,
        height: 150,
        borderRadius: 16,
    },
    searchBar: {
        marginVertical: 10,
        backgroundColor: 'white',
        shadowRadius: 0,
        shadowOpacity: 0,
        borderRadius: 8,
    },
})
const menuStyles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 10
    },
    cardTitle: {
        color: "black",
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
    },
    cardParagraph: {
        color: colors.primaryGreen,
        fontSize: 16,
        fontWeight: 'regular',
        marginBottom: 10
    },
    highlightedText: {
        color: colors.primaryGreen,
        fontSize: 16,
        fontWeight: 'semibold',
    },
    itemContainer: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#EDEFEE'
    },
    cardImage: {
        width: 100,
        height: 100
    }
});