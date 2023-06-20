import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  ActivityIndicator,
} from 'react-native';
import * as Icons from 'react-native-heroicons/outline';

import { LoginState } from '../hooks/login';

type LoginProps = {
  state: LoginState;
  error: string;
  create: (uuid: string) => Promise<void>;
};

const Login = ({ state, error, create }: LoginProps) => {
  const [input, setInput] = useState('');

  const handleLogin = async () => {
    console.log(`handleLogin(${input})`);
    create(input);
  };

  return (
    <View className="mt-12 w-full">
      <View className="flex-row mx-4 mb-4">
        <TextInput
          autoCorrect={false}
          value={input}
          onChange={v => setInput(v.nativeEvent.text)}
          className="p-3 pl-5 mr-4 text-lg text-slate-900 bg-[#f7f9fc] border border-[#e4e9f2] flex-1 rounded-xl shadow-xl shadow-black/30"
          placeholder="Username..."
          placeholderTextColor="#0f172aaa"
        />
        <TouchableOpacity
          onPress={handleLogin}
          className="p-1 justify-center items-center bg-indigo-100 shadow-xl shadow-black/30 aspect-square rounded-xl"
        >
          {state === LoginState.LOADING ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Icons.PaperAirplaneIcon stroke="#0f172a" />
          )}
        </TouchableOpacity>
      </View>
      {error && (
        <View className="mx-4 mb-4">
          <Text className="text-sm text-center text-rose-900">{error}</Text>
        </View>
      )}
      <View className="mx-4 mb-4">
        <Text className="text-sm text-center text-slate-700">
          Leave blank to auto-generate username
        </Text>
      </View>
    </View>
  );
};

export default Login;
