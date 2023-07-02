<template>
  <q-page>
    <!-- Dialog -->
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="enterCode" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Code eingeben</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="txtApplicationCode" autofocus label="Code" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
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
import { Client, URLProperties } from 'src/boot/utils.js'
import { ref } from 'vue'

export default {
  name: 'EnterCode',

  setup () {
    const $q = useQuasar()

    return {
      txtApplicationCode: ref(''),

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
      Client,
      URLProperties
    }
  },

  computed: {
  },

  methods: {
    getProperties (_applicationCode) {
      let _adminCode = ''
      let _userCode = ''

      if (_applicationCode === 'BGB' || _applicationCode === 'BGB_330') {
        _adminCode = 'BGB'
        _userCode = 'BGB_330'
      } else {
        if (_applicationCode.length === 11) {
          const _stringCode = _applicationCode.split('_')
          if (_stringCode[1].length === 8 && parseInt(_stringCode[2]) >= 330) {
            _userCode = _applicationCode
            _adminCode = _stringCode[2].substring(0, 1) + _stringCode[1].substring(0, 4) + _stringCode[2].substring(1, 2) + _stringCode[1].substring(4, 8) + _stringCode[2].substring(2, _stringCode[2].length)
          } else {
            _adminCode = _applicationCode
            _userCode = _stringCode[1].substring(0, 4) + _stringCode[1].substring(4, 8) + '_' + _stringCode[2].substring(0, _stringCode[2].length)
          }
        } else {
          _applicationCode = ''
        }
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

              const _homeTeam = element[3]
              const _standardText = element[4]
              const _link1 = element[5]
              const _link2 = element[6]
              const _link3 = element[7]
              const _link4 = element[8]
              const _link5 = element[9]

              if (element[1] === _adminCode || element[2] === _userCode) this.setCookie(_adminCode, _isAdministrator, _homeTeam, _standardText, _link1, _link2, _link3, _link4, _link5)
              else this.onUserCodeIsInvalid()

              this.onCodeIsValid()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    setCookie (_adminCode, _isAdministrator, _homeTeam, _standardText, _link1, _link2, _link3, _link4, _link5) {
      const d = new Date()
      d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000))
      const _expires = 'expires=' + d.toUTCString()
      document.cookie = 'client=' + _adminCode + ';' + _expires + '";path=/'
      document.cookie = 'isAdministrator=' + _isAdministrator + ';' + _expires + '";path=/'
      document.cookie = 'homeTeam=' + _homeTeam + ';' + _expires + '";path=/'
      document.cookie = 'standardText=' + _standardText + ';' + _expires + '";path=/'
      document.cookie = 'link1=' + _link1 + ';' + _expires + '";path=/'
      document.cookie = 'link2=' + _link2 + ';' + _expires + '";path=/'
      document.cookie = 'link3=' + _link3 + ';' + _expires + '";path=/'
      document.cookie = 'link4=' + _link4 + ';' + _expires + '";path=/'
      document.cookie = 'link5=' + _link5 + ';' + _expires + '";path=/'
      document.cookie = 'Client=;' + _expires + '";path=/'
    }
  }
}
</script>

<style lang="scss">
.header-image {
  height: 100%;
  z-index: -1;
  opacity: 0.2;
  filter: grayscale(100%);
}
</style>
