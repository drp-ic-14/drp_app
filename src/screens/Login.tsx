import { useState } from 'react';
import * as Icons from 'react-native-heroicons/outline';
import { View, TouchableOpacity, TextInput, Text } from 'react-native';
import { styled } from 'nativewind';
import { handleNoUuid } from '../hooks/uuid';

const StyledInput = styled(TextInput);

type LoginProps = {
  submitLogin: (uuid: string) => void;
};

const Login = ({ submitLogin }: LoginProps) => {
  const [field, setField] = useState('');

  const handleLogin = async () => {
    console.log(`handleLogin(${field})`);
    await handleNoUuid(field);
    submitLogin(field);
  };

  return (
    <View className="flex-2 justify-center items-center space-x-4">
      <View className="flex-row mx-4 mb-4 ">
        <StyledInput
          value={field}
          onChange={v => setField(v.nativeEvent.text)}
          className="p-3 pl-5 mr-4 text-lg flex-grow text-slate-900 bg-neutral-200 self-stretch rounded-xl shadow-xl shadow-black/40"
          placeholder="Username..."
        />
        <TouchableOpacity
          onPress={handleLogin}
          className="p-1 justify-center items-center bg-indigo-200 aspect-square rounded-xl"
        >
          <Icons.PaperAirplaneIcon stroke="#0f172a" />
        </TouchableOpacity>
      </View>
      <View className="flex-row mx-4 mb-4 ">
        <Text className="text-base text-center text-slate-700">
          Leave username blank to use an auto-generated username
        </Text>
      </View>
    </View>
  );
};

export default Login;
