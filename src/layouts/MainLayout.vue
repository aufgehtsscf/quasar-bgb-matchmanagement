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
        <div class="text-h4" v-if="getCookie('clientName') !== 'TEST'">{{ getCookie('clientName') }} Spieltagsplanung</div>
        <div class="text-h4" v-if="getCookie('clientName') === 'TEST'">Auf geht's Spieltagsplanung</div>
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
            <q-item-section> Einstellungen updaten </q-item-section>
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

const _constTitleUrl1 = ref('')
const _constCaptionUrl1 = ref('')
const _constLinkUrl1 = ref('')
const _constTitleUrl2 = ref('')
const _constCaptionUrl2 = ref('')
const _constLinkUrl2 = ref('')
const _constTitleUrl3 = ref('')
const _constCaptionUrl3 = ref('')
const _constLinkUrl3 = ref('')
const _constTitleUrl4 = ref('')
const _constCaptionUrl4 = ref('')
const _constLinkUrl4 = ref('')
const _constTitleUrl5 = ref('')
const _constCaptionUrl5 = ref('')
const _constLinkUrl5 = ref('')
const _constUpdatedOn = ref('')

const linksList = [
  {
    title: _constTitleUrl1.value,
    caption: _constCaptionUrl1.value,
    icon: 'favorite',
    link: _constLinkUrl1.value
  },
  {
    title: _constTitleUrl2.value,
    caption: _constCaptionUrl2.value,
    icon: 'drafts',
    link: _constLinkUrl2.value
  },
  {
    title: _constTitleUrl3.value,
    caption: _constCaptionUrl3.value,
    icon: 'public',
    link: _constLinkUrl3.value
  },
  {
    title: _constTitleUrl4.value,
    caption: _constCaptionUrl4.value,
    icon: 'rss_feed',
    link: _constLinkUrl4.value
  },
  {
    title: _constTitleUrl5.value,
    caption: _constCaptionUrl5.value,
    icon: 'record_voice_over',
    link: _constLinkUrl5.value
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
      this.$axios(`${this.URLProperties}&func=ReadAdminCode&adminCode=${getAdminCode(getCookie('applicationCode'))}`)
        .then((res) => {
          const element = res.data.split(',')
          _constTitleUrl1.value = element[8].trim()
          _constCaptionUrl1.value = element[9].trim()
          _constLinkUrl1.value = element[10].trim()
          _constTitleUrl2.value = element[11].trim()
          _constCaptionUrl2.value = element[12].trim()
          _constLinkUrl2.value = element[13].trim()
          _constTitleUrl3.value = element[14].trim()
          _constCaptionUrl3.value = element[15].trim()
          _constLinkUrl3.value = element[16].trim()
          _constTitleUrl4.value = element[17].trim()
          _constCaptionUrl4.value = element[18].trim()
          _constLinkUrl4.value = element[19].trim()
          _constTitleUrl5.value = element[20].trim()
          _constCaptionUrl5.value = element[21].trim()
          _constLinkUrl5.value = element[22].trim()
          _constUpdatedOn.value = element[23].trim().replace(/(?:\r\n|\r|\n)/g, '')
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
