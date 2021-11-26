import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    container_loading : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
    },
    loading : {
        padding : 50,
        borderRadius : 10,
        backgroundColor : 'white',
        borderWidth : 3,
        borderColor : '#a56cc1'
    },
    loading_text : {
        color : '#a56cc1',
        fontWeight : 'bold',
        fontSize : 24,
        textAlign : 'center',
    }
})

export default styles