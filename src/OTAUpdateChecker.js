import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';

const CURRENT_VERSION = '1.0.3'; // 👈 Set your current app version here

const OTAUpdateChecker = () => {
  useEffect(() => {
    const checkForUpdate = async () => {
        try {
          const doc = await firestore().collection('updates').doc('android').get();
          const { version, bundleUrl } = doc.data();
      
          if (version !== CURRENT_VERSION) {
            const localDir = RNFS.DocumentDirectoryPath + '/update';
            const localPath = `${localDir}/index.android.bundle`;
      
            // Ensure directory exists
            const dirExists = await RNFS.exists(localDir);
            if (!dirExists) await RNFS.mkdir(localDir);
      
            // Download the file
            const downloadResult = await RNFS.downloadFile({
              fromUrl: bundleUrl,
              toFile: localPath
            }).promise;
      
            // Check success by inspecting status code
            if (downloadResult.statusCode === 200) {
              const fileExists = await RNFS.exists(localPath);

              console.log("file exisits",localPath)
              if (fileExists) {
                Alert.alert('Update downloaded', 'Please restart the app to apply the new version.');
              } else {
                Alert.alert('Download failed', 'Bundle file was not found after download.');
              }
            } else {
              Alert.alert('Download failed', `HTTP ${downloadResult.statusCode}`);
            }
          }
        } catch (err) {
          console.error('OTA check failed:', err);
          Alert.alert('Error', 'Failed to check for updates.');
        }
      };
    checkForUpdate();
  }, []);

  return null;
};

export default OTAUpdateChecker;