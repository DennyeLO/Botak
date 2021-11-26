import React, {useState} from 'react'
import { View, Text, TextInput, TouchableOpacity} from 'react-native'
import styles from './component/style'
import Icon from 'react-native-vector-icons/FontAwesome5'
import IconForm from 'react-native-vector-icons/MaterialCommunityIcons'


const Register = ({navigation}) => {
    const [data, setData] = useState({
        username: '',
        password: '',
        confirm_password: ''
    });
    const [showPassword,setShowPassword] = useState(true);
    const [loading,setLoading] = useState(false);

    
    const handleChange = (value, name) => {
        setData({...data, [name]: value});
    }

    const handleSubmit = () => {
        console.log("hai");
        // register();
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

                {/* Confirm Password */}
                <View style = {styles.container_normal}>
                    <View style = {styles.icon}>
                        <IconForm name = "lock" style = {{fontSize : 24}}/>
                    </View>
                    <TextInput
                        style = {styles.password}
                        secureTextEntry={showPassword}
                        placeholder = "Confirm Password"
                        name={"confirm_password"}
                        onChangeText = {(e) => handleChange(e, 'confirm_password')}
                        value = {data.confirm_password}
                    />
                </View>

                {/* Button */}
                <View>
                    <TouchableOpacity 
                        style = {styles.button_submit}
                        onPress = {() => handleSubmit()}
                    >
                        <Text style = {styles.text_button}>Register</Text>
                    </TouchableOpacity>
                    <View style = {styles.container_direction}>
                        <Text style = {styles.title_question}>Have Account ? </Text>
                        <TouchableOpacity 
                            style = {styles.button_direction}
                            onPress = {() => navigation.navigate('Login')}
                        ><Text style = {styles.text_button}>Login</Text></TouchableOpacity>
                    </View>
                </View>
            </View>


        </View>
    )
}

export default Register