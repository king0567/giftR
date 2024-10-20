import React, { useContext, useState } from "react";
import { View, TextInput, Button, Modal, Text } from "react-native";
import PeopleContext from "../PeopleContext";
import { useNavigation } from "@react-navigation/native";
import DatePicker from 'react-native-modern-datepicker';

export default function AddPersonScreen() {
    const [selectedDate, setSelectedDate] = useState('');
    const [name, setName] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false)


    const { addPerson } = useContext(PeopleContext);
    const navigation = useNavigation();

    const savePerson = () => {
        if (name && selectedDate) {
            addPerson(name, selectedDate)
                .then(() => {
                    navigation.goBack();
                })
                .catch((err) => {
                    setIsModalVisible(true)
                })

        }
        else {
            alert("Please fill in all fields")
        }
    };
    return (

        <View>
            {isModalVisible && <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
                onShow={() => {
                    //called when the modal is shown
                }}
                onRequestClose={() => {
                    setIsModalVisible(!isModalVisible);
                }}
            >
                <View>
                    <Text>Person could not be saved</Text>
                    <Button title="Okay" onPress={() => { setIsModalVisible(!isModalVisible) }} />
                </View>
            </Modal>
            }
            <TextInput placeholder="Name" value={name} onChangeText={setName} />
            <DatePicker
                onSelectedChange={(date) => {
                    setSelectedDate(date.replace(/\//g, "-"))
                }}
                options={{
                    backgroundColor: 'black',
                    textHeaderColor: 'white',
                    textDefaultColor: 'white',
                    selectedTextColor: 'white',
                    mainColor: 'red', //arrows
                    textSecondaryColor: '#777', //dow
                    borderColor: 'blue',
                }}
                style={
                    {
                        //additional style like padding
                    }
                }
                current={'1990-01-01'}
                selected={'1990-01-15'}
                maximumDate={new Date().toDateString()}
                mode="calendar"
            ></DatePicker>

            <Button title="Save" onPress={savePerson} />
            <Button title="Cancel" onPress={() => navigation.goBack()} />
        </View>
    );
}