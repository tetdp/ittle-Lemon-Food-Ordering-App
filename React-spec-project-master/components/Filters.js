import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../assets/styles';

const Filters = ({ onChange, selections, sections }) => {
  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key = {section}
          onPress={() => {
            onChange(index);
          }}
          style={{
            flex: 1 / sections.length,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
            marginHorizontal: 5,
            borderRadius: 16,
            backgroundColor: selections[index] ? colors.primaryGreen : colors.secondaryLightGrey,
          }}>
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: selections[index] ? colors.secondaryLightGrey : colors.primaryGreen }}>
              {section}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderColor: colors.secondaryLightGrey,
    borderBottomWidth: 1.5
  },
});

export default Filters;
