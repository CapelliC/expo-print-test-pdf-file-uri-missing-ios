import * as React from 'react';
import { Text, Image, View, StyleSheet, Button
	, Alert, ScrollView // CC
} from 'react-native';
import Constants from 'expo-constants';
import * as Print from 'expo-print';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
//import { Card } from 'react-native-paper';

// CC
import { Asset } from 'expo-asset'
import * as FileSystem from 'expo-file-system'

import * as ImageManipulator from "expo-image-manipulator"

export default class App extends React.Component {

  state = {
    image: null,
    
    required: null,
    local_doc: null,
    local_cache: null,
  }

  componentDidMount() {
    this.getPermissionAsync();
        
    const required = Asset.fromModule(require('./components/AssetExample/test.png'))
    console.log('required', required)
    this.setState({required})
    
    required.downloadAsync().then(() => {
console.log('required.localUri', required.localUri)

			const local_doc = FileSystem.documentDirectory+'local_doc.png'
			FileSystem.copyAsync({
				from: required.localUri,
				to: local_doc
			}).then(() => {
				console.log('local_doc', local_doc)
				this.setState({local_doc})
			})
			
			const local_cache = FileSystem.cacheDirectory+'local_cache.png'
			FileSystem.copyAsync({
				from: required.localUri,
				to: local_cache
			}).then(() => {
				console.log('local_cache', local_cache)
				this.setState({local_cache})
			})
    })
    .catch(e => {
      Alert.alert('exception', JSON.stringify(e))
    })
		
  }

  getPermissionAsync = async () => {
    //if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    //}
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log('result',result);

    if (!result.cancelled) {
      this.setState({ image: result });
    }
  }
  
  async _printPdf() {
    const { image, required, local_doc, local_cache } = this.state
console.log('print images:', this.state)
    const b64_local_cache = await ImageManipulator.manipulateAsync(local_cache, [], {base64:true})
console.log('b64_local_cache:', b64_local_cache)

		Print.printAsync({
			html: `
<html>
<head>
   <meta name="viewport" content ="width=device-width,initial-scale=1,user-scalable=yes" />
</head>
<body>
	<div style="height:100%; margin: 0px">

		<h1>local image from photo:</h1>
		<img src="${image.uri}" width="300" height="300" />

		<h1>B64 local doc:</h1>
		<img src="data:image/png;base64,${b64_local_cache.base64}" width="300" height="300" />
    
		<h1>from local doc:</h1>
		<img src="${local_doc}" width="300" height="300" />

		<h1>from local cache:</h1>
		<img src="${local_cache}" width="300" height="300" />

		<h1>required:</h1>
		<img src="${required.uri}" width="300" height="300" />

		<h1>required localUri:</h1>
		<img src="${required.localUri}" width="300" height="300" />

		<h1>remote image</h1>
		<img src="https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" style="border:3px;" width="300" height="300" />

	</div>
</body>
</html>`
    })

  }
  render() {
    const { image, required, local_doc, local_cache } = this.state;
console.log('images:', image, required, local_doc, local_cache)
    return (
      <ScrollView style={styles.container}>

				{image === null
					&& <Button title="First, pick an image" onPress={this._pickImage} />
				}
				{image &&
					<View>
						<Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />
						<Button title="Then, print" onPress={()=>this._printPdf()} />
					</View>
				}
				
				<Text>local doc</Text>
				{local_doc &&
					<Image source={{ uri: local_doc }} style={{ width: 200, height: 200 }} />}
					
				<Text>local cache</Text>
				{local_cache &&
					<Image source={{ uri: local_cache }} style={{ width: 200, height: 200 }} />}

				<Text>required</Text>
				{required &&
					<Image source={{ uri: required.uri }} style={{ width: 200, height: 200 }} />}

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
