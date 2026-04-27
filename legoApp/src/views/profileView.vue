<template>
  <v-container>
    <div v-if="loading"> Loading... </div>
    <template v-else>
      <div class="mainProfile">
        <h1>{{ profile.displayName }}'s Lego Collector Profile</h1>
        <v-avatar>
          <img v-if="profile?.profileImage" :src="profile.profileImage" />
          <img v-else src="../assets/profile.png" />
        </v-avatar>
        <h1>{{ profile.displayName }}</h1>
        <p>{{ profile.bio }}</p>
        <v-btn color="primary" @click="startEditing">
          Edit Profile
        </v-btn>
      </div>
      <v-divider class="my-6" />
      <v-row>
        <v-col cols="12" md="6">
          <strong>Favorite Theme:</strong>
          {{ profile.theme }}
        </v-col>
        <v-col cols="12" md="6">
          <strong>Favorite Thing About LEGO:</strong>
          {{ profile.favThing }}
        </v-col>
      </v-row>

      <section class="mt-10">
        <h2>My Sets ({{ sets.length }})</h2>
        <v-row>
          <!-- Display existing sets -->
          <v-col v-for="set in sets" :key="set.id" cols="12" sm="6" md="4" lg="3">
            <v-card class="h-100 d-flex flex-column">
              <div class="bg-grey-lighten-2 d-flex align-center justify-center" style="height: 200px; overflow: hidden;">
                <img 
                  v-if="set.image"
                  :src="set.image" 
                  :alt="set.name"
                  style="max-width: 100%; max-height: 100%; object-fit: cover; width: 100%; height: 100%;"
                  @error="() => console.log('Image failed to load:', set.image)"
                />
                <v-icon v-else size="60" color="grey">mdi-image-off</v-icon>
              </div>
              <v-card-text>
                <h3>{{ set.name }}</h3>
                <p v-if="set.createdAt" class="text-caption text-grey">
                  Added: {{ formatDate(set.createdAt) }}
                </p>
              </v-card-text>
              <v-card-actions class="mt-auto">
                <v-btn
                  size="small"
                  color="error"
                  variant="text"
                  @click="deleteSet(set.id)"
                >
                  Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <!-- Add new set card -->
          <v-col cols="12" sm="6" md="4" lg="3">
            <v-card
              class="h-100 d-flex align-center justify-center cursor-pointer"
              style="min-height: 300px;"
              @click="showSetDialog = true"
            >
              <div class="text-center">
                <v-icon size="60" color="primary">mdi-plus</v-icon>
                <div class="mt-2">Add Set</div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </section>

      <v-dialog v-model="showSetDialog" width="500">
        <v-card class="pa-6">
          <h2 class="mb-4">Add New Set</h2>

          <v-text-field
            v-model="newSetName"
            label="Set Name"
            placeholder="e.g., LEGO Millennium Falcon"
            class="mb-4"
          />

          <div class="mb-4">
            <p class="text-subtitle2 mb-2">Add Image (choose one option):</p>
            
            <v-tabs v-model="imageTab" class="mb-4">
              <v-tab value="upload">Upload File</v-tab>
              <v-tab value="url">Paste URL</v-tab>
            </v-tabs>

            <v-window v-model="imageTab">
              <v-window-item value="upload">
                <v-file-input
                  v-model="selectedFile"
                  label="Upload Set Image"
                  accept="image/*"
                  show-size
                  clearable
                  class="mt-2"
                />
              </v-window-item>

              <v-window-item value="url">
                <v-text-field
                  v-model="imageUrl"
                  label="Image URL"
                  placeholder="https://example.com/image.jpg"
                  clearable
                  class="mt-2"
                />
                <div v-if="imageUrl" class="mt-2 mb-2">
                  <p class="text-caption">Preview:</p>
                  <img 
                    :src="imageUrl" 
                    alt="Preview"
                    style="max-width: 100%; max-height: 150px; object-fit: cover;"
                    @error="() => imageUrlError = true"
                  />
                  <p v-if="imageUrlError" class="text-caption text-error mt-2">Image URL not accessible</p>
                </div>
              </v-window-item>
            </v-window>
          </div>

          <v-divider class="my-4" />

          <div class="d-flex gap-2">
            <v-btn
              color="primary"
              @click="addSet"
              :loading="isUploadingSet"
              :disabled="!newSetName || (!selectedFile && !imageUrl)"
            >
              Save Set
            </v-btn>
            <v-btn
              variant="text"
              @click="closeSetDialog"
            >
              Cancel
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage'
import { auth, db, storage } from '../firebase'
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc
} from 'firebase/firestore'

