<template>
  <q-page>
    <!-- Dialog -->
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="enterCode" persistent>
        <q-card
          class="my-card text-white"
          style="background: radial-gradient(circle, #7e0210 0%, #59000b 100%)">

          <q-card-section>
            <div class="text-h6">Auf geht's SCF</div>
            <div class="text-subtitle2">Plan the game</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input color="lime-11" bg-color="lime-11" label-color="black" filled v-model="txtApplicationCode" label="Code hier eingeben">
              <template v-slot:append>
                <q-icon name="qr_code_2" />
              </template>
            </q-input>
          </q-card-section>

          <q-card-section>
            <div class="text-subtitle2">Wir verwenden Cookies</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{ cookieText1 }}
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{ cookieText2 }}
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{ cookieText3 }}
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-white" align="right">
            <q-btn label="Abbrechen" v-close-popup />
            <q-btn label="Ok" @click="getTenant(txtApplicationCode)" :disable="txtApplicationCode === ''" v-close-popup />
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
import { URLMatchManagementAPI, setCookie } from 'src/boot/utils.js'
import { ref } from 'vue'

let _URLTenant

export default {
  name: 'EnterCode',

  setup () {
    const $q = useQuasar()

    return {
      txtApplicationCode: ref(''),

      cookieText1: 'Damit du deinen Zugangscode nicht jedes Mal neu eingeben musst, speichern wir ihn als Cookie.',
      cookieText2: 'Durch die Nutzung dieser Website erklärst du dich damit einverstanden, dass wir Cookies verwenden.',
      cookieText3: 'Klick auf "OK" klicken, um den Aktivierungscode zu überprüfen.',

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
      URLMatchManagementAPI,
      setCookie
    }
  },

  computed: {
  },

  mounted () {
    this.setVariables().then(() => {
      this.getTenant()
    })
  },

  methods: {
    setVariables () {
      _URLTenant = URLMatchManagementAPI + '/Tenant'

      return Promise.resolve()
    },

    getTenant (_applicationCode) {
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

      if (_adminCode === '' && _userCode === '') {
        this.onCodeIsInvalid()
        this.refreshPage(false)
      } else {
        this.$axios.get(`${_URLTenant}/code/${_adminCode}`)
          .then((res) => {
            if (res.status !== 200) {
              this.onCodeIsInvalid()
              this.refreshPage(false)
            }

            for (let index = 0; index < res.data.length; index++) {
              let _isAdministrator = false
              if (res.data[index].adminCode === _applicationCode) _isAdministrator = true

              if (res.data[index].adminCode === _adminCode || res.data[index].userCode === _userCode) this.setCookie(_isAdministrator, _applicationCode)
              else this.onCodeNotFound()

              this.onCodeIsValid()
              this.refreshPage(true)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    async refreshPage (codeIsValid) {
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      await sleep(3000)

      if (codeIsValid) {
        this.$router.push('/')
        await sleep(5000)
      } else location.reload()
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
