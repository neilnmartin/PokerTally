import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PlayerList from '../components/PlayerList';
import { savePlayers, loadPlayers } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList, Player } from '../types';
import CustomButton from '../components/CustomButton';

type PlayerScreenProps = NativeStackScreenProps<RootStackParamList, 'PlayerScreen'>;
type NavigationType = NativeStackNavigationProp<RootStackParamList, 'PlayerScreen'>;


const PlayerScreen: React.FC<PlayerScreenProps> = () => {
    const navigation = useNavigation<NavigationType>();

    const [players, setPlayers] = useState<Player[]>([]);
    const [name, setName] = useState('');
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const fetchPlayers = async () => {
            const players = await loadPlayers();
            setPlayers(players);
        };
        fetchPlayers();
    }, []);

    useEffect(() => {
        const storePlayers = async () => {
            await savePlayers(players);
        };
        storePlayers();
    }, [players]);

    const fadeAnim = useRef(new Animated.Value(0)).current;  // Initial value for opacity: 0

    const showMessage = (text: string) => {
        setMessage(text);
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.delay(1500),
            Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true })
        ]).start(() => setMessage(''));
    };

    const handleAddPlayer = (name: string) => {
        const playerNameSet = new Set(players.map(p => p.name.toLowerCase()));
        if (playerNameSet.has(name.toLowerCase())) {
            showMessage("Player already exists.");
            return;
        } else if (name.length > 13) {
            showMessage("Player name is too long")
            return;
        }
        else {
            const newPlayerTemplate: Player = {
                name,
                buyIns: 1,
                chipCountInCents: 0,
                isEditing: false,
                checked: false,
            }
            const newPlayers = [...players, newPlayerTemplate];
            setPlayers(newPlayers);
            setName('')
        }

    };

    const handleRemovePlayer = (index: number) => {
        setPlayers(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <LinearGradient
            colors={['#262829', '#1f2021']}
            style={styles.container}
        >
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter a player's name"
                    placeholderTextColor='#bfbaba'
                    value={name}
                    onChangeText={setName}
                />
                <Button
                    title="✓"
                    onPress={() => {
                        if (name.trim()) handleAddPlayer(name);
                    }}
                />
            </View>
            <Animated.Text style={[styles.message, { opacity: fadeAnim }]}>
                {message}
            </Animated.Text>
            <PlayerList players={players} onRemovePlayer={handleRemovePlayer} />
            <CustomButton title="Buy-Ins >" onPress={() => navigation.navigate('BuyInScreen')} />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#262829',
    },
    message: {
        color: 'red',
        fontSize: 12,
        marginLeft: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginLeft: 2,
    },
    input: {
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        color: '#fff',
        fontSize: 16,
        padding: 10,
    },
});

export default PlayerScreen;
