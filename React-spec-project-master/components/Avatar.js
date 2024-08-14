import { View, Image, Text } from 'react-native';
import styles from '../assets/styles';

export const Avatar = ({ path, text }) => (
    <View style={styles.profileImage}>
        {
            path ?
                <Image source={{ uri: path }} style={styles.profileImage} /> :
                <Text>{text}</Text>
        }
    </View>
)
