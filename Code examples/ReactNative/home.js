import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { Header, Card, Button, Divider } from 'react-native-elements';
import { DrawerNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { material } from 'react-native-typography';
import { Location, Permissions } from 'expo';

export default class Home extends Component {
    state = { textValue: 1000, locationResult: null, currentAddress: '' };

    componentDidMount() {
        this._getLocationAsync();
        // let lat = this.state.locationResult.coords.latitude;
        // let long = this.state.locationResult.coords.longitude;
        // let gmapsapi = "AIzaSyDFId-3G9TbWYhx9JuUapaMS8APgrRhEfY";
        // console.log("qwe " + lat + " " + long);
        // this._getAddress(lat, long, gmapsapi);

    }
    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                locationResult: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.setState({ locationResult: JSON.stringify(location) });
        let gmapsapi = "AIzaSyDFId-3G9TbWYhx9JuUapaMS8APgrRhEfY";
        //console.log(JSON.stringify(location) + " getting address for " + location.coords.latitude + " " + location.coords.longitude);
        let addr = await this._getAddress(location.coords.latitude, location.coords.longitude, gmapsapi);
        console.log(addr);

    };
    _addAmount = () => {
        let t = this.state.textValue + 500;
        this.setState({ textValue: t })
    };
    _decreaseAmount = () => {
        let t = this.state.textValue - 500;
        if (t >= 500) {
            this.setState({ textValue: t })
        } else {
            this.setState({ textValue: 500 })
        }
    }
    _selectAmount = (value, e) => {
        this.setState({ textValue: value });
    }

    _getAddress = (myLat, myLon, myApiKey) => {
        console.log("request sent");
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + myLat + ',' + myLon + '&key=' + myApiKey + '&language=ru')
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.results.length > 0) {
                    var addComp = responseJson.results[0].address_components;
                    var address = addComp[1].short_name + " " + addComp[0].long_name; //+ ", " + addComp[3].short_name
                    this.setState({ currentAddress: address })
                    //alert(address);
                    return JSON.stringify(address);
                }

                //console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
                return "";
            })
    }
    render() {
        var { height, width } = Dimensions.get('window');
        const styles = StyleSheet.create({
            amountView: {
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginTop: 0.1 * height,
                marginBottom: 0.1 * height
            },
            currentLocationView: {
                //flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 5
            },
            selectAmountTextView: {
                flex: 1,
                alignItems: 'center',
                marginTop: 0.05 * height,
            },
            amountBtns: {
                //flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginBottom: 0.05 * height,
                width: width,
                //marginLeft: 0.35 * width
            },
            amountBtn1: {

                width: width * 0.25,
                padding: 10,

            },
            amountBtn2: {
                backgroundColor: '#9D27B1',
                width: width * 0.25,
                padding: 10
            },
            amountBtn3: {
                backgroundColor: '#2196F3',
                width: width * 0.25,
                padding: 10
            },
            amountBtn4: {
                backgroundColor: '#8AC24A',
                width: width * 0.25,
                padding: 10
            },
            amountBtn5: {
                backgroundColor: '#FFC109',
                width: width * 0.25,
                padding: 10
            },
            amountText: {

                height: 50
            },
            pinIcon: {
                marginRight: 10,
            },
            goToMap: {
                backgroundColor: "#FF5723",
                alignItems: 'center'
            },
            currentLocationCard: {
                width: this.width,
            }
        });
        return (
            <View>

                <Header
                    leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.props.navigation.navigate('DrawerToggle') }}
                    centerComponent={{ text: 'Главная', color: '#fff' }}
                    rightComponent={{ icon: 'home', color: '#fff', onPress: () => this.props.navigation.navigate("HomeScreen") }}
                />

                <View style={styles.selectAmountTextView}>
                    <Text style={material.subheading}>
                        Выберите сумму для снятия:
                    </Text>
                </View>
                <View style={styles.amountView}>
                    <Ionicons name="ios-remove-circle-outline" size={64} onPress={this._decreaseAmount} />
                    <View style={styles.amountText} >
                        <Text style={[material.display2, { color: 'black' }]}>&#8376; {this.state.textValue}</Text>
                    </View>
                    <Ionicons name="ios-add-circle-outline" size={64} onPress={this._addAmount} />
                </View>
                <View style={styles.amountBtns}>
                    <Button
                        title="1000"
                        rounded
                        buttonStyle={styles.amountBtn1}
                        onPress={(e) => this._selectAmount(1000, e)}
                    />
                    <Button
                        title="2000"
                        rounded
                        buttonStyle={styles.amountBtn2}
                        onPress={(e) => this._selectAmount(2000, e)}
                    />
                    <Button
                        title="5000"
                        rounded
                        buttonStyle={styles.amountBtn3}
                        onPress={(e) => this._selectAmount(5000, e)}
                    />
                </View>
                <View style={styles.amountBtns}>
                    <Button
                        title="10000"
                        rounded
                        buttonStyle={styles.amountBtn4}
                        onPress={(e) => this._selectAmount(10000, e)}
                    />
                    <Button
                        title="15000"
                        rounded
                        buttonStyle={styles.amountBtn5}
                        onPress={(e) => this._selectAmount(15000, e)}
                    />
                </View>
                <View>
                    <Card style={styles.currentLocationCard}>
                        <View>
                            <Text style={material.caption}>Вы находитесь здесь:</Text>
                        </View>
                        <View style={styles.currentLocationView}>
                            <Ionicons name="ios-pin-outline" size={24} style={styles.pinIcon} />
                            <Text>
                                {this.state.currentAddress}
                            </Text>
                        </View>
                        <Divider style={{ backgroundColor: 'gray', marginBottom: 0.02 * height }} />
                        <Button
                            title="Поиск"
                            raized
                            icon={{ name: 'cached' }}
                            buttonStyle={styles.goToMap}
                            onPress={() => this.props.navigation.navigate('PayDayMapScreen', { amount: this.state.textValue })}
                        />
                    </Card>
                </View>
            </View>
        );
    }


}

                        // https://expo.github.io/vector-icons/