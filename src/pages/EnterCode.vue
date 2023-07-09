<template>
  <q-page>
    <!-- Dialog -->
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="enterCode" persistent>
        <q-card
          class="my-card text-white"
          style="background: radial-gradient(circle, #f4243f 0%, #610101 100%)"
          >

          <q-card-section>
            <div class="text-h6">Our Changing Planet</div>
            <div class="text-subtitle2">by John Doe</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{ lorem }}
          </q-card-section>

          <q-card-section>
            <div class="text-h6">Code eingeben</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="txtApplicationCode" autofocus label="Code" />
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
import { URLProperties } from 'src/boot/utils.js'
import { ref } from 'vue'

export default {
  name: 'EnterCode',

  setup () {
    const $q = useQuasar()

    return {
      txtApplicationCode: ref(''),

      lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',

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

      onUserCodeIsInvalid () {
        $q.notify({
          type: 'negative',
          message: 'Der eingegebene User-Code ist ungültig!'
        })
      },

      enterCode: ref(true)
    }
  },

  data () {
    return {
      URLProperties
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
          if (_stringCode[0].length === 8 && parseInt(_stringCode[1]) >= 330) {
            _userCode = _applicationCode
            _adminCode = _stringCode[1].substring(0, 1) + _stringCode[0].substring(0, 4) + _stringCode[1].substring(1, 2) + _stringCode[0].substring(4, 8) + _stringCode[1].substring(2, _stringCode[1].length)
          }
        }
      } else if (_applicationCode.length === 11) {
        _adminCode = _applicationCode
        _userCode = _applicationCode.substring(1, 5) + _applicationCode.substring(6, 10) + '_' + _applicationCode.substring(0, 1) + _applicationCode.substring(5, 6) + _applicationCode.substring(10, _applicationCode.length)
      } else {
        _applicationCode = ''
      }

      if (_applicationCode === '') this.onCodeIsInvalid()
      else {
        this.$axios(`${this.URLProperties}&func=ReadAdminCode&adminCode=${_adminCode}`)
          .then((res) => {
            this.tableProperties = res.data.split('\n')

            if (res.data === '') this.onCodeIsInvalid()

            for (let index = 0; index < this.tableProperties.length - 1; index++) {
              const element = this.tableProperties[index].split(',')

              let _isAdministrator = 'false'
              if (element[1] === _applicationCode) _isAdministrator = 'true'

              const _clientName = element[3]
              const _email = element[4]
              const _homeTeam = element[5]
              const _standardText = element[6]
              const _title1 = element[7]
              const _caption1 = element[8]
              const _link1 = element[9]
              const _title2 = element[10]
              const _caption2 = element[11]
              const _link2 = element[12]
              const _title3 = element[13]
              const _caption3 = element[14]
              const _link3 = element[15]
              const _title4 = element[16]
              const _caption4 = element[17]
              const _link4 = element[18]
              const _title5 = element[19]
              const _caption5 = element[20]
              const _link5 = element[21]

              if (element[1] === _adminCode || element[2] === _userCode) this.setCookie(_isAdministrator, _adminCode, _userCode, _clientName, _email, _homeTeam, _standardText, _title1, _caption1, _link1, _title2, _caption2, _link2, _title3, _caption3, _link3, _title4, _caption4, _link4, _title5, _caption5, _link5)
              else this.onUserCodeIsInvalid()

              this.onCodeIsValid()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    setCookie (_isAdministrator, _adminCode, _userCode, _clientName, _email, _homeTeam, _standardText, _title1, _caption1, _link1, _title2, _caption2, _link2, _title3, _caption3, _link3, _title4, _caption4, _link4, _title5, _caption5, _link5) {
      const d = new Date()
      d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000))
      const _expires = 'expires=' + d.toUTCString()
      document.cookie = 'isAdministrator=' + _isAdministrator + ';' + _expires + '";path=/'
      document.cookie = 'adminCode=' + _adminCode + ';' + _expires + '";path=/'
      document.cookie = 'userCode=' + _userCode + ';' + _expires + '";path=/'
      document.cookie = 'clientName=' + _clientName + ';' + _expires + '";path=/'
      document.cookie = 'email=' + _email + ';' + _expires + '";path=/'
      document.cookie = 'homeTeam=' + _homeTeam + ';' + _expires + '";path=/'
      document.cookie = 'standardText=' + _standardText + ';' + _expires + '";path=/'
      document.cookie = 'title1=' + _title1 + ';' + _expires + '";path=/'
      document.cookie = 'caption1=' + _caption1 + ';' + _expires + '";path=/'
      document.cookie = 'link1=' + _link1 + ';' + _expires + '";path=/'
      document.cookie = 'title2=' + _title2 + ';' + _expires + '";path=/'
      document.cookie = 'caption2=' + _caption2 + ';' + _expires + '";path=/'
      document.cookie = 'link2=' + _link2 + ';' + _expires + '";path=/'
      document.cookie = 'title3=' + _title3 + ';' + _expires + '";path=/'
      document.cookie = 'caption3=' + _caption3 + ';' + _expires + '";path=/'
      document.cookie = 'link3=' + _link3 + ';' + _expires + '";path=/'
      document.cookie = 'title4=' + _title4 + ';' + _expires + '";path=/'
      document.cookie = 'caption4=' + _caption4 + ';' + _expires + '";path=/'
      document.cookie = 'link4=' + _link4 + ';' + _expires + '";path=/'
      document.cookie = 'title5=' + _title5 + ';' + _expires + '";path=/'
      document.cookie = 'caption5=' + _caption5 + ';' + _expires + '";path=/'
      document.cookie = 'link5=' + _link5 + ';' + _expires + '";path=/'
    }
  }
}
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>

<style lang="scss">
.header-image {
  height: 100%;
  z-index: -1;
  opacity: 0.2;
  filter: grayscale(100%);
}
</style>
