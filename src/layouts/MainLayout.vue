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
        <div class="text-h4">{{ getCookie('clientName') }} Spieltagsplanung</div>
        <div class="text-subtitle1">{{ todaysDate }}</div>
      </div>
      <q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
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
              <q-icon name="sports_volleyball" />
            </q-item-section>
            <q-item-section> Spiele </q-item-section>
          </q-item>

          <q-item to="/whereismycard" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="credit_card" />
            </q-item-section>
            <q-item-section> Wer hat meine Karte? </q-item-section>
          </q-item>

          <q-item to="/member" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section> Mitglieder </q-item-section>
          </q-item>

          <q-item to="/order" exact clickable v-ripple v-if="getCookie('clientName') === 'BGB'">
            <q-item-section avatar>
              <q-icon name="shopping_cart" />
            </q-item-section>
            <q-item-section> Bestellungen </q-item-section>
          </q-item>

          <q-item to="/properties" exact clickable v-ripple v-if="getCookie('clientName') !== 'TEST' && getCookie('isAdministrator') === 'true'">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section> Einstellungen </q-item-section>
          </q-item>

          <q-item to="/entercode" exact clickable v-ripple v-if="getCookie('clientName') === 'TEST'">
            <q-item-section avatar>
              <q-icon name="qr_code_2" />
            </q-item-section>
            <q-item-section> Hast du einen Code? </q-item-section>
          </q-item>

          <q-item to="/updateproperties" exact clickable v-ripple v-if="getCookie('isAdministrator') === 'false' && getCookie('updatedOn') !== txtUpdatedOn">
            <q-item-section avatar>
              <q-icon name="system_update" />
            </q-item-section>
            <q-item-section> Update verfügbar </q-item-section>
          </q-item>
        </q-list>

        <q-item-label header> Wichtige Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-scroll-area>

      <q-img class="absolute-top" :src="getLogo(getAdminCode(getCookie('applicationCode')))" style="height: 182px">
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
import { getAdminCode, getCookie, getLogo, URLProperties } from 'src/boot/utils.js'
import { date } from 'quasar'

const _constUpdatedOn = ref('')

const linksList = [
  {
    title: getCookie('titleUrl1'),
    caption: getCookie('captionUrl1'),
    icon: 'favorite',
    link: getCookie('linkUrl1')
  },
  {
    title: getCookie('titleUrl2'),
    caption: getCookie('captionUrl2'),
    icon: 'drafts',
    link: getCookie('linkUrl2')
  },
  {
    title: getCookie('titleUrl3'),
    caption: getCookie('captionUrl3'),
    icon: 'public',
    link: getCookie('linkUrl3')
  },
  {
    title: getCookie('titleUrl4'),
    caption: getCookie('captionUrl4'),
    icon: 'rss_feed',
    link: getCookie('linkUrl4')
  },
  {
    title: getCookie('titleUrl5'),
    caption: getCookie('captionUrl5'),
    icon: 'record_voice_over',
    link: getCookie('linkUrl5')
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
      getAdminCode,
      getCookie,
      getLogo,
      URLProperties,
      txtUpdatedOn: ref(_constUpdatedOn),
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
  },

  mounted () {
    this.getTableProperties()
  },

  methods: {
    async getTableProperties () {
      // console.log('URLProperties: ' + this.URLProperties + '&func=ReadAdminCode&adminCode=' + getAdminCode(getCookie('applicationCode'), true))
      this.$axios(`${this.URLProperties}&func=ReadAdminCode&adminCode=${getAdminCode(getCookie('applicationCode'), true)}`)
        .then((res) => {
          const element = res.data.split(',')
          _constUpdatedOn.value = element[23].replace(/(?:\r\n|\r|\n)/g, '')
        })
        .catch((err) => {
          console.log(err)
        })
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
