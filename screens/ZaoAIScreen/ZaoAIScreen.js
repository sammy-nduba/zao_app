import React from 'react';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/aiScreen/Header';
import { SearchBar } from '../../components/aiScreen/SearchBar';
import { TabNavigation } from '../../components/aiScreen/TabNavigation';
import { CapabilityCard } from '../../components/aiScreen/CapabilityCard';
import { ChatInput } from '../../components/aiScreen/ChatInput';
import { useZaoAI } from '../../components/aiScreen/useZaoAI';
import { styles } from '../../config/styles/ZaoAIStyles';
import ScrollableMainContainer from '../../components/container/ScrollableMainContainer';

export const ZaoAIScreen = () => {
  const {
    searchText,
    setSearchText,
    activeTab,
    setActiveTab,
    chatInput,
    setChatInput,
    bottomNavTab,
    setBottomNavTab,
    capabilities,
    tabs,
    handleBackPress,
    handleNotificationPress,
    handleFilterPress,
    handleSend,
    handleAttach,
    handleVoice,
  } = useZaoAI();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollableMainContainer contentContainerStyle={{ paddingBottom: 100 }}>
        <Header
          title="Zao AI"
          onBackPress={handleBackPress}
          onNotificationPress={handleNotificationPress}
        />

        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onFilterPress={handleFilterPress}
          placeholder="Farm"
        />

        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />

        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logo} />
          </View>

          <Text style={styles.title}>Zao AI Capabilities</Text>

          {capabilities.map((capability, index) => (
            <CapabilityCard
              key={index}
              title={capability.title}
              description={capability.description}
            />
          ))}

          <Text style={styles.footerText}>
            These are just a few examples of what I can do.
          </Text>
        </View>
      </ScrollableMainContainer>

      {/* Fixed Input above the nav bar */}
      <View style={{ paddingHorizontal: 10, paddingBottom: 20, backgroundColor: 'white' }}>
        <ChatInput
          value={chatInput}
          onChangeText={setChatInput}
          onSend={handleSend}
          onAttach={handleAttach}
          onVoice={handleVoice}
          placeholder="Ask anything"
        />
      </View>
    </SafeAreaView>
  );
};
