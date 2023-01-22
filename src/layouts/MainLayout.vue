<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
      </q-toolbar>
      <div class="q-px-lg q-pt-xl q-mb-md">
        <div class="text-h4">BGB Spieltagsplanung</div>
        <div class="text-subtitle1">{{ todaysDate }}</div>
      </div>
      <q-img src="statics/BGBLow.jpg" class="header-image absolute-top" />
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="350"
      :breakpoint="600"
    >
      <q-scroll-area
        style="
          height: calc(100% - 192px);
          margin-top: 192px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list padding>
          <q-item to="/" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>

            <q-item-section> Home </q-item-section>
          </q-item>

          <q-item to="/match" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="star" />
            </q-item-section>

            <q-item-section> Spiele </q-item-section>
          </q-item>
        </q-list>

        <q-item-label header> Wichtige Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-scroll-area>

      <q-img class="absolute-top" src="statics/BGB.jpg" style="height: 192px">
      </q-img>
    </q-drawer>

    <q-page-container>
      <KeepAlive>
        <router-view />
      </KeepAlive>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { date } from 'quasar'

const linksList = [
  {
    title: 'Homepage',
    caption: 'Bier Guerilla Breisgau',
    icon: 'favorite',
    link: 'http://www.fanclub-bgb.de/'
  },
  {
    title: 'Email',
    caption: 'bgb@dirkschnaiter.de',
    icon: 'drafts',
    link: 'mailto:bgb@dirkschnaiter.de'
  },
  {
    title: 'Facebook',
    caption: 'facebook.com/bierguerillabreisgau',
    icon: 'public',
    link: 'https://www.facebook.com/bierguerillabreisgau'
  },
  {
    title: 'Twitter',
    caption: 'twitter.com/B_Guerilla',
    icon: 'rss_feed',
    link: 'https://twitter.com/B_Guerilla'
  },
  {
    title: 'Instagram',
    caption: 'instagram.com/bierguerillabreisgau',
    icon: 'record_voice_over',
    link: 'https://www.instagram.com/bierguerillabreisgau'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },

  computed: {
    todaysDate () {
      const timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM')
    }
  }
})
</script>

<style lang="scss">
.header-image {
  height: 100%;
  z-index: -1;
  opacity: 0.2;
  filter: grayscale(100%);
}
</style>
