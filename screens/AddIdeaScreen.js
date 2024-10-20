import React, { useContext, useState } from "react";
import { View, TextInput, Button } from "react-native";
import PeopleContext from "../PeopleContext";
import { useNavigation } from "@react-navigation/native";

export default function AddIdeaScreen({ route }) {
    const [ideaText, setIdeaText] = useState("");
    const { addIdea } = useContext(PeopleContext);
    const navigation = useNavigation();
    const { id } = route.params

    const saveIdea = () => {
        if (ideaText) {
            addIdea(ideaText, id);
            navigation.navigate("Ideas", { id: id })
        }
    };
    return (
        <View>
            <TextInput placeholder="Text" value={ideaText} onChangeText={setIdeaText} />

            <Button title="Save" onPress={saveIdea} />
            <Button title="Cancel" onPress={() => navigation.goBack()} />
        </View>
    );
}