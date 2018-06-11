import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { Constants, MapView, Location, Permissions } from 'expo';
import { Header, Button, List, ListItem, Rating } from 'react-native-elements';
import { DrawerNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

export default class PayDayMap extends Component {

  state = {
    mapRegion: { latitude: 51.1246, longitude: 71.483, latitudeDelta: 0.5222, longitudeDelta: 0.0721 },
    locationResult: null,
    location: { coords: { latitude: 51.1247, longitude: 71.483 } },
    places: null,
    amount: "1000",
  };

  componentDidMount() {
    this._getLocationAsync();
    let lon = this.state.location.coords.longitude;
    let lat = this.state.location.coords.latitude;
    const placesData = [
      {
        id: 1,
        title: 'Crepes Cafe (< 1 км)',
        description: 'Кафетерий',
        avatar_url: 'https://japancentersf-wpengine.netdna-ssl.com/wp-content/uploads/Belly-Good-Cafe-Crepes-West.jpg',
        rating: 5,
        coordinate: {
          longitude: lon + 0.01,
          latitude: lat
        }
      }
      ,
      {
        id: 2,
        title: 'Аружан (< 1 км)',
        description: 'Продуктовый магазин',
        avatar_url: 'http://astanalife.kz/wp-content/uploads/2016/06/1-11.jpg',
        rating: 5,
        coordinate: {
          longitude: lon + 0.006,
          latitude: lat + 0.01
        }
      },
      {
        id: 3,
        title: '1000 мелочей (< 1 км)',
        description: 'Магазин',
        avatar_url: 'http://abakan-shopping.ru/assets/images/shop/174_thumb.jpg?1383897745',
        rating: 5,
        coordinate: {
          longitude: lon - 0.01,
          latitude: lat + 0.005
        }
      }
      ,
      {
        id: 4,
        title: 'Альшиша (< 1 км)',
        description: 'Кальянная',
        avatar_url: 'https://strg2.restoran.kz/neofiles/serve-image/558b6fe57265733db8d10a00/1170x468/c1/q70',
        rating: 5,
        coordinate: {
          longitude: lon - 0.0055,
          latitude: lat - 0.006
        }
      }
      ,
      {
        id: 5,
        title: 'Magnum (< 1 км)',
        description: 'Гипермаркет',
        avatar_url: 'http://magnum.kz/assets/images/backgrounds/2807.jpg',
        rating: 5,
        coordinate: {
          longitude: lon - 0.0155,
          latitude: lat
        }
      }
      ,
      {
        id: 6,
        title: 'Super Barber (< 1 км)',
        description: 'Барбершоп',
        avatar_url: 'https://p0.zoon.ru/preview/xEwrkHCSGTib6QFxXFVVrQ/2400x1500x75/1/3/8/original_58a11447710c68003c8b4571_58aaaa4c4e430.jpg',
        rating: 5,
        coordinate: {
          longitude: lon - 0.0255,
          latitude: lat - 0.02
        }
      }

    ];
    this.setState({ places: placesData });
    if (this.props.navigation.state.params !== null) {

      this.setState({
        amount: this.props.navigation.state.params.amount
      });
    }
  }

  _handleMapRegionChange = mapRegion => {
    // this.setState({ mapRegion });

  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
        location,
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    let locationResult = JSON.stringify(location);
    this.setState({ locationResult, location, });
    //console.log(locationResult);
  };

  _locateCurrentLocation = () => {
    this._getLocationAsync();
  };

  _renderSites = () => {

    let places = this.state.places;
    if (places !== null) {
      const renderedSites = places.map(site => {
        const { title, description, coordinate, id } = site;

        return (
          <MapView.Marker
            key={id}
            title={title}
            description={description}
            coordinate={coordinate}
          />
        );
      });
      return renderedSites;
    }

    return "";


  };
  _handleListScroll = (e) => {
    //  console.log("TTT " + e.nativeEvent.contentOffset.y);
  };
  _itemClick = (id) => {
    console.log("Id clicked " + id);
    this.props.navigation.navigate('CompanyProfileScreen', { shopId: id, places: this.state.places, amount: this.state.amount })
  }
  _renderSitesList = (_height) => {
    const pl = this.state.places;
    if (pl !== null) {
      return (

        <List containerStyle={{ marginTop: 0, marginBottom: 0 }}>
          <ScrollView
            style={{ height: _height, borderBottomWidth: 1, borderBottomColor: '#cbd2d9' }}
            onScroll={this._handleListScroll}
          // onTouchStart={() => console.log('ontouchstart')}
          // onScrollEndDrag={() => console.log('onScrollEndDrag')}
          // onScrollBeginDrag={() => console.log('onScrollBeginDrag')}
          // onScrollEndDrag={() => console.log('onScrollEndDrag')}
          // onMomentumScrollBegin={() => console.log('onMomentumScrollBegin')}
          // onMomentumScrollEnd={() => console.log('onMomentumScrollEnd')}
          >
            {
              pl.map((l, i) => (
                <ListItem

                  avatar={{ uri: l.avatar_url }}
                  key={i}
                  title={l.title}
                  subtitle={
                    <View style={{ marginLeft: width * 0.025 }}>
                      <Text>{l.description}</Text>
                      <Rating
                        type="heart"
                        ratingCount={5}
                        fractions={2}
                        startingValue={l.rating}
                        imageSize={20}
                        readonly
                      />

                    </View>
                  }
                  chevronColor={'#01B43F'}
                  onPress={() => this._itemClick(l.id)}
                />

              ))

            }
          </ScrollView>

        </List>

      );
    }
    return;
  }
  render() {

    const styles = StyleSheet.create({
      list: {
        flex: 1,
        width: 0.6 * width
      },
      getMoneyBtn: {
        backgroundColor: "#FFC109",
        width: width,
        height: 0.1 * height,
        alignSelf: 'stretch'
      }

    });
    return (
      <View>
        <Header
          leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.props.navigation.navigate('DrawerToggle') }}
          centerComponent={{ text: 'Главная', color: '#fff' }}
          rightComponent={{ icon: 'home', color: '#fff', onPress: () => this.props.navigation.navigate("HomeScreen") }}
        />
        <MapView
          style={{ alignSelf: 'stretch', height: height * 0.4 }}
          region={{ latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude, latitudeDelta: 0.0422, longitudeDelta: 0.0721 }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onRegionChangeComplete={this._handleMapRegionChange}
        >
          {this._renderSites()}

        </MapView>
        <View>

          {
            this._renderSitesList(height * 0.5)
          }

        </View>

        {/* <Button
          buttonStyle={styles.getMoneyBtn}
          title="Снять деньги"
          onPress={() => console.log("Btn pressed")} /> */}

      </View>
    );
  }
}
var { height, width } = Dimensions.get('window');


//centered map
//https://snack.expo.io/SkqC-nNs-
//swiper
//https://snack.expo.io/BkaD_dIL-