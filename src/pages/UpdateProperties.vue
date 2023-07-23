<template>
  <q-page>
    <!-- Dialog -->
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="enterCode" persistent>
        <q-card
          class="my-card text-white"
          style="background: radial-gradient(circle, #792d3f 0%, #571111 100%)"
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
            const _updatedOn = element[23].trim().replace(/(?:\r\n|\r|\n)/g, '')

            this.setCookie(getCookie('isAdministrator'), getCookie('applicationCode'), _clientName, _email, _homeTeam, _homeTeamAlias, _standardText, _updatedOn)

            this.onPropertiesUpdated()
          }
        })
        .catch((err) => {
          console.log(err)
        })
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
