<template>
  <v-container>

    <v-card v-if="!user" class="pa-6 text-center">
      <v-card-title>Sign up or Log In With Google</v-card-title>
      <v-card-subtitle > To create your intial profile please sign in with Google then fill out the following field</v-card-subtitle>
      <v-card-subtitle > If you already have an account just sign in with Google</v-card-subtitle>

      <v-btn color="primary" @click="signInWithGoogle">
        Sign in with Google
      </v-btn>
    </v-card>
    <v-card v-else-if="user && !hasProfile" class="pa-6">
      <v-card-title>Complete Your Profile</v-card-title>

      <v-text-field v-model="name" label="Display Name" />
      <v-text-field v-model="theme" label="Favorite LEGO Theme" />
      <v-textarea v-model="bio" label="Bio" />

      <v-btn color="success" @click="saveProfile">
        Done
      </v-btn>
    </v-card>
    <v-card> 
      
    </v-card>
    
    <v-btn v-if="user" color="error" variant="outlined" class="mt-6" @click="signOutUser">
  Temporary Sign Out (UI Testing)
</v-btn> 
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import { auth, db } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged, 
  signOut,
} from "firebase/auth";

import { doc, getDoc, setDoc } from "firebase/firestore";

const router = useRouter();

const user = ref<any>(null);
const hasProfile = ref(false);

const name = ref("");
const theme = ref("");
const bio = ref("");
const birthday = ref("");
const displayName = ref("");


const provider = new GoogleAuthProvider(); 

const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  user.value = result.user;

  await checkProfile();
};

const checkProfile = async () => {
  if (!user.value) return;

  const ref = doc(db, "users", user.value.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    hasProfile.value = true;
    router.push("/");
  } else {
    hasProfile.value = false;

    // prefill from Google
    name.value = user.value.displayName || "";
  }
};

const saveProfile = async () => {
  if (!user.value) return;

  await setDoc(doc(db, "users", user.value.uid), {
    uid: user.value.uid,
    email: user.value.email,
    name: name.value,
    theme: theme.value,
    bio: bio.value,
  });

  hasProfile.value = true;
  router.push("/");
};
const signOutUser = async () => {
  await signOut(auth);

  // reset UI state for testing
  user.value = null;
  hasProfile.value = false;

  name.value = "";
  theme.value = "";
  bio.value = "";
};

onMounted(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      user.value = currentUser;
      await checkProfile();
    }
  });
});
</script>


