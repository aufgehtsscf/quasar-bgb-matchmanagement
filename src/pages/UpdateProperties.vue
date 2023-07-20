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
import { URLProperties, setCookie } from 'src/boot/utils.js'
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

              if (element[1] === _adminCode || element[2] === _userCode) this.setCookie(_isAdministrator, _applicationCode, _clientName, _email, _homeTeam, _homeTeamAlias, _standardText, _titleUrl1, _captionUrl1, _linkUrl1, _titleUrl2, _captionUrl2, _linkUrl2, _titleUrl3, _captionUrl3, _linkUrl3, _titleUrl4, _captionUrl4, _linkUrl4, _titleUrl5, _captionUrl5, _linkUrl5)
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
