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

const _constUpdatedOn = ref('')

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: [
        {
          title: '',
          caption: '',
          icon: '',
          link: ''
        }],
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
      this.essentialLinks = []

      this.$axios(`${this.URLProperties}&func=ReadAdminCode&adminCode=${getAdminCode(getCookie('applicationCode'))}`)
        .then((res) => {
          const element = res.data.split(',')
          const _titleUrl1 = element[8].trim()
          const _captionUrl1 = element[9].trim()
          const _linkUrl1 = element[10].trim()
          this.essentialLinks.push({ title: _titleUrl1, caption: _captionUrl1, icon: 'favorite', link: _linkUrl1 })

          const _titleUrl2 = element[11].trim()
          const _captionUrl2 = element[12].trim()
          const _linkUrl2 = element[13].trim()
          this.essentialLinks.push({ title: _titleUrl2, caption: _captionUrl2, icon: 'drafts', link: _linkUrl2 })

          const _titleUrl3 = element[14].trim()
          const _captionUrl3 = element[15].trim()
          const _linkUrl3 = element[16].trim()
          this.essentialLinks.push({ title: _titleUrl3, caption: _captionUrl3, icon: 'public', link: _linkUrl3 })

          const _titleUrl4 = element[17].trim()
          const _captionUrl4 = element[18].trim()
          const _linkUrl4 = element[19].trim()
          this.essentialLinks.push({ title: _titleUrl4, caption: _captionUrl4, icon: 'rss_feed', link: _linkUrl4 })

          const _titleUrl5 = element[20].trim()
          const _captionUrl5 = element[21].trim()
          const _linkUrl5 = element[22].trim()
          this.essentialLinks.push({ title: _titleUrl5, caption: _captionUrl5, icon: 'record_voice_over', link: _linkUrl5 })

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
