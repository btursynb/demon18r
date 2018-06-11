import React, { Component } from 'react';
import {
  Alert,
  Linking,
  Dimensions,
  LayoutAnimation,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Header, Button} from 'react-native-elements';
import { material } from 'react-native-typography';
import { BarCodeScanner, Permissions } from 'expo';

export default class QrCodeScan extends Component {
  state = {
    hasCameraPermission: null,
    lastScannedUrl: null,
    amount: "1000"
  };

  componentDidMount() {
    if (this.props.navigation.state.params !== null) {

      this.setState({
          amount: this.props.navigation.state.params.amount
      });

  }
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = result => {
    if (result.data !== this.state.lastScannedUrl) {
      ////10000001xhgcehtyop2gl4kk  
      LayoutAnimation.spring();
      this.setState({ lastScannedUrl: result.data });
      var companyID = result.data.slice(0, 8);
      console.log(companyID);
      var companySecurityCode = result.data.slice(8, result.data.length);
      console.log(companySecurityCode);
      //this.props.navigation.navigate('ThankYouScreen');
      if (companyID === "10000001" && companySecurityCode==="xhgcehtyop2gl4kk") {
        this.props.navigation.navigate('ThankYouScreen', {amount: this.state.amount})
      } else {
        alert("Неверный QR код, пожалуйста отсканируйте код предоставленный заведением");
      }
      
    }
  };

  render() {
    
    return (
      <View>
        <Header
          leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.props.navigation.navigate('DrawerToggle') }}
          centerComponent={{ text: 'Главная', color: '#fff' }}
          rightComponent={{ icon: 'home', color: '#fff', onPress: () => this.props.navigation.navigate("HomeScreen") }}
        />
        <View style={styles.qrHelperText}><Text style={material.display1}>Отсканируйте QR код</Text></View>
        {this.state.hasCameraPermission === null
          ? <Text>Запрашиваем разрешение на использование камеры</Text>
          : this.state.hasCameraPermission === false
            ? <Text style={{ color: '#fff' }}>
              Неразрешено использовать камеру
                </Text>
            : <BarCodeScanner
              onBarCodeRead={this._handleBarCodeRead}
              style={{
                height: Dimensions.get('window').height * 0.8,
                width: Dimensions.get('window').width,
              }}/>}

        {/* {this._maybeRenderUrl()} */}

        <StatusBar hidden />
      </View>
    );
  }

  _handlePressUrl = () => {
    //10000001xhgcehtyop2gl4kk  
    Alert.alert(
      'Open this URL?',
      this.state.lastScannedUrl,
      [
        {
          text: 'Yes',
          onPress: () => Linking.openURL(this.state.lastScannedUrl),
        },
        { text: 'No', onPress: () => { } },
      ],
      { cancellable: false }
    );
  };

  _handlePressCancel = () => {
    this.setState({ lastScannedUrl: null });
  };

  _maybeRenderUrl = () => {
    if (!this.state.lastScannedUrl) {
      return;
    }

    return (
      
        
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.url} onPress={this._handlePressUrl}>
            <Text numberOfLines={1} style={styles.urlText}>
              {this.state.lastScannedUrl}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={this._handlePressCancel}>
            <Text style={styles.cancelButtonText}>
              Cancel
          </Text>
          </TouchableOpacity>
        </View>
      
    );
  };

  
}

let { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    flexDirection: 'row',
  },
  url: {
    flex: 1,
  },
  urlText: {
    color: '#fff',
    fontSize: 20,
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
  },
  qrHelperText: {
    backgroundColor: '#FFC109',
    height: height * 0.1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
