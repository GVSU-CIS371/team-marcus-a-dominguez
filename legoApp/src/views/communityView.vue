<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

const collectors = ref([])

const loadCollectors = async () => {
  const snap = await getDocs(
    collection(db,'users')
  )

  collectors.value = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

onMounted(async () => {
  await loadCollectors()
})

const featuredSets = ref([
  {
    id:1,
    name:'AT-AT',
    owner:'Marcus',
    image:'https://www.lego.com/cdn/cs/set/assets/blt6d4c85ec676b3157/40806_Prod.png?format=webply&fit=bounds&quality=60&width=800&height=800&dpr=2'
  },
  {
    id:2,
    name:'Mario Kart™ – Luigi & Mach 8',
    owner:'Jordan',
    image:'https://www.lego.com/cdn/cs/set/assets/blt8b9de9e7d31005f9/72050_Prod.png?format=webply&fit=bounds&quality=60&width=800&height=800&dpr=2'
  }
])

const newSets = ref([
  {
    id:3,
    name:'X-Wing',
    image:'https://www.lego.com/cdn/cs/set/assets/blt3c7b337dee009946/75460_Prod.png?format=webply&fit=bounds&quality=60&width=800&height=800&dpr=2'
  }
])

const creations = ref([
  {
    id:1,
    name:'Custom Ferrari',
    creator: "SFH_Brick",
    image:'https://cdn.rebrickable.com/media/thumbs/mocs/moc-259898/891940.jpg/1000x800.jpg?1776796630.540086'
  },
  {
    id: 2,
    name: "Small Medieval House",
    creator: 'LCas89',
    image: 'https://cdn.rebrickable.com/media/thumbs/mocs/moc-91945/253233.jpg/1000x800.jpg?1752909199.4032836'
  }
])

// onMounted(() => {
// })
</script>

<template>
<v-container max-width="1200">

<section class="py-10 text-center">
  <h1 class="text-h3 font-weight-bold mb-3">
    LEGO Community
  </h1>

  <p class="text-medium-emphasis text-body-1">
    Discover collectors, featured builds, and community creations.
  </p>
</section>

<section class="mb-12">
<h2 class="mb-4">Featured Sets</h2>

<v-slide-group show-arrows>

<v-slide-group-item
v-for="set in featuredSets"
:key="set.id"
>
<v-card width="280" class="ma-3 rounded-xl">

<v-img
:src="set.image"
height="180"
cover
/>

<v-card-text>
<div class="text-subtitle-1 font-weight-bold">
{{ set.name }}
</div>

<div class="text-caption">
Added by {{ set.owner }}
</div>
</v-card-text>

</v-card>
</v-slide-group-item>

</v-slide-group>
</section>

<section class="mb-12">
<h2 class="mb-4">New Sets</h2>

<v-slide-group show-arrows>

<v-slide-group-item
v-for="set in newSets"
:key="set.id"
>
<v-card width="250" class="ma-3 rounded-xl">

<v-img
:src="set.image"
height="170"
cover
/>

<v-card-text>
{{ set.name }}
</v-card-text>

</v-card>
</v-slide-group-item>

</v-slide-group>
</section>


<section class="mb-12">
<h2 class="mb-4">Featured Collectors</h2>

<v-slide-group show-arrows>

<v-slide-group-item
v-for="collector in collectors"
:key="collector.id"
>

<v-card
width="240"
class="ma-3 pa-6 text-center rounded-xl"
:to="`/profile/${collector.id}`"
>

<v-avatar size="90" class="mb-4">
<img
    src="../assets/profile.png"
    alt="Profile avatar"
  />
</v-avatar>

<div class="text-h6">
{{ collector.displayName }}
</div>

<div class="text-body-2 text-medium-emphasis">
{{ collector.theme }} Collector
</div>

</v-card>

</v-slide-group-item>

</v-slide-group>
</section>


<section class="mb-16">
<h2 class="mb-4">Community Creations</h2>

<v-slide-group show-arrows>

<v-slide-group-item
v-for="creation in creations"
:key="creation.id"
>

<v-card width="280" class="ma-3 rounded-xl">

<v-img
:src="creation.image"
height="180"
cover
/>

<v-card-text>
<div class="text-subtitle-1 font-weight-bold">
    {{ creation.name }}
  </div>

  <div class="text-caption text-medium-emphasis">
    By {{ creation.creator }}
  </div>
</v-card-text>

</v-card>

</v-slide-group-item>

</v-slide-group>
</section>

</v-container>
</template>
