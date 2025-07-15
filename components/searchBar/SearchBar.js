// import React from 'react';
// import { View, TextInput, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { styles } from '../../config/styles/styles';

// export const SearchBar = ({ value, onChangeText, onFilterPress, placeholder }) => {
//   return (
//     <View style={styles.searchContainer}>
//       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//         <View style={styles.searchWrapper}>
//           <Icon name="search" size={20} color="#6B7280" />
//           <TextInput
//             style={styles.searchInput}
//             placeholder={placeholder}
//             value={value}
//             onChangeText={onChangeText}
//           />
//         </View>
//         <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
//           <Icon name="tune" size={24} color="#10B981" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };