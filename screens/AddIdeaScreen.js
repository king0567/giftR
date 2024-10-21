import React, { useContext, useEffect, useRef, useState } from "react";
import { View, TextInput, Button, TouchableOpacity, Text, StyleSheet, Pressable, Image, Modal, KeyboardAvoidingView } from "react-native";
import PeopleContext from "../PeopleContext";
import { useNavigation } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from 'expo-image-manipulator';

export default function AddIdeaScreen({ route }) {
    let camera = useRef();
    const [facing, setFacing] = useState("back");
    const [permission, requestPermission] = useCameraPermissions();
    const [imgURI, setImgURI] = useState("")
    const [imgHeight, setImgHeight] = useState(0)
    const [imgWidth, setImgWidth] = useState(0)
    const [showCamera, setShowCamera] = useState(false)
    const [takePhotoButtonText, setTakePhotoButtonText] = useState("Take Photo")
    const [ideaText, setIdeaText] = useState("");
    const { addIdea } = useContext(PeopleContext);
    const navigation = useNavigation();
    const [errorMessage, setErrorMessage] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false)
    const { id } = route.params

    const saveIdea = () => {
        addIdea(ideaText, id, imgURI, imgHeight, imgWidth)
            .then(() => {
                navigation.navigate("Ideas", { id: id })
            })
            .catch((err) => {
                setErrorMessage(err)
                setIsModalVisible(true)
            });
    }

    function toggleCameraFacing() {
        setFacing((current) => (current === "back" ? "front" : "back"));
    }

    const takePic = () => {
        const options = {
            quality: 0.8,
            exif: true,

        };
        camera
            .takePictureAsync(options)
            .then(async ({ uri, width, height, exif }) => {

                let newImage

                if (exif.Orientation == 6) {
                    newImage = await ImageManipulator.manipulateAsync(uri, [{ rotate: 270 }])
                    setImgURI(newImage.uri)
                    setImgHeight(newImage.height)
                    setImgWidth(newImage.width)
                } else {
                    setImgURI(uri)
                    setImgHeight(height)
                    setImgWidth(width)
                }

                setShowCamera(false)
                setTakePhotoButtonText("Retake Photo")
            });
    };

    if (!permission) {
        return <View>
            <Text>Loading...</Text>
        </View>
    }

    if (!permission.granted) {
        return (
            <View>
                <Text>No access to camera - Please turn on permission</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
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
                    <Text>{errorMessage}</Text>
                    <Button title="Okay" onPress={() => { setIsModalVisible(!isModalVisible) }} />
                </View>
            </Modal>
            }
            {showCamera && <View style={styles.container}>

                <CameraView style={styles.camera} facing={facing} ref={(r) => {
                    camera = r
                }}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                            <Text style={styles.text}>Flip Camera</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
                <Button
                    title="Capture"
                    onPress={takePic}
                />

            </View>}
            {!showCamera && <View style={styles.container}>
                <Text style={styles.heading}>Add A Gift Idea </Text>
                <KeyboardAvoidingView>
                    <TextInput placeholder="Text" value={ideaText} onChangeText={setIdeaText} />
                </KeyboardAvoidingView>
                {imgURI !== "" && <Image source={{ uri: imgURI }} style={{
                    width: 200 * (imgWidth / imgHeight),
                    height: 200
                }} />}
                <KeyboardAvoidingView>
                    <Button title={takePhotoButtonText} onPress={() => { setShowCamera(true) }} />
                </KeyboardAvoidingView>
                <KeyboardAvoidingView>
                    <Button title="Save" onPress={saveIdea} />
                </KeyboardAvoidingView>
                <KeyboardAvoidingView>
                    <Button title="Cancel" onPress={() => navigation.goBack()} />
                </KeyboardAvoidingView>
            </View>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    message: {
        textAlign: "center",
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "transparent",
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: "flex-end",
        alignItems: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    heading: {
        padding: 10,
        fontSize: 40,
        fontWeight: "bold"
    }
});