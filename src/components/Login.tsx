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
          value={input}
          onChange={v => setInput(v.nativeEvent.text)}
          className="p-3 pl-5 mr-4 text-lg text-slate-900 bg-neutral-200 flex-1 rounded-xl shadow-xl shadow-black/40"
          placeholder="Username..."
        />
        <TouchableOpacity
          onPress={handleLogin}
          className="p-1 justify-center items-center bg-indigo-200 aspect-square rounded-xl"
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
          <Text className="text-base text-center text-rose-900">{error}</Text>
        </View>
      )}
      <View className="mx-4 mb-4">
        <Text className="text-base text-center text-slate-700">
          Leave blank to auto-generate username
        </Text>
      </View>
    </View>
  );
};

export default Login;
