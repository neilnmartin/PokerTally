import React, { useState, useEffect, useRef } from 'react';
import {
    Animated,
    Button,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const playerInputRef = useRef<TextInput>(null)
    const playerListRef = useRef<ScrollView>(null)

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



    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardVisible(true);  // Set state to true when keyboard shows
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardVisible(false);  // Set state to false when keyboard hides
        });

        return () => {
            showSubscription.remove();  // Clean up listeners on component unmount
            hideSubscription.remove();
        };
    }, []);

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
        if (!name.trim()) {
            showMessage("Enter a name.");
            return;
        }
        playerInputRef.current?.focus();
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
            setName('');
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
            <KeyboardAvoidingView
                style={{ flex: 1 }} // Ensure KeyboardAvoidingView takes up full space
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Adjust based on your navbar height or header
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        ref={playerInputRef}
                        style={styles.input}
                        placeholder="Enter a player's name"
                        placeholderTextColor='#bfbaba'
                        value={name}
                        onChangeText={setName}
                        onSubmitEditing={() => handleAddPlayer(name)}
                        blurOnSubmit={false}
                    />
                    <CustomButton
                        title="✓"
                        onPress={() => handleAddPlayer(name)}
                    />
                </View>
                <Animated.Text style={[styles.message, { opacity: fadeAnim }]}>
                    {message}
                </Animated.Text>
                <ScrollView style={styles.playerList}
                    ref={playerListRef}
                    onContentSizeChange={() => playerListRef.current?.scrollToEnd({ animated: true })}>
                    {players.map((player, index) => (
                        <View key={index} style={styles.playerItem}>
                            <Text style={styles.playerName}>{player.name}</Text>
                            <Button color="#ffff" title="×" onPress={() => handleRemovePlayer(index)} />
                        </View>
                    ))}
                </ScrollView>
                {/* <View style={{ flexDirection: 'row' }}> */}

                {keyboardVisible
                    ? <CustomButton title="Done" onPress={Keyboard.dismiss} />
                    : <CustomButton title="Buy-Ins >" onPress={() => navigation.navigate('BuyInScreen')} />}
                {/* </View> */}
            </KeyboardAvoidingView>
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
        // backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginLeft: 2,
    },
    input: {
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        color: '#fff',
        fontSize: 18,
        padding: 10,
    },
    dismissButton: {
        marginTop: 20,
        backgroundColor: 'lightblue',
        padding: 10,
    },
    playerList: {
        padding: 10,
        borderRadius: 11,
    },
    playerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 8,
        backgroundColor: '#37393b',
        borderRadius: 8,
    },
    playerName: {
        color: '#fff',
        fontSize: 18,
        paddingLeft: 4,
    }
});

export default PlayerScreen;
