import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    PermissionsAndroid,
} from 'react-native';
import {
    Container,
    Content,
    Card,
} from 'native-base';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker, ProviderPropType } from 'react-native-maps';


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

function randomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, 0)}`;
}

class DefaultMarkers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            region: [{
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            }, {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            }],
            regionP1: {
                latitude: LATITUDE + 0.5,
                longitude: LONGITUDE - 0.2,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            markers: [],
        };
    }

    onMapPress(e) {
        this.setState({
            markers: [
                ...this.state.markers,
                {
                    coordinate: e.nativeEvent.coordinate,
                    key: id++,
                    color: randomColor(),
                },
            ],
        });
    }

    myLocation = async (val) => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Query Location',
                    message: 'Query a location',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(
                    (position) => {
                        let region = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }
                        let regionP1 = {
                            latitude: region.latitude + Math.random(),
                            longitude: region.longitude - Math.random(),
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }
                        // let apiKey = "AIzaSyBAefhRlXEH3vCko-zZTX6PHllTR6av4WI"
                        // fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + region.latitude + ',' + region.longitude + '&key=' + apiKey)
                        //     .then((resp) => resp.json())
                        //     .then((respJson) => {
                        //         alert(JSON.stringify(respJson))
                        //     })
                        let reg = this.state.region
                        if (val == 0){
                            reg[0] = region
                        } else if (val == 1) {
                            reg[1] = regionP1
                        } else {
                            reg[2] = regionP1
                        }
                        this.setState({ region: reg })
                    },
                    (error) => this.setState({ error: error.message }),
                    // { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
                )
            } else {
                alert("denied")
            }

        } catch (err) {
            alert(err.message)
        }
    }

    componentDidMount() {

    }

    render() {


        return (
            <Container styles={StyleSheet.absoluteFillObject}>
                <Content styles={StyleSheet.absoluteFillObject}>
                    <Card styles={styles.mapView}>
                        <MapView
                            provider={this.props.provider}
                            style={styles.map}
                            initialRegion={this.state.region[0]}
                            region={this.state.region[0]}
                            showsMyLocationButton={true}
                            liteMode={false}
                            mapType={'standard'}
                            onPress={(e) => this.onMapPress(e)}
                        >
                            {this.state.markers.map(marker => (
                                <Marker
                                    key={marker.key}
                                    coordinate={marker.coordinate}
                                    pinColor={marker.color}
                                />
                            ))}
                        </MapView>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={() => this.myLocation(0)}
                                style={styles.bubble}
                            >
                                <Text>Find my location</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => alert(JSON.stringify(this.state.region[0]))}
                                style={styles.bubble}
                            >
                                <Text>My LongLat</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                    <Card styles={StyleSheet.absoluteFillObject}>
                        <MapView
                            provider={this.props.provider}
                            style={styles.map}
                            initialRegion={this.state.region[1]}
                            region={this.state.region[1]}
                            showsMyLocationButton={true}
                            liteMode={false}
                            mapType={'standard'}
                            onPress={(e) => this.onMapPress(e)}
                        >
                            {this.state.markers.map(marker => (
                                <Marker
                                    key={marker.key}
                                    coordinate={marker.coordinate}
                                    pinColor={marker.color}
                                />
                            ))}
                        </MapView>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={() => this.myLocation(1)}
                                style={styles.bubble}
                            >
                                <Text>Person1 Location</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => alert(JSON.stringify(this.state.region[1]))}
                                style={styles.bubble}
                            >
                                <Text>Person1 LongLat</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                    <Card styles={StyleSheet.absoluteFillObject}>
                        <MapView
                            provider={this.props.provider}
                            style={styles.map}
                            initialRegion={this.state.region[2]}
                            region={this.state.region[2]}
                            showsMyLocationButton={true}
                            liteMode={false}
                            mapType={'standard'}
                            onPress={(e) => this.onMapPress(e)}
                        >
                            {this.state.markers.map(marker => (
                                <Marker
                                    key={marker.key}
                                    coordinate={marker.coordinate}
                                    pinColor={marker.color}
                                />
                            ))}
                        </MapView>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={() => this.myLocation(2)}
                                style={styles.bubble}
                            >
                                <Text>Person2 Location</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => alert(JSON.stringify(this.state.region[2]))}
                                style={styles.bubble}
                            >
                                <Text>Person2 LongLat</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                </Content>
            </Container>

        );
    }
}

DefaultMarkers.propTypes = {
    provider: ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        // ...StyleSheet.absoluteFillObject,
        height: 200,
        marginVertical: 20
    },
    mapView: {
        borderBottomColor: 'red',
        borderRadius: 50,
    },
    bubble: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    latlng: {
        width: 200,
        alignItems: 'stretch',
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
    },
});

export default DefaultMarkers;