import { View, Image, Pressable } from 'react-native';
import FontAwesomeIcon from '@expo/vector-icons/FontAwesome6';
import styles from '../assets/styles';
import { Avatar } from './Avatar';

function Navbar(props) {
    return (
        <View style={styles.navbar}>
            {
                props.hideBack ?
                    (<View></View>) :
                    (<Pressable onPressIn={props.goToHome}>
                        <FontAwesomeIcon
                            name="arrow-alt-circle-left"
                            size={40}
                            color="#495E57" />
                    </Pressable>)
            }
            <Image
                style={styles.logo}
                source={require('../assets/Logo.png')}
                resizeMode='contain'
                accessible={true}
                accessibilityLabel={'Little Lemon Logo'}
            />
            <Pressable onPressIn={props.goToProfile}>
                <Avatar path={props.imagePath} text={props.imageText} />
            </Pressable>
        </View>
    )
}

export default Navbar;