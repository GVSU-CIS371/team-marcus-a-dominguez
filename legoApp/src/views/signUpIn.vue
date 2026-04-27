<template>
  <v-container>

    <v-card v-if="!user" class="SignInCard">
      <v-card-title>Welcome to Lego Collectors!!!</v-card-title>
      <v-card-subtitle > To Create Your intial profiles or Log Back In Please sign in With Google</v-card-subtitle>
      <div class="Sign-InBI">
        <v-btn color="primary" @click="signInWithGoogle">
        Sign in with Google
        </v-btn>
        <img class="WavingMan" src="../assets/wave.jpeg">
      </div>
    </v-card>
    <v-card v-else-if="user && !hasProfile" class="pa-6">
      <v-card-title>Complete Your Profile</v-card-title>

      <v-text-field v-model="FirstName" label="First Name" />
      <v-text-field v-model="LastName" label="Last Name" />
      <v-text-field v-model="displayName" label="Display Name Others Will See"/>
      <v-text-field v-model="theme" label="Favorite LEGO Theme" />
      <v-menu v-model="menuOpen" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-text-field
            v-model="birthday"
            label="Birthday"
            readonly
            prepend-icon="mdi-calendar"
            v-bind="props"
          />
        </template>
        <v-date-picker
          v-model="birthday"
          @update:modelValue="menuOpen = false"
        />
      </v-menu>
      <v-textarea v-model="bio" label="A small Bio of Yourself" />
      <v-textarea v-model="favThing" label="Favorite Thigns About Lego"/>
      

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

const FirstName = ref("");
const LastName = ref("");
const displayName = ref("");
const theme = ref("");
const bio = ref("");
const favThing = ref("");
const birthday = ref("");
const menuOpen = ref(false)

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
  }
};

const saveProfile = async () => {
  if (!user.value) return;

  await setDoc(doc(db, "users", user.value.uid), {
    uid: user.value.uid,
    email: user.value.email,

    firstName: FirstName.value,
    lastName: LastName.value,
    displayName: displayName.value,
    theme: theme.value,
    bio: bio.value,
    favThing: favThing.value,
  });

  hasProfile.value = true;
  router.push("/");
};

const signOutUser = async () => {
  await signOut(auth);
  user.value = null;
  hasProfile.value = false;
  FirstName.value = "";
  LastName.value = "";
  displayName.value = "";
  theme.value = "";
  bio.value = "";
  favThing.value = "";
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


