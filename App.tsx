import React from 'react';
import { Text, View } from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout } from '@ui-kitten/components';

import TaskItem from './components/TaskItem';

const HomeScreen = () => (
  <Layout>
    <View className='p-3'>
      <Text className='text-3xl text-slate-900'>Today</Text>
      <TaskItem name='punch ming' location='wow' checked={false} />
    </View>
  </Layout>
);

export default () => (
  <ApplicationProvider {...eva} theme={eva.light}>
    <HomeScreen />
  </ApplicationProvider>
);