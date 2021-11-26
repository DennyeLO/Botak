import React from 'react'
import {View,Text,ActivityIndicator,Modal} from 'react-native'
import styles from './style'

const Loading = ({loading}) => {
    return (
        <Modal visible = {loading} transparent>
            <View style = {styles.container_loading}>
                <View style = {styles.loading}>
                    <ActivityIndicator animating = {loading} color = "#a56cc1" size = {45}/>
                    <Text style = {styles.loading_text}>Loading</Text>
                </View>
            </View>
        </Modal>
    )
}

export default Loading
