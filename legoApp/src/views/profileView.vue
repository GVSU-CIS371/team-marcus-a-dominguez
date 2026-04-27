<template>
<v-container>
  <div v-if="loading"> Loading... </div>
  <template v-else>
    <v-card class="pa-6 mx-auto" max-width="900">
      <div class="d-flex flex-column align-center ga-4">
        <v-avatar size="140">
          <img v-if="profile?.profileImage" :src="profile.profileImage" />
          <img v-else src="../assets/default-avatar.png" />
        </v-avatar>
        <h1>{{ profile.displayName }}</h1>
        <p>{{ profile.bio }}</p>
        <v-btn color="primary" to="/profile/edit">
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
    </v-card>

    <section class="mt-10">
      <h2>My Sets</h2>
      <v-slide-group show-arrows>
        <v-slide-group-item>
          <v-card width="220" class="ma-3 pa-4 text-center">
            <v-icon size="60">mdi-plus</v-icon>
            <div>Add Set</div>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </section>

    <section class="mt-10">
      <h2>My Creations</h2>
      <v-slide-group show-arrows>
        <v-slide-group-item>
          <v-card width="220" class="ma-3 pa-4 text-center">
            <v-icon size="60">mdi-plus</v-icon>
            <div>Add Creation</div>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </section>

    <section class="mt-10 mb-10">
      <h2>My Minifigures</h2>
      <v-slide-group show-arrows>
        <v-slide-group-item>
          <v-card width="220" class="ma-3 pa-4 text-center">
            <v-icon size="60">mdi-plus</v-icon>
            <div>Add Minifigure</div>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </section>
  </template>
</v-container>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

const profile = ref<any>(null)
const loading = ref(true)

const loadProfile = async () => {
  const user = auth.currentUser
  if (!user) return

  const snap = await getDoc(doc(db, 'users', user.uid))

  if (snap.exists()) {
    profile.value = snap.data()
  }

  loading.value = false
}

onMounted(loadProfile)
</script>