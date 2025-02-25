import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  Modal,
} from 'react-native';
import { useRestaurantHook } from '../api/hooks';
import {
  ActivityIndicator,
  IconButton,
  Portal,
  TouchableRipple,
  Modal as PaperModal,
  Dialog,
  Button,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import QRCodeModal from '../components/QrCodeModal';
import { AddMenuItemRoute, AppStackParamList, MenuLink } from '../util/routes';
import { MenuItem } from '../util/interfaces';

export default function MenuScreen() {
  const { imageApiLoading } = useSelector((state: RootState) => state.global);

  const [modalVisible, setModalVisible] = useState(false);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const route =
    useRoute<RouteProp<AppStackParamList, typeof AddMenuItemRoute>>();
  const { params } = route;
  const link = MenuLink(params?.subDomain);
  const { updateRestaurant, menuToJSON } = useRestaurantHook();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false); // For custom dropdown visibility

  const [newMenuItem, setNewMenuItem] = useState<MenuItem>({
    id: Date.now().toString(),
    name: '',
    description: '',
    price: '',
    category: '',
  });

  useEffect(() => {
    if (params?.menu) {
      const tempMenus = params?.menu.map((me, index) => {
        return me?.id ? me : { ...me, id: Date.now().toString() + '-' + index };
      });
      setMenuItems(tempMenus);
    }
  }, [params]);

  const openAddItemModal = () => {
    setNewMenuItem({
      id: Date.now().toString(),
      name: '',
      description: '',
      price: '',
      category: '',
    });
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const openEditItemModal = (item: MenuItem) => {
    setNewMenuItem(item);
    setIsEditing(true);
    setSelectedItemId(item.id);
    setIsModalVisible(true);
  };

  const compressImage = async (
    uri: string,
    fileSize: number,
    originalWidth: number,
    originalHeight: number,
  ) => {
    try {
      // Set the desired size to 500KB
      const desiredSizeKB = 500 * 1024;

      const compressionRatio = Math.min(1, desiredSizeKB / fileSize);

      const aspectRatio = originalWidth / originalHeight;
      const newWidth = Math.min(1200, originalWidth);
      const newHeight = newWidth / aspectRatio;

      let editedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: newWidth, height: newHeight } }],
        {
          compress: compressionRatio,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        },
      );
      if (editedImage.base64) {
        menuToJSON({ baseImage: editedImage.base64 }, menuItems, setMenuItems);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to Compress Image');
    }
  };

  const handlePickImage = async (): Promise<void> => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const imageUri = result.assets[0].uri;
        const fileSize = result.assets[0].fileSize || 0;
        const { width, height } = result.assets[0];
        compressImage(imageUri, fileSize, width, height);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to Pick Image');
    }
  };

  const handleCameraImage = async (): Promise<void> => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const imageUri = result.assets[0].uri;
        const fileSize = result.assets[0].fileSize || 0;
        const { width, height } = result.assets[0];
        compressImage(imageUri, fileSize, width, height);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to Open Camera');
    }
  };

  const saveNewItem = () => {
    if (isEditing && selectedItemId !== null) {
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.id === selectedItemId ? newMenuItem : item,
        ),
      );
    } else {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: newMenuItem.name,
        description: newMenuItem.description,
        price: newMenuItem.price,
        category: newMenuItem.category || 'other',
      };
      setMenuItems([...menuItems, newItem]);
    }
    setIsModalVisible(false);
  };
  const navigation = useNavigation();

  const handlePublish = () => {
    updateRestaurant({ ...params, menu: menuItems });
    navigation.goBack();
  };

  const renderItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemCategory}>Category: {item.category}</Text>
      <Text style={styles.itemPrice}>₹ {item.price}</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => openEditItemModal(item)}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const showDeleteDialog = () => setDeleteDialogVisible(true);
  const hideDeleteDialog = () => setDeleteDialogVisible(false);
  const handleDeleteConfirm = () => {
    // Handle the delete action here
    if (isEditing && selectedItemId !== null) {
      setMenuItems((prevItems) =>
        prevItems.filter((item) => item.id !== selectedItemId),
      );
      console.log('Item deleted');
    }
    setIsModalVisible(false);
    hideDeleteDialog();
  };

  return (
    <View style={styles.container}>
      <QRCodeModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        link={link}
      />

      <Portal>
        <PaperModal
          visible={imageApiLoading}
          dismissable={false}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            marginHorizontal: 'auto',
            borderRadius: 10,
          }}
        >
          <ActivityIndicator size="large" animating={true} />
        </PaperModal>
      </Portal>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <TouchableRipple
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Image source={require('../assets/Logo.png')} style={styles.logo} />
        </TouchableRipple>
      </View>

      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>
              Create {params?.restaurantName}’s Menu
            </Text>
            <Text style={styles.subtitle}>
              Customize your Dishes and Menu Layout
            </Text>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addItemButton}
            onPress={openAddItemModal}
          >
            <Text style={styles.addItemText}>+ Add Item</Text>
          </TouchableOpacity>
        }
      />

      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <IconButton icon={'attachment'} onPress={handlePickImage} />
        <IconButton icon={'camera'} onPress={handleCameraImage} />
      </View>

      <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
        <Text style={styles.publishButtonText}>Publish →</Text>
      </TouchableOpacity>

      {/* Modal for adding/editing items */}
      <Modal
        onDismiss={() => {
          setIsModalVisible(false);
        }}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
        transparent={true}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
          }}
          onPress={() => setIsModalVisible(false)}
        >
          <View
            style={{
              width: 300,
              padding: 20,
              // backgroundColor: 'white',
              borderRadius: 10,
              position: 'relative', // Ensures cross button can be positioned at the top-right
              alignItems: 'center',
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0, // Positioning the cross button to the top-right corner
                zIndex: 1, // Ensures the cross button is above other elements
                // backgroundColor: 'red',
              }}
            >
              {/* Cross button */}

              {/* Delete button */}
              <IconButton
                icon={'close'}
                onPress={() => setIsModalVisible(false)}
                style={{
                  padding: 0,
                  margin: 0,
                  marginBottom: 10,
                }}
                iconColor="white"
              />
              {isEditing && (
                <IconButton
                  icon={'delete'}
                  onPress={showDeleteDialog}
                  style={{ padding: 0, margin: 0 }}
                  iconColor="white"
                />
              )}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Menu Item Name"
              value={newMenuItem.name}
              onChangeText={(text) =>
                setNewMenuItem({ ...newMenuItem, name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newMenuItem.description}
              onChangeText={(text) =>
                setNewMenuItem({ ...newMenuItem, description: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="numeric"
              value={newMenuItem.price.toString() ?? ''}
              onChangeText={(text) =>
                setNewMenuItem({ ...newMenuItem, price: text })
              }
            />

            <TouchableOpacity
              style={styles.input}
              onPress={() => setDropdownVisible(!dropdownVisible)}
            >
              <Text>{newMenuItem.category || 'Select Category'}</Text>
            </TouchableOpacity>
            {dropdownVisible && (
              <View style={styles.dropdown}>
                {['Pizza', 'Pasta', 'Burgers', 'Drinks', 'Other'].map(
                  (category) => (
                    <TouchableOpacity
                      key={category}
                      onPress={() => {
                        setNewMenuItem({ ...newMenuItem, category });
                        setDropdownVisible(false);
                      }}
                      style={styles.dropdownItem}
                    >
                      <Text>{category}</Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>
            )}

            <TouchableOpacity style={styles.saveButton} onPress={saveNewItem}>
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Save Changes' : 'Save Item'}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
        {/* <View style={styles.modalContainer}>
          
        </View> */}
      </Modal>

      <Modal visible={isDeleteDialogVisible} transparent={true}>
        <Dialog visible={isDeleteDialogVisible} onDismiss={hideDeleteDialog}>
          <Dialog.Title>Confirm Delete</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this item?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDeleteDialog}>No</Button>
            <Button onPress={handleDeleteConfirm}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    width: 40,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  menuItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    position: 'relative',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  itemCategory: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  editButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#FF6F61',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addItemButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 20,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addItemText: {
    fontSize: 18,
    color: '#333',
  },
  publishButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    width: '80%',
    borderRadius: 8,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    position: 'absolute',
    // top: 140, // Adjust based on the location in your layout
    width: '80%',
    zIndex: 1,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#FC6011',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