// Profile refs
const profile = ref<any>(null)
const originalProfile = ref(null)
const loading = ref(true)
const editing = ref(false)

// Sets refs
interface LegoSet {
  id: string
  name: string
  image: string
  createdAt?: any
}

const sets = ref<LegoSet[]>([])
const showSetDialog = ref(false)
const newSetName = ref('')
const selectedFile = ref<any>(null)
const imageUrl = ref('')
const imageUrlError = ref(false)
const imageTab = ref('upload')
const isUploadingSet = ref(false)

// Load profile from Firestore
const loadProfile = async () => {
  const user = auth.currentUser
  if (!user) return

  const snap = await getDoc(doc(db, 'users', user.uid))

  if (snap.exists()) {
    profile.value = snap.data()
  }

  loading.value = false
}

// Load sets from Firestore subcollection
const loadSets = async () => {
  const user = auth.currentUser
  if (!user) return

  try {
    const setsCollection = collection(db, 'collections', user.uid, 'sets')
    const setsSnapshot = await getDocs(setsCollection)

    sets.value = setsSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      image: doc.data().image,
      createdAt: doc.data().createdAt
    }))
  } catch (error) {
    console.error('Error loading sets:', error)
  }
}

// Format date for display
const formatDate = (timestamp: any): string => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString()
}

// Start editing profile
const startEditing = () => {
  originalProfile.value = {
    ...profile.value
  }
  editing.value = true
}

// Cancel edit
const cancelEdit = () => {
  profile.value = {
    ...originalProfile.value
  }
  editing.value = false
}

// Save profile changes
const saveProfile = async () => {
  const user = auth.currentUser
  if (!user) return

  await updateDoc(doc(db, 'users', user.uid), {
    bio: profile.value.bio,
    theme: profile.value.theme,
    favThing: profile.value.favThing
  })

  editing.value = false
}

// Close set dialog and reset form
const closeSetDialog = () => {
  showSetDialog.value = false
  newSetName.value = ''
  selectedFile.value = null
  imageUrl.value = ''
  imageUrlError.value = false
  imageTab.value = 'upload'
}

// Add new set with image upload or URL
const addSet = async () => {
  const user = auth.currentUser
  if (!user) return

  isUploadingSet.value = true

  try {
    let finalImageUrl = ''

    // Option 1: Upload file
    if (selectedFile.value && selectedFile.value[0]) {
      const file = selectedFile.value[0]
      console.log('Uploading file:', file.name, file.size)
      const fileRef = storageRef(storage, `sets/${user.uid}/${Date.now()}-${file.name}`)

      await uploadBytes(fileRef, file)
      console.log('File uploaded successfully')
      finalImageUrl = await getDownloadURL(fileRef)
      console.log('Image URL obtained:', finalImageUrl)
    }
    // Option 2: Use URL
    else if (imageUrl.value) {
      finalImageUrl = imageUrl.value
      console.log('Using provided URL:', finalImageUrl)
    }

    // Add set document to Firestore
    const docRef = await addDoc(
      collection(db, 'collections', user.uid, 'sets'),
      {
        name: newSetName.value,
        image: finalImageUrl,
        createdAt: new Date()
      }
    )

    // Add the new set to the local array
    sets.value.push({
      id: docRef.id,
      name: newSetName.value,
      image: finalImageUrl,
      createdAt: new Date()
    })

    // Close dialog and reset form
    closeSetDialog()
  } catch (error) {
    console.error('Error adding set:', error)
    alert('Failed to add set. Please try again.')
  } finally {
    isUploadingSet.value = false
  }
}

// Delete a set
const deleteSet = async (setId: string) => {
  const user = auth.currentUser
  if (!user) return

  if (!confirm('Are you sure you want to delete this set?')) {
    return
  }

  try {
    await deleteDoc(doc(db, 'collections', user.uid, 'sets', setId))

    // Remove from local array
    sets.value = sets.value.filter((set) => set.id !== setId)
  } catch (error) {
    console.error('Error deleting set:', error)
    alert('Failed to delete set. Please try again.')
  }
}

// Load data on mount
onMounted(async () => {
  try {
    await loadProfile()
    await loadSets()
  } catch (error) {
    console.error('Error loading data:', error)
    loading.value = false
  }
})
</script>