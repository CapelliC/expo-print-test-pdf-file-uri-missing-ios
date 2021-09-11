# expo-print-test-pdf-file-uri-missing-ios
highlight the different treatment that file:// uri images get on iOS vs Android when using Print.printAsync

###

follow up of https://github.com/expo/expo/issues/7435, as per https://github.com/expo/expo/issues/7435#issuecomment-613353712

###

have removed the dependencies

    "react-native-paper": "^3.8.0",
    "react-native-web": "~0.11.7",

and added a components/AssetExample/test.png that gets copied in FileSystem cache & documents folder at startup
and these dependencies

    "expo-file-system": "~8.1.0",
    "expo-asset": "~8.1.3"

###

The iOS PDF did showed the local images at least til SDK ver.31,
after I discovered that passing the (undocumented?) option
*baseUrl* to Print.printAsync allowed the iOS print engine to load the image files.

Then I had to upgrade to the latest SDK, to follow up with maintenance duties,
and the PDF doesn't show any kind of file:// URIs

###

As apparent, now (Expo SDK 42) the Android behaviour became the same as iOS.
That is, the PDF no more shows images from the file system, just remote URLs or base64 inlined.
