import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

const PeopleContext = createContext();

export const PeopleProvider = ({ children }) => {
    const [people, setPeople] = useState([]);
    const [ideas, setIdeas] = useState([]);

    const STORAGE_KEY = "people";

    // Load people from AsyncStorage
    useEffect(() => {
        const loadPeople = async () => {
            const savedPeople = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedPeople) setPeople(JSON.parse(savedPeople));
        };
        loadPeople();
    }, []);

    const clearStorage = async () => {
        try {
            await AsyncStorage.clear();
            console.log('Storage successfully cleared!');
        } catch (error) {
            console.error('Failed to clear the async storage.', error);
        }
    };

    const addPerson = async (name, dob) => {
        const newPerson = {
            id: randomUUID(),
            name,
            dob,
            ideas: []
        };
        const updatedPeople = [...people, newPerson];

        return new Promise(async (resolve, reject) => {
            try {
                setPeople(updatedPeople);
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
                resolve("Save Successful")
            } catch (err) {
                reject(err)
            }
        })

    };

    const removePerson = async (id) => {
        const updatedPeople = people.filter(person => person.id !== id)
        setPeople(updatedPeople);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
    };

    const getIdeas = async (id) => {
        const person = people.filter(person => person.id === id)[0]

        return person.ideas
    }

    const addIdea = async (text, userId) => {
        const newIdea = {
            id: randomUUID(),
            text
        };

        const updatedPeople = people.map((person) => {
            if (person.id === userId) {
                person.ideas.push(newIdea)
                return person
            } else {
                return person
            }
        })

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));

    };

    const removeIdea = async (userId, ideaId) => {
        const updatedPeople = people.map((person) => {
            if (person.id === userId) {
                person.ideas = person.ideas.filter((idea) => idea.id !== ideaId)
                return person
            } else {
                return person
            }
        })

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPeople));
    }

    return (
        <PeopleContext.Provider value={{ people, ideas, addPerson, removePerson, getIdeas, addIdea, removeIdea, clearStorage }}>
            {children}
        </PeopleContext.Provider>
    );
};

export default PeopleContext;