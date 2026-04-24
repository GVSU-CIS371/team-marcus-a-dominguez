 <script setup lang="ts">
    import { ref } from 'vue'

    const showRightDrawer = ref(false)

</script>

<template>
    <v-app-bar class="legoHeader">
        <img class="legoLogo" src="../assets/lego-logo.png" alt="Lego Logo" >
        <v-app-bar-title>Collectors</v-app-bar-title>
        <v-app-bar-nav-icon icon="mdi-menu" @click="showRightDrawer = !showRightDrawer"></v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer  class="HamburgerItems" location="right" permanent v-model="showRightDrawer">
        <v-list>
            <v-list-item prepend-icon="mdi-login">Sign Up</v-list-item>
            <v-list-item prepend-icon="mdi-home">Home</v-list-item>
            <v-list-item prepend-icon="mdi-account"> Profile </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>