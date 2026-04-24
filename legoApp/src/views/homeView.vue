<script setup lang="ts">
import img1 from '../assets/c_item1_Large.png'
import img2 from '../assets/c_item2_Large.png'
import img3 from '../assets/c_item3_Large.png'

</script>

<template>
  <div class="HomeWrapper">
  <h1 class="HomeTitle">A Digital Home For Your Legos</h1>
  <div class="PicsForHome">
    <v-carousel show-arrows="hover">
        <v-carousel-item :src="img1" cover></v-carousel-item>
        <v-carousel-item :src="img2" cover></v-carousel-item>
        <v-carousel-item :src="img3" cover></v-carousel-item>
    </v-carousel>

    <v-row class="HomeCardRow">
        <v-col cols="12" md="4">
            <v-card class="HomeCard HomeCard-Green"> 
                <v-card-title> Store and Share</v-card-title>
                <v-card-subtitle> Create a Profile, and log your lego Collection </v-card-subtitle>
                <v-card-text>Here you can share your lego Creations, Your sets collection and anything else lego related</v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" md="4">
            <v-card class="HomeCard HomeCard-Blue"> 
                <v-card-title> Start Now </v-card-title>
                <v-card-subtitle>Sign Up Using Google</v-card-subtitle>
                <v-card-text>Once you Sign Up You can begin to make your profile and share your collection</v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" md="4">
            <v-card class="HomeCard HomeCard-Green"> 
                <v-card-title> See the Community </v-card-title>
                <v-card-subtitle> See others lego collections as well </v-card-subtitle>
                <v-card-text> Get inspired by look at the communities legos, and looking at their cool builds</v-card-text>
            </v-card>
        </v-col>
    </v-row>
    </div>
  </div>
</template>
