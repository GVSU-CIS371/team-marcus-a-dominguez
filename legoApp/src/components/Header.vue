 <script setup lang="ts">
    import { ref } from 'vue'

    const showRightDrawer = ref(false)

</script>

<template>
    <v-app>
        <v-app-bar class="legoHeader">
            <v-app-bar-title>Lego Collectors</v-app-bar-title>
            <v-app-bar-nav-icon @click="showRightDrawer = !showRightDrawer"></v-app-bar-nav-icon>
        </v-app-bar>
        <v-navigation-drawer location="right" permanent v-model="showRightDrawer">
        </v-navigation-drawer>
        <v-main>
            <ul>
                <li>Sign In</li>
                <li>Home</li>
                <li>Profile</li>
            </ul>
        </v-main>
    </v-app>
</template>