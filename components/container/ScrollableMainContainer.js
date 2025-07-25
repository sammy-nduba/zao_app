import { useContext } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import { colors } from "../../config/theme";
import { onIOS } from "../../config/constants";
import { HeaderHeightContext } from '@react-navigation/elements';




const ScrollableMainContainer = ({ children, style, contentContainerStyle, ...props} ) => {
    
    return (
        <KeyboardAvoidingView
            behavior = { onIOS ? "padding" : undefined}
            style = {{ flex: 1 }}
            keyboardVerticalOffset = {useContext(HeaderHeightContext) ?? 0} >


                
                <ScrollView 
                style = {[{flex: 1, backgroundColor:  colors.background}, style ]} 
                showsVerticalScrollIndicator = {false}
                contentContainerStyle = {contentContainerStyle}
                keyboardShouldPersistTaps = "handled"
                extraScrollHeight = {20}
                enableAutomaticScroll={true}
                {...props}
                >

                     {children}
                     
                </ScrollView>
          
            </KeyboardAvoidingView>


            
    );
};



export default ScrollableMainContainer;