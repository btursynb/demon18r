import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { Header, Card, Button, Slider } from 'react-native-elements';
import { DrawerNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { material } from 'react-native-typography'
import { Location, Permissions, MapView } from 'expo';

export default class CompanyProfile extends Component {
    state = {
        places: null,
        id: 1,
        amount: "1000",
        mapRegion: { latitude: 51.1246, longitude: 71.483, latitudeDelta: 0.5222, longitudeDelta: 0.0721 },
        locationResult: null,
        location: { coords: { latitude: 51.1247, longitude: 71.483 } },
    };
    componentDidMount() {
        if (this.props.navigation.state.params !== null) {

            this.setState({
                places: this.props.navigation.state.params.places,
                id: this.props.navigation.state.params.shopId,
                amount: this.props.navigation.state.params.amount
            });
            let place = this.state.places ? this.state.places.find(x => x.id === this.state.id) : null;
            if (place !== null) {
                var placeLocation = { coords: { latitude: place.coordinate.latitude, longitude: place.coordinate.longitude } };
                this.setState({ location: placeLocation });
            }

        }
    }
    _renderSite = () => {

        let place = this.state.places ? this.state.places.find(x => x.id === this.state.id) : null;
        if (place !== null) {

            return (
                <MapView.Marker
                    key={place.id}
                    title={place.title}
                    description={place.description}
                    coordinate={place.coordinate}
                />);
        }
        return "";
    };
    _getMoneyBtnClick = () => {
        this.props.navigation.navigate('QrCodeScanScreen', { amount: this.state.amount })
    }

    render() {
        var { height, width } = Dimensions.get('window');
        const styles = StyleSheet.create({
            test: {
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginTop: 0.1 * height,
                marginBottom: 0.15 * height
            }
        });
        let place = this.state.places ? this.state.places.find(x => x.id === this.state.id) : null;
        return (
            <View>

                <Header
                    leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.props.navigation.navigate('DrawerToggle') }}
                    centerComponent={{ text: 'Главная', color: '#fff' }}
                    rightComponent={{ icon: 'home', color: '#fff', onPress: () => this.props.navigation.navigate("HomeScreen") }}
                />
                <ScrollView
                    style={{ height: 0.9*height, borderBottomWidth: 1, borderBottomColor: '#cbd2d9' }}
                    onScroll={this._handleListScroll}>
                <Card
                    title={place ? place.title : "nothing"}
                image={{ uri: place ? place.avatar_url : "./img.jpg" }}
                >
                    <Text style={{ marginBottom: 10 }}>
                    {place ? place.description : ""}
                </Text>
                <Button
                    icon={{ name: 'attach-money' }}
                    backgroundColor='#03A9F4'
                    buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: height * 0.05 }}
                    onPress={this._getMoneyBtnClick}
                    title={"Снять " + this.state.amount + " тенге"} />
                </Card>
            <Card title="Заведение на карте">
                <MapView
                    style={{ alignSelf: 'stretch', height: height * 0.4, marginBottom: 0.2*height }}
                    region={{ latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude, latitudeDelta: 0.0422, longitudeDelta: 0.0721 }}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    onRegionChangeComplete={this._handleMapRegionChange}
                >
                    {this._renderSite()}

                </MapView>
            </Card>
               </ScrollView >
            </View >
        );
    }


}

var { height, width } = Dimensions.get('window');