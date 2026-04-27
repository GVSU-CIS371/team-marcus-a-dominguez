<template>
    <v-app-bar class="legoHeader">
        <img class="legoLogo" src="../assets/lego-logo.png" alt="Lego Logo" >
        <v-app-bar-title>Collectors</v-app-bar-title>
        <v-app-bar-nav-icon icon="mdi-menu" @click="showRightDrawer = !showRightDrawer"></v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer  class="HamburgerItems" location="right" permanent v-model="showRightDrawer">
        <v-list>
            <v-list-item v-if="!user" prepend-icon="mdi-login" to="/signIn" @click="showRightDrawer=false"> Sign-up / Login </v-list-item>
            <v-list-item prepend-icon="mdi-home" to="/">Home </v-list-item>
            <v-list-item v-if="user" prepend-icon="mdi-account" to="/profile"> Profile  </v-list-item>
            <v-list-item v-if="user" prepend-icon="mdi-account-group" to="/community">Community</v-list-item>
            <v-list-item v-if="user" prepend-icon="mdi-logout" @click="signOutUser"> Sign Out</v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { auth } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

const showRightDrawer = ref(false)
const user = ref(null)

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
  })
})

const signOutUser = async () => {
  await signOut(auth)
  showRightDrawer.value = false
}
</script>