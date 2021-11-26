import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    container : {
        flex : 1,
        padding: 20,
        justifyContent : 'center',
        backgroundColor : '#a56cc1'
    },
    logo_text : {
        fontSize : 28,
        fontWeight : 'bold',
    },
    container_success_register : {
        flexDirection : 'row',
        borderWidth : 1,
        padding : 10,
        borderRadius : 7,
        borderColor : 'green'
    },
    container_form : {
        padding : 20,
        margin : 10,
        borderRadius : 5,
    },
    container_error : {
        flexDirection : 'row',
        margin : 7,
        borderWidth : 2,
        borderRadius : 7,
        borderColor : 'red'
    },
    container_normal : {
        flexDirection : 'row',
        margin : 7,
        borderWidth : 1,
        borderRadius : 7
    },
    icon : {
        justifyContent : 'center',
        padding : 10,
        borderTopLeftRadius : 7,
        borderBottomLeftRadius : 7
    },
    text_input_error : {
        flex : 1,
        borderLeftWidth : 2,
        paddingLeft : 10,
        fontSize : 16,
        borderTopRightRadius : 7,
        borderBottomRightRadius : 7,
        borderColor : 'red'
    },
    text_input : {
        flex : 1,
        borderLeftWidth : 1,
        paddingLeft : 10,
        fontSize : 16,
        borderTopRightRadius : 7,
        borderBottomRightRadius : 7
    },
    password_error : {
        flex : 1,
        borderLeftWidth : 2,
        paddingLeft : 10,
        fontSize : 16,
        borderColor : 'red'
    },
    password : {
        flex : 1,
        borderLeftWidth : 1,
        paddingLeft : 10,
        fontSize : 16
    },
    show_password : {
        justifyContent : 'center',
        padding : 10,
        borderTopRightRadius : 7,
        borderBottomRightRadius : 7
    },
    wrong_input : {
        marginLeft : 7,
        marginBottom : 7,
        color : 'red'
    },
    button_submit : {
        padding : 10,
        borderRadius : 5,
        backgroundColor : '#a56cc1',
        margin : 5,
        alignItems : 'center',
        borderWidth : 3,
        borderColor : 'white'
    },
    container_direction : {
        marginTop : 20,
        padding : 10
    },
    button_direction : {
        padding : 10,
        borderRadius : 5,
        backgroundColor : '#a56cc1',
        margin : 5,
        alignItems : 'center',
        borderWidth : 3,
        borderColor : 'white'
    },
    container_already : {
        flexDirection : 'row',
        borderWidth : 1,
        padding : 10,
        borderRadius : 7,
        borderColor : 'red'
    },
    title_question : {
        alignSelf : 'center',
        color : 'white',
        fontWeight : 'bold',
        fontSize : 16
    },
    title_register : {
        fontSize : 20,
        fontWeight : 'bold',
        alignSelf : 'center',
        marginBottom : 10,
        color : 'black',
    },
    text_button : {
        color : 'white',
        fontSize : 14
    }
})

export default styles