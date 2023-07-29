<template>
  <q-page>
    <!-- Dialog -->
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="enterCode" persistent>
        <q-card
          class="my-card text-white"
          style="background: radial-gradient(circle, #7e0210 0%, #59000b 100%)"
          >

          <q-card-section>
            <div class="text-h6">Einstellungen sind veraltet</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{ bodyText }}
          </q-card-section>
          <q-separator />

          <q-card-actions class="text-white" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="system_update" label="Updaten" @click="getProperties()" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <!-- End Dialog -->

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import useQuasar from 'quasar/src/composables/use-quasar.js'
import { URLProperties, getCookie, setCookie, getAdminCode } from 'src/boot/utils.js'
import { ref } from 'vue'

export default {
  name: 'EnterCode',

  setup () {
    const $q = useQuasar()

    return {
      bodyText: 'Ihr Administrator hat seit Ihrem letzten Besuch einige Anpassungen vorgenommen. Bitte aktualisieren Sie die Einstellungen.',

      onPropertiesUpdated () {
        $q.notify({
          type: 'positive',
          message: 'Die Einstellungen sind jetzt aktuell!'
        })
      },

      enterCode: ref(true)
    }
  },

  data () {
    return {
      URLProperties,
      getCookie,
      setCookie,
      getAdminCode
    }
  },

  computed: {
  },

  methods: {
    getProperties () {
      this.$axios(`${this.URLProperties}&func=ReadAdminCode&adminCode=${getAdminCode(getCookie('applicationCode'))}`)
        .then((res) => {
          this.tableProperties = res.data.split('\n')

          for (let index = 0; index < this.tableProperties.length - 1; index++) {
            const element = this.tableProperties[index].split(',')

            const _clientName = element[3].trim()
            const _email = element[4].trim()
            const _homeTeam = element[5].trim()
            const _homeTeamAlias = element[6].trim()
            const _standardText = element[7].trim()
            const _titleUrl1 = element[8].trim()
            const _captionUrl1 = element[9].trim()
            const _linkUrl1 = element[10].trim()
            const _titleUrl2 = element[11].trim()
            const _captionUrl2 = element[12].trim()
            const _linkUrl2 = element[13].trim()
            const _titleUrl3 = element[14].trim()
            const _captionUrl3 = element[15].trim()
            const _linkUrl3 = element[16].trim()
            const _titleUrl4 = element[17].trim()
            const _captionUrl4 = element[18].trim()
            const _linkUrl4 = element[19].trim()
            const _titleUrl5 = element[20].trim()
            const _captionUrl5 = element[21].trim()
            const _linkUrl5 = element[22].trim()
            const _updatedOn = element[23].trim().replace(/(?:\r\n|\r|\n)/g, '')

            this.setCookie(getCookie('isAdministrator'), getCookie('applicationCode'), _clientName, _email, _homeTeam, _homeTeamAlias, _standardText, _titleUrl1, _captionUrl1, _linkUrl1, _titleUrl2, _captionUrl2, _linkUrl2, _titleUrl3, _captionUrl3, _linkUrl3, _titleUrl4, _captionUrl4, _linkUrl4, _titleUrl5, _captionUrl5, _linkUrl5, _updatedOn)

            this.onPropertiesUpdated()
            this.refreshPage()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    async refreshPage () {
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      await sleep(3000)

      this.$router.push('/')
      await sleep(5000)
    }

  }
}
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>

<style lang="scss">
.header-image {
  height: 100%;
  z-index: -1;
  opacity: 0.2;
  filter: grayscale(100%);
}
</style>
