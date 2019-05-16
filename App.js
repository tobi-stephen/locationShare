import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import GeoFencing from 'react-native-geo-fencing';
import MapView, { Polygon, Marker, ProviderPropType } from 'react-native-maps';


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 3.78825;
const LONGITUDE = -6.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

function randomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, 0)}`;
}

class DefaultMarkers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            geofence: false,
            track: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            coordinate: {
                latitude: 37.8025259, longitude: -122.4351431
            },
            polygon: [
                { lat: 3.1336599385978805, lng: 6.31866455078125 },
                { lat: 3.3091633559540123, lng: 6.66198730468757 },
                { lat: 3.091150714460597,  lng: 6.92977905273438 },
                { lat: 2.7222113428196213, lng: 6.74850463867188 },
                { lat: 2.7153526167685347, lng: 6.47933959960938 },
                { lat: 3.1336599385978805, lng: 6.31866455078125 }
            ],
            coordinates: [
                { latitude: 3.1336599385978805, longitude: 6.31866455078125 },
                { latitude: 3.3091633559540123, longitude: 6.66198730468757 },
                { latitude: 3.1336599385978805, longitude: 6.31866455078125 }
            ]
        };
    }

    onMapPress(e) {
        this.setState({
            coordinate: e.nativeEvent.coordinate
        })
    }

    checkUser = async () => {

        if (!this.state.geofence){
            alert("set geofence first")
            return
        }

        let polygon = this.state.polygon
        let point = this.state.point
                        
        GeoFencing.containsLocation(point, polygon)
        .then(() => alert('user is within geofence'))
        .catch(() => alert('user is NOT within geofence'))
    }

    // checkUser = async () => {
    //     try {
    //         const granted = await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //             {
    //                 title: 'Query Location',
    //                 message: 'Query a location',
    //                 buttonNeutral: 'Ask Me Later',
    //                 buttonNegative: 'Cancel',
    //                 buttonPositive: 'OK',
    //             },
    //         );
    //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //             Geolocation.getCurrentPosition(
    //                 (position) => {

    //                     let point = {
    //                         lat: position.coords.latitude,
    //                         lng: position.coords.longitude
    //                     };

    //                     let polygon = this.state.polygon
                        
    //                       GeoFencing.containsLocation(point, polygon)
    //                       .then(() => alert('user is within geofence'))
    //                       .catch(() => alert('user is NOT within geofence')) 
                        
    //                 },
    //                 (error) => this.setState({ error: error.message }),
    //             )
    //         } else {
    //             alert("denied")
    //         }

    //     } catch (err) {
    //         alert(err.message)
    //     }
    // }

    setGeofence = async (offset) => {
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
                        let track = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }

                        let lat = position.coords.latitude
                        let lng = position.coords.longitude
                        const polygon = [
                            { lat: lat - offset, lng: lng - offset },
                            { lat: lat + offset, lng: lng - offset },
                            { lat: lat + offset, lng: lng + offset },
                            { lat: lat - offset, lng: lng + offset },
                            { lat: lat - offset, lng: lng - offset } // last point has to be same as first point
                        ];

                        const coordinates = [
                            { latitude: lat - offset, longitude: lng - offset },
                            { latitude: lat + offset, longitude: lng - offset },
                            { latitude: lat + offset, longitude: lng + offset },
                            { latitude: lat - offset, longitude: lng + offset },
                            { latitude: lat - offset, longitude: lng - offset } // last point has to be same as first point
                        ];

                        let coordinate = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        }

                        let point = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        this.setState({ geofence: true, track, coordinate, coordinates, polygon })
                    },
                    (error) => this.setState({ error: error.message }),
                    { enableHighAccuracy: true },
                )
            } else {
                alert("denied")
            }

        } catch (err) {
            alert(err.message)
        }
    }

    async componentDidMount() {
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
                this.watchId = Geolocation.watchPosition(
                    (position) => {
                        let track = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }

                        let point = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        let coordinate = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        }

                        this.setState({ track, coordinate, point })

                        if (this.state.geofence)
                        GeoFencing.containsLocation(point, this.state.polygon)
                        .then(() => alert('user is within geofence'))
                        .catch(() => alert('user is NOT within geofence'))
                    },
                    (error) => this.setState({ error: error.message }),
                    { enableHighAccuracy: true, interval: 10000, fastestInterval: 5000, distanceFilter: 1, },
                )
            } else {
                alert("denied")
            }

        } catch (err) {
            alert(err.message)
        }
    }

    componentWillUnmount() {
        Geolocation.clearWatch(this.watchId);
    }

    render() {
        return (
            <View styles={styles.container}>
                <MapView
                    provider={this.props.provider}
                    style={styles.map}
                    region={this.state.track}
                    showsMyLocationButton={true}
                    onPress={(e) => {
                        let position = e.nativeEvent.coordinate
                        let point = {
                            lat: position.latitude,
                            lng: position.longitude
                        };
                        this.setState({point, coordinate: e.nativeEvent.coordinate})
                    }}
                >
                    <Polygon
                        coordinates={this.state.coordinates}
                        strokeColor="#000"
                        strokeWidth={6}
                    />
                    <Marker
                        coordinate={this.state.coordinate}
                        pinColor={randomColor()}
                        title={'user0'}
                    />
                </MapView>
                <View style={{ ...styles.buttonContainer, }}>
                    <TouchableOpacity
                        onPress={() => this.setGeofence(0.0001)}
                        style={styles.bubble}
                    >
                        <Text style={styles.button}>Set Geofence</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.setGeofence(0.008)}
                        style={styles.bubble}
                    >
                        <Text style={styles.button}>Set Larger Geofence</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.checkUser()}
                        style={styles.bubble}
                    >
                        <Text style={styles.button}>Check if user in geofence</Text>
                    </TouchableOpacity>
                </View>


            </View>
        )
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
        ...StyleSheet.absoluteFillObject,
        height: height
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
        // width: 80,
        color: 'red',
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'column',
        // justifyContent: 'flex-end',

        marginVertical: 20,
        backgroundColor: 'transparent',

    },
});

export default DefaultMarkers;