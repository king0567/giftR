import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { Button, FlatList, View, Text, SafeAreaView, Pressable, Image, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import PeopleContext from "../PeopleContext";

export default function PeopleScreen() {
    const navigation = useNavigation();

    const { people, removePerson } = useContext(PeopleContext);
    people.sort((a, b) => {
        const aDate = new Date(a.dob)
        const bDate = new Date(b.dob)
        console.log(aDate, bDate)
        if (aDate > bDate) {
            return 1
        } else if (aDate < bDate) {
            return -1
        } else {
            return 0
        }
    })

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                {people.length === 0 && <View style={styles.listItem}>
                    <Text>No People Saved Yet</Text>
                </View>}
                {people.length > 0 && <FlatList
                    data={people}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <View>
                                <Text>{item.name}</Text>
                                <Text>Birthday: {item.dob}</Text>
                            </View>
                            <View>
                                <Pressable onPress={() => removePerson(item.id)}>
                                    <Image
                                        source={require('../assets/light-bulb-15.png')}
                                        style={{
                                            width: 40,
                                            height: 40,
                                        }}
                                    />
                                </Pressable>
                                <Pressable onPress={() => removePerson(item.id)}>
                                    <Image
                                        source={require('../assets/light-bulb-15.png')}
                                        style={{
                                            width: 40,
                                            height: 40,
                                        }}
                                    />
                                </Pressable>
                            </View>
                        </View>
                    )}
                />}
            </SafeAreaView>
            <Pressable
                style={styles.FAB}
                onPress={() => navigation.navigate("AddPerson")}
            >
                <Text style={styles.FABText}>Add Another Person</Text>
            </Pressable>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        margin: 10,
        gap: 10
    },
    FAB: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 300,
        position: 'absolute',
        bottom: 70,
        right: 40,
        backgroundColor: '#1d6ff2',
        elevation: 8,
        padding: 8
    },
    FABText: {
        fontSize: 15,
        color: "#fff"
    }

});
