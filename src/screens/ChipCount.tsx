import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { loadPlayers, savePlayers } from '../utils/storage';
import CustomButton from '../components/CustomButton';
import { RootStackParamList, Player } from '../types';
import { formatCentsToDollars, formatDollarsToCents } from '../utils/format';

type ChipCountScreenProps = NativeStackScreenProps<RootStackParamList, 'ChipCount'>;
type NavigationType = NativeStackNavigationProp<RootStackParamList, 'ChipCount'>

type ChipCounts = { [key: string]: string };

const ChipCountScreen: React.FC<ChipCountScreenProps> = () => {
    const navigation = useNavigation<NavigationType>();
    const [players, setPlayers] = useState<Player[]>([]);
    const [chipCounts, setChipCounts] = useState<ChipCounts>({});

    useEffect(() => {
        const fetchPlayers = async () => {
            const loadedPlayers = await loadPlayers();

            const updatedPlayers: Player[] = []
            const chipCounts = {} as ChipCounts

            loadedPlayers.forEach(player => {
                updatedPlayers.push({ ...player, isEditing: true })
                chipCounts[player.name] = player.chipCountInCents
                    ? formatCentsToDollars(player.chipCountInCents)
                    : ''
            })
            setPlayers(updatedPlayers);
            setChipCounts(chipCounts);
        };
        fetchPlayers();
    }, []);

    useEffect(() => {
        savePlayers(players);
    }, [players]);

    const handleChipChange = (name: string, value: string) => {
        setChipCounts({ ...chipCounts, [name]: value });
    }

    const toggleEdit = (index: number) => {
        const newPlayers = [...players];
        newPlayers[index] = {
            ...newPlayers[index],
            isEditing: !newPlayers[index].isEditing
        };
        setPlayers(newPlayers);
    };

    const savePlayerChips = (index: number) => {
        const newPlayers = [...players];
        newPlayers[index] = {
            ...newPlayers[index],
            chipCountInCents: formatDollarsToCents(chipCounts[newPlayers[index].name]),
            isEditing: false
        };
        setPlayers(newPlayers);
        savePlayers(newPlayers);
    };

    const saveAllChipCounts = () => {
        const updatedPlayers = players.map(player => ({
            ...player,
            chipCountInCents: formatDollarsToCents(chipCounts[player.name]),
            isEditing: false,
        }));
        setPlayers(updatedPlayers);
        savePlayers(updatedPlayers);
    };

    const onInputButtonPress = (player: Player, index: number) => player.isEditing ? savePlayerChips(index) : toggleEdit(index)

    return (
        <LinearGradient
            colors={['#262829', '#1f2021']}
            style={styles.container}
        >
            <ScrollView style={styles.scrollContainer}>
                {players.map((player, index) => (
                    <View key={index} style={styles.playerRow}>
                        <Text style={styles.playerName}>{player.name}</Text>
                        <View style={styles.rightContainer}>
                            <Text style={styles.dollarText}>$</Text>
                            {player.isEditing ? (
                                <TextInput
                                    style={styles.input}
                                    value={chipCounts[player.name]}
                                    onChangeText={(value) => handleChipChange(player.name, value)}
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text style={styles.displayCount} onPress={() => onInputButtonPress(player, index)}>{formatCentsToDollars(player.chipCountInCents)}</Text>
                            )}
                            <Button
                                title={player.isEditing ? "✓" : "✏️"}
                                onPress={() => onInputButtonPress(player, index)}
                            />
                        </View>
                    </View>
                ))}
            </ScrollView>
            <CustomButton title="Save All" onPress={saveAllChipCounts} />
            <CustomButton title="Go to Summary" onPress={() => navigation.navigate('Summary')} />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#262829',
    },
    scrollContainer: {
        flex: 1, // This makes the ScrollView fill the space, pushing the button to the bottom
    },
    playerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingLeft: 20,
        paddingRight: 15,
        paddingVertical: 10,
        backgroundColor: '#37393b',
        borderRadius: 11,
    },
    playerName: {
        fontSize: 18,
        color: '#fff',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        color: '#fff'
    },
    _input: {
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        padding: 5,
        width: 60,
        marginRight: 10,
        textAlign: 'right',
        color: '#fff',
        fontSize: 16,
    },
    displayCount: {
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        padding: 2,
        marginRight: 10,
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
    },
    get input() {
        return this._input;
    },
    set input(value) {
        this._input = value;
    },
    dollarText: {
        color: '#82817f',
        fontSize: 15,
    }
});


export default ChipCountScreen;