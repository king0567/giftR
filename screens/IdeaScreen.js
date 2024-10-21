import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { FlatList, View, Text, SafeAreaView, Pressable, Image, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import PeopleContext from "../PeopleContext";

export default function IdeaScreen({ route }) {
    const navigation = useNavigation();

    const [ideas, setIdeas] = useState([])
    const [refresh, setRefresh] = useState(0)

    const { id } = route.params

    const { getIdeas, removeIdea, people } = useContext(PeopleContext);

    const person = people.filter(person => person.id === id)[0]

    useEffect(() => {
        getPersonIdeas(id)
    }, [refresh])

    async function getPersonIdeas(id) {
        const personIdeas = await getIdeas(id)
        setIdeas(personIdeas)
    }

    async function deleteIdea(itemId) {
        await removeIdea(id, itemId)
        setRefresh(refresh + 1)
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Text>{person.name}</Text>
                {ideas.length === 0 && <View style={styles.listItem}>
                    <Text>No Ideas Yet</Text>
                </View>}
                {ideas.length > 0 && <FlatList
                    data={ideas}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <Image source={{ uri: item.imgURI }} style={{
                                width: 200 * (item.width / item.height),
                                height: 200
                            }} />
                            <View>
                                <Text>{item.text}</Text>
                            </View>
                            <View style={styles.iconDiv}>
                                <Pressable style={styles.icons} onPress={() => deleteIdea(item.id)}>
                                    <Image
                                        source={require('../assets/trash.png')}
                                        style={{
                                            width: 30,
                                            height: 35,
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
                onPress={() => navigation.navigate("Add Ideas", { id: id })}
            >
                <Text style={styles.FABText}>Add An Idea</Text>
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
    },
    iconDiv: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    icons: {
        paddingLeft: 10
    }

});
