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
        <div class="text-h4" v-if="clientNameFromTenant !== 'HOME'">{{ clientNameFromTenant }} Spieltagsplanung</div>
        <div class="text-h4" v-if="clientNameFromTenant === 'HOME'">Auf geht's Spieltagsplanung</div>
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
      <q-scroll-area v-if="clientNameFromTenant === 'HOME'"
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

        </q-list>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-scroll-area>

      <q-scroll-area v-if="clientNameFromTenant !== 'HOME'"
              style="
                height: calc(100% - 192px);
                margin-top: 192px;
                border-right: 1px solid #ddd;
              "
      >
        <q-list padding>
          <q-item to="/participant" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="emoji_people" />
            </q-item-section>
            <q-item-section> Teilnehmer </q-item-section>
          </q-item>

          <q-item to="/match" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="sports_volleyball" />
            </q-item-section>
            <q-item-section> Spiele </q-item-section>
          </q-item>

          <q-item to="/member" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section> Mitglieder </q-item-section>
          </q-item>

          <q-item to="/team" exact clickable v-ripple v-if="getCookie('isAdministrator')">
            <q-item-section avatar>
              <q-icon name="groups" />
            </q-item-section>
            <q-item-section> Teams </q-item-section>
          </q-item>

          <q-item to="/order" exact clickable v-ripple v-if="clientNameFromTenant === 'NONE'">
            <q-item-section avatar>
              <q-icon name="shopping_cart" />
            </q-item-section>
            <q-item-section> Bestellungen </q-item-section>
          </q-item>

          <q-item to="/link" exact clickable v-ripple v-if="getCookie('isAdministrator')">
            <q-item-section avatar>
              <q-icon name="link" />
            </q-item-section>
            <q-item-section> Links </q-item-section>
          </q-item>

          <q-item to="/setting" exact clickable v-ripple v-if="getCookie('isAdministrator')">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section> Settings </q-item-section>
          </q-item>
        </q-list>

        <q-item-label header>  </q-item-label>

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
import { getAdminCode, getCookie, getLogo, URLMatchManagementAPI } from 'src/boot/utils.js'

const _constAdminCode = ref('')
const _constClientNameFromTenant = ref('')

let _TenantId = ''
let _URLTenant = ''
let _URLLink = ''

const linksList = [
  {
    title: 'Wichtige Links',
    caption: '',
    icon: '',
    url: '',
    href: ''
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
      URLMatchManagementAPI,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },

      clientNameFromTenant: ref(_constClientNameFromTenant)
    }
  },

  computed: {
    todaysDate () {
      return new Date().toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  },

  mounted () {
    this.setVariables().then(() => {
      this.getTenantId().then(() => {
        this.getTableLink()
      })
    })
  },

  methods: {
    setVariables () {
      _constAdminCode.value = getAdminCode(getCookie('applicationCode'))
      _URLTenant = URLMatchManagementAPI + '/Tenant'
      _URLLink = URLMatchManagementAPI + '/Link'

      return Promise.resolve()
    },

    getTenantId (): Promise<void> {
      return new Promise((resolve, reject) => {
        this.$axios.get(`${_URLTenant}/code/${_constAdminCode.value}`)
          .then((res) => {
            if (res.status === 200) {
              _TenantId = res.data.id
              _constClientNameFromTenant.value = res.data.name
              resolve()
            } else {
              console.log('Unexpected status code:', res.status)
              reject(new Error('Unexpected status code'))
            }
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      })
    },

    getTableLink () {
      this.$axios.get(`${_URLLink}/${_TenantId}`)
        .then((res) => {
          if (res.status === 200) {
            for (let index = 0; index < res.data.length; index++) {
              let _icon = ''
              switch (res.data[index].title) {
                case 'E-Mail':
                  _icon = 'drafts'
                  break
                case 'Facebook':
                  _icon = 'public'
                  break
                case 'Z':
                  _icon = 'rss_feed'
                  break
                case 'Instagram':
                  _icon = 'record_voice_over'
                  break

                default:
                  _icon = 'favorite'
                  break
              }

              this.setLinkList(res.data[index].title, res.data[index].caption, _icon, res.data[index].url)
            }
          } else {
            console.log('Unexpected status code:', res.status)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setLinkList (_title: string, _caption: string, _icon: string, _url: string) {
      linksList.push({ title: _title, caption: _caption, icon: _icon, url: _url, href: _url })
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
