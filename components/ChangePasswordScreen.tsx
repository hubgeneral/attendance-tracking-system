import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';

export default function CreatePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  type ShowField = 'current' | 'new' | 'confirm';

  const toggleVisibility = (field: ShowField) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Password</Text>

      {/* Current Password */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry={!showPassword.current}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          mode="outlined"
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          outlineColor="transparent"
          activeOutlineColor="transparent"
          theme={{
          colors: {
            outline: 'transparent',
            background: 'transparent', 
            primary: 'transparent',
          },
        }}
        />
        <TouchableOpacity
          onPress={() => toggleVisibility('current')}
          style={styles.icon}
        >
          <Ionicons name={showPassword.current ? "eye-off" : "eye"} size={24} color="#555" />
        </TouchableOpacity>
      </View>

      {/* New Password */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={!showPassword.new}
          value={newPassword}
          onChangeText={setNewPassword}
          mode="outlined"
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          outlineColor="transparent"
          activeOutlineColor="transparent"
          theme={{
            colors: {
              outline: 'transparent',
              background: 'transparent',
              primary: 'transparent',
            },
          }}
        />
        <TouchableOpacity
          onPress={() => toggleVisibility('new')}
          style={styles.icon}
        >
          <Ionicons name={showPassword.new ? "eye-off" : "eye"} size={24} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View style={styles.inputContainer}>
        <TextInput
          mode='outlined'
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={!showPassword.confirm}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          outlineColor="transparent"
          activeOutlineColor="transparent"
          theme={{
          colors: {
            outline: 'transparent',
            background: 'transparent',
            primary: 'transparent',
           
          },
        }}
        />
        <TouchableOpacity
          onPress={() => toggleVisibility('confirm')}
          style={styles.icon}
        >
          <Ionicons name={showPassword.confirm ? "eye-off" : "eye"} size={24} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
   
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#0d1b2a',
    marginBottom: 24,
  },
  
inputContainer: {
  flexDirection: 'row',      
  alignItems: 'center',     
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  paddingHorizontal: 0,
  marginVertical: 10,
},
input: {
  flex: 1,                  
  height: 50,

},
icon: {
  padding: 8,
},

  saveButton: {
    backgroundColor: '#004d40',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
