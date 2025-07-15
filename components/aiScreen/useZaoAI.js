import { useState } from 'react';

export const useZaoAI = () => {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [bottomNavTab, setBottomNavTab] = useState(4); // AI tab active

  const capabilities = [
    {
      title: 'Answer all your questions.',
      description: '(Just ask me any farming question you like!)'
    },
    {
      title: 'Disease Diagnosis & Treatment',
      description: '(Upload a photo of your crop, and AI will identify diseases and recommend solutions.)'
    },
    {
      title: 'Generate all the text you want.',
      description: '(Receive customized recommendations based on your farm size, soil type, and weather.)'
    },
    {
      title: 'Conversational AI.',
      description: '(I can talk to you like a natural human)'
    }
  ];

  const tabs = ['Zao Chat', 'History', 'AI Assistants'];

  const handleBackPress = () => {
    console.log('Back pressed');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  const handleSend = () => {
    if (chatInput.trim()) {
      console.log('Sending message:', chatInput);
      setChatInput('');
    }
  };

  const handleAttach = () => {
    console.log('Attach pressed');
  };

  const handleVoice = () => {
    console.log('Voice pressed');
  };

  return {
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
  };
};