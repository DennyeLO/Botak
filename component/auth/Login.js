import React, {useState} from 'react'
import { View, Text, TextInput, TouchableOpacity} from 'react-native'
import styles from './component/style'
import Icon from 'react-native-vector-icons/FontAwesome5'
import IconForm from 'react-native-vector-icons/MaterialCommunityIcons'

const Login = ({navigation}) => {
    const [data, setData] = useState({
        username: '',
        password: '',
    });
    const [showPassword,setShowPassword] = useState(true);
    const [loading,setLoading] = useState(false);

    const handleChange = (value, name) => {
        setData({...data, [name]: value});
    }

    return (
        <View style = {styles.container}>

            <View style = {styles.container_form}>                
                {/* Username */}
                <View style = {styles.container_normal}>
                    <View style = {styles.icon}>
                        <IconForm name = "account" style = {{fontSize : 24}}/>
                    </View>
                    <TextInput
                        style = {styles.text_input}
                        placeholder = "Username"
                        name={"username"}
                        onChangeText = {(e) => handleChange(e, 'username')}
                        value = {data.username}
                    />
                </View>

                {/* Password */}
                <View style = {styles.container_normal}>
                    <View style = {styles.icon}>
                        <IconForm name = "lock" style = {{fontSize : 24}}/>
                    </View>
                    <TextInput
                        style = {styles.password}
                        secureTextEntry={showPassword}
                        placeholder = "Password"
                        name={"password"}
                        onChangeText = {(e) => handleChange(e, 'password')}
                        value = {data.password}
                    />
                    <View style = {styles.show_password}>
                        <TouchableOpacity onPress = {() => setShowPassword(!showPassword)}>
                            {
                                showPassword ? <Icon name = "eye" style = {{fontSize : 24}}/> : <Icon name = "eye-slash" style = {{fontSize : 24}}/>
                            }
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Button */}
                <View>
                    <TouchableOpacity 
                        style = {styles.button_submit}
                        // onPress = {() => handleRegister(name,email,password,rePassword,setLoading,setNameError,setEmailError,setPasswordError,setAlreadyUser,navigation)}
                    >
                        <Text style = {styles.text_button}>Login</Text>
                    </TouchableOpacity>
                    <View style = {styles.container_direction}>
                        <Text style = {styles.title_question}>No Have Account ? </Text>
                        <TouchableOpacity 
                            style = {styles.button_direction}
                            onPress = {() => navigation.navigate('Register')}
                        ><Text style = {styles.text_button}>Register</Text></TouchableOpacity>
                    </View>
                </View>
            </View>


        </View>
    )
}

export default Login