<template>
  <q-page>
    <!-- Dialog -->
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="enterCode" persistent>
        <q-card
          class="my-card text-white"
          style="background: radial-gradient(circle, #792d3f 0%, #571111 100%)">

          <q-card-section>
            <div class="text-h6">Auf geht's SCF</div>
            <div class="text-subtitle2">By BGB</div>
          </q-card-section>

          <q-card-section>
            <div class="text-subtitle2">Lieber SCF-Fan</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{ bodyText }}
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input color="lime-11" bg-color="lime-11" label-color="black" filled v-model="txtApplicationCode" label="Code hier eingeben">
              <template v-slot:append>
                <q-icon name="qr_code_2" />
              </template>
            </q-input>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{ cookieText }}
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-white" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="done" label="Ok" @click="getProperties(txtApplicationCode)" :disable="txtApplicationCode === ''" v-close-popup />
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
import { URLProperties, setCookie } from 'src/boot/utils.js'
import { ref } from 'vue'

export default {
  name: 'EnterCode',

  setup () {
    const $q = useQuasar()

    return {
      txtApplicationCode: ref(''),

      bodyText: 'Um diese Applikation für deinen Fanclub freizuschalten, benötigen wir einige Eckdaten. Bitte sende eine E-Mail an aufgehtsscf@gmail.com mit einer Kontakt-E-Mail-Adresse und dem Namen deiner Fan-Community. Du erhältst schnellstmöglich von uns einen kostenlosen Aktivierungscode.',

      cookieText: 'Diese Website verwendet Cookies, um Ihnen ein optimales Erlebnis zu bieten. Durch die Nutzung unserer Website erklären Sie sich damit einverstanden, dass wir Cookies verwenden. Klicken Sie auf "OK", um den Aktivierungscode einzugeben und der Cookie-Nutzung zuzustimmen.',

      onCodeIsValid () {
        $q.notify({
          type: 'positive',
          message: 'Der eingegebene Code ist gültig!'
        })
      },

      onCodeIsInvalid () {
        $q.notify({
          type: 'negative',
          message: 'Der eingegebene Code ist ungültig!'
        })
      },

      onCodeNotFound () {
        $q.notify({
          type: 'negative',
          message: 'Der eingegebene Code wurde nicht gefunden!'
        })
      },

      enterCode: ref(true)
    }
  },

  data () {
    return {
      URLProperties,
      setCookie
    }
  },

  computed: {
  },

  methods: {
    getProperties (_applicationCode) {
      let _adminCode = ''
      let _userCode = ''

      if (_applicationCode.length === 12) {
        if (_applicationCode.indexOf('_') > 0) {
          const _stringCode = _applicationCode.split('_')
          if (_stringCode[0].length === 8 && parseInt(_stringCode[1]) >= 329) {
            _userCode = _applicationCode
            _adminCode = _stringCode[1].substring(0, 1) + _stringCode[0].substring(0, 4) + _stringCode[1].substring(1, 2) + _stringCode[0].substring(4, 8) + _stringCode[1].substring(2, _stringCode[1].length)
          }
        }
      } else if (_applicationCode.length === 11) {
        _adminCode = _applicationCode
        _userCode = _applicationCode.substring(1, 5) + _applicationCode.substring(6, 10) + '_' + _applicationCode.substring(0, 1) + _applicationCode.substring(5, 6) + _applicationCode.substring(10, _applicationCode.length)
      }

      if (_adminCode === '' && _userCode === '') this.onCodeIsInvalid()
      else {
        this.$axios(`${this.URLProperties}&func=ReadAdminCode&adminCode=${_adminCode}`)
          .then((res) => {
            this.tableProperties = res.data.split('\n')

            if (res.data === '') this.onCodeIsInvalid()

            for (let index = 0; index < this.tableProperties.length - 1; index++) {
              const element = this.tableProperties[index].split(',')

              let _isAdministrator = 'false'
              if (element[1] === _applicationCode) _isAdministrator = 'true'

              const _clientName = element[3].trim()
              const _email = element[4].trim()
              const _homeTeam = element[5].trim()
              const _homeTeamAlias = element[6].trim()
              const _standardText = element[7].trim()
              const _updatedOn = element[23].trim()

              if (element[1] === _adminCode || element[2] === _userCode) this.setCookie(_isAdministrator, _applicationCode, _clientName, _email, _homeTeam, _homeTeamAlias, _standardText, _updatedOn)
              else this.onCodeNotFound()

              this.onCodeIsValid()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
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
