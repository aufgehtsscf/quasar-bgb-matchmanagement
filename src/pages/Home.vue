<template>
  <q-page>
    <!-- Dialog: Start now -->
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="codeRequest" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6">Ich möchte einen Code!</div>
            <div class="text-subtitle2">Sende mir bitte einen kostenlosen Code, um mit meiner Spieltagsplanung zu starten!</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input filled dense v-model="txtFanClubName" autofocus label="Fanclub *" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input filled dense v-model="txtFanClubContactPerson" label="Kontaktperson *" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input filled dense v-model="txtFanClubEmailAddress" label="E-Mail-Adresse *"
            :rules="[
            (val) => validateEmail(val) || 'Must be a valid email.'
            ]"
            />
          </q-card-section>

          <q-card-section>
            <div class="text-subtitle3">Nachdem du auf den "OK"-Button geklickt hast, solltest du sofort eine E-Mail erhalten. Sollte dies nicht der Fall ist, schreib uns bitte eine E-Mail an aufgehtsscf@gmail.com</div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn label="Abbrechen" v-close-popup />
            <q-btn label="Ok" @click="sendCodeRequest(txtFanClubName, txtFanClubContactPerson, txtFanClubEmailAddress)" :disable="txtFanClubName === '' || txtFanClubContactPerson === '' || !validateEmail(txtFanClubEmailAddress)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <!-- End Dialog -->

    <!-- Dialog: Enter code -->
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="enterCode" persistent>
        <q-card>

          <q-card-section>
            <div class="text-h6">Ich habe einen Code!</div>
            <div class="text-subtitle3">Ich besitze bereits einen Code.</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input color="red" bg-color="red" label-color="black" filled v-model="txtApplicationCode" label="Code hier eingeben">
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

          <q-card-actions class="text-primary" align="right">
            <q-btn label="Abbrechen" v-close-popup />
            <q-btn label="Ok" @click="getTenant(txtApplicationCode, true)" :disable="txtApplicationCode === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <!-- End Dialog -->

    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card" flat bordered>
        <q-card-section horizontal>
          <q-card-section class="q-pt-xs">
            <div class="text-overline">Plan the Game</div>
            <div class="text-h5 q-mt-sm q-mb-xs">Die App zur Spieltagsplanung für deinen SCF</div>
            <div class="text-caption text-grey">
              Spieltag einfach und effizient planen.
            </div>
          </q-card-section>

          <q-card-section class="col-5 flex flex-center">
            <q-img
              class="rounded-borders"
              src="statics/images/Home.png"
            />
          </q-card-section>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center">
          <q-btn class="glossy" rounded color="red" label="Jetzt starten" @click="codeRequest = true"/>
          <q-btn class="glossy" rounded color="red" label="Ich habe einen Code!" @click="enterCode = true"/>
        </q-card-actions>
      </q-card>
    </div>

    <div class="q-pa-md q-gutter-sm">
      <q-carousel
        animated
        v-model="slide"
        infinite
      >
        <q-carousel-slide name="spiel_erfassen">
          <q-video
            class="absolute-full"
            src="https://youtube.com/embed/NRDy9V7r8SQ"
          />
        </q-carousel-slide>

        <q-carousel-slide name="mitglied_erfassen">
          <q-video
            class="absolute-full"
            src="https://youtube.com/embed/zpF-cfnZM-0"
          />
        </q-carousel-slide>

        <q-carousel-slide name="mitglied_updaten">
          <q-video
            class="absolute-full"
            src="https://youtube.com/embed/6uvxhCYOuCA"
          />
        </q-carousel-slide>

        <q-carousel-slide name="teilnahme_erfassen">
          <q-video
            class="absolute-full"
            src="https://youtube.com/embed/_Dcj6o9XJnA"
          />
        </q-carousel-slide>
      </q-carousel>

      <div class="row justify-center">
        <q-btn-toggle
          glossy
          rounded
          color="red"
          v-model="slide"
          :options="[
            { label: 'Spiel erfassen', value: 'spiel_erfassen' },
            { label: 'Mitglied erfassen', value: 'mitglied_erfassen' },
            { label: 'Mitglied updaten', value: 'mitglied_updaten' },
            { label: 'Teilnahme erfassen', value: 'teilnahme_erfassen' }
          ]"
        />
      </div>
    </div>

    <div class="q-pa-md q-gutter-sm">
      <q-carousel
        animated
        v-model="slide2"
        infinite
      >
        <q-carousel-slide name="karteninhaber_erfassen">
          <q-video
            class="absolute-full"
            src="https://youtube.com/embed/YFReZbD2zOo"
          />
        </q-carousel-slide>

        <q-carousel-slide name="karte_zuweisen">
          <q-video
            class="absolute-full"
            src="https://youtube.com/embed/7XcQ7sNXlIA"
          />
        </q-carousel-slide>

        <q-carousel-slide name="spielübersicht_teilen">
          <q-video
            class="absolute-full"
            src="https://youtube.com/embed/khJNCVcUwkQ"
          />
        </q-carousel-slide>

        <q-carousel-slide name="besuchte_spiele_anzeigen">
          <q-video
            class="absolute-full"
            src="https://youtube.com/embed/e1Eui0RN5lg"
          />
        </q-carousel-slide>
      </q-carousel>

      <div class="row justify-center">
        <q-btn-toggle
          glossy
          rounded
          color="red"
          v-model="slide2"
          :options="[
            { label: 'Karteninhaber erfassen', value: 'karteninhaber_erfassen' },
            { label: 'Karte zuweisen', value: 'karte_zuweisen' },
            { label: 'Spielübersicht teilen', value: 'spielübersicht_teilen' },
            { label: 'Besuchte Spiele pro Teilnehmer anzeigen', value: 'besuchte_spiele_anzeigen' }
          ]"
        />
      </div>
    </div>

    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card" flat bordered>
        <q-card-section horizontal>
          <q-card-section class="q-pt-xs">
            <div class="text-overline">Plan the Game</div>
            <div class="text-h5 q-mt-sm q-mb-xs">Was kann diese App?</div>
            <div class="text-caption text-grey">
              Deine Planung immer im Blick.
            </div>
          </q-card-section>

          <q-card-section class="col-5 flex flex-center">
            <q-img
              class="rounded-borders"
              src="statics/images/AufGehtsSCF2.png"
            />
          </q-card-section>
        </q-card-section>

        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon color="yellow" name="emoji_people" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle2">Teilnehmer verwalten</q-item-label>
              <q-item-label>Hier kannst du dich für ein bestimmtes Spiel eintragen. Du kannst angeben, ob du dabei bist oder ob du ein Ticket brauchst/freigibst. Du hast stets den Überblick über die aktuellen Spiele.</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="blue" name="sports_volleyball" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle2">Spiele verwalten</q-item-label>
              <q-item-label>Hier kannst du ein bereits terminierten Spiel erfassen und publizieren. Heim- und Auswärtsspiele können erfasst werden.</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="red" name="person" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle2">Mitglieder verwalten</q-item-label>
              <q-item-label>Hier kannst du als Mitglied eintragen. Es stehen dir jede Menge coole Avatare zur Verfügung.</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="green" name="credit_card" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle2">Karten verwalten. Wer hat meine Karte?</q-item-label>
              <q-item-label>Hier kannst du angeben, wer aktuell deine Karte hat. Diese Information fließt in die Spielübersicht ein.</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-icon color="teal" name="add" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle2">... und vieles mehr</q-item-label>
              <q-item-label>Wer ist der Heimspielkönig? Welches Spiel wurde am meisten besucht? Diese und andere Statistiken sind jederzeit sichtbar.</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-separator />

        <q-card-actions align="center">
          <q-btn class="glossy" rounded color="red" label="Jetzt starten" @click="codeRequest = true"/>
          <q-btn class="glossy" rounded color="red" label="Ich habe einen Code!" @click="enterCode = true"/>
        </q-card-actions>
      </q-card>
    </div>

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image2 absolute-top"/>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'
import { getCookie, getAdminCode, URLMatchManagementAPI, setCookie, serviceID, templateID, userID, FromName } from 'src/boot/utils.js'
import emailjs from 'emailjs-com'
import { ref } from 'vue'

const _constAdminCode = ref('')

let _URLTenant

export default {
  name: 'HomePage',

  setup () {
    const $q = useQuasar()

    return {
      slide: ref('spiel_erfassen'),
      slide2: ref('karteninhaber_erfassen'),

      txtFanClubName: ref(''),
      txtFanClubContactPerson: ref(''),
      txtFanClubEmailAddress: ref(''),

      txtApplicationCode: ref(''),
      cookieText1: 'Damit du deinen Zugangscode nicht jedes Mal neu eingeben musst, speichern wir diese und andere von deinem Administrator festgelegte Informationen als Cookies.',
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

      onCodeRequestWasSent () {
        $q.notify({
          type: 'positive',
          message: 'Deine Code-Anfrage wurde gesendet!'
        })
      },

      codeRequest: ref(false),
      enterCode: ref(false)
    }
  },

  data () {
    return {
      getCookie,
      getAdminCode,
      URLMatchManagementAPI,
      setCookie,
      serviceID,
      templateID,
      userID,
      FromName
    }
  },

  computed: {
  },

  mounted () {
    this.setVariables().then(() => {
      this.getTenant(_constAdminCode.value, false)
    })
  },

  methods: {
    setVariables () {
      _constAdminCode.value = getAdminCode(getCookie('applicationCode'))
      _URLTenant = URLMatchManagementAPI + '/Tenant'

      return Promise.resolve()
    },

    validateEmail (_email) {
      return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(_email)
    },

    sendCodeRequest (_fanClub, _contactperson, _emailAddress) {
      try {
        emailjs.send(serviceID, this.templateID, {
          from_name: this.FromName,
          to_email: _emailAddress,
          contactperson: _contactperson,
          fanclub: _fanClub
        }, this.userID)
      } catch (error) {
        console.log({ error })
      }

      this.onCodeRequestWasSent()
    },

    getTenant (_applicationCode, _callFromForm) {
      let _adminCode = ''
      let _userCode = ''

      if (!_callFromForm) {
        if (this.getCookie('applicationCode') !== 'HOME') {
          this.$router.push('/participant')
        }
      } else {
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
        } else {
          this.$axios.get(`${_URLTenant}/code/${_adminCode}`)
            .then((res) => {
              if (res.status !== 200) {
                this.onCodeIsInvalid()
              } else {
                let _isAdministrator = false
                if (res.data.adminCode === _applicationCode) _isAdministrator = true

                if (res.data.adminCode === _adminCode || res.data.userCode === _userCode) this.setCookie(_isAdministrator, _applicationCode)
                else this.onCodeNotFound()

                this.onCodeIsValid()
                this.refreshPage()
              }
            })
            .catch((err) => {
              this.onCodeIsInvalid()
              console.log(err)
            })
        }
      }
    },

    async refreshPage () {
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      await sleep(3000)

      this.$router.push('/participant')
      await sleep(5000)
    }

  }
}
</script>

<style lang="scss">
.header-image2 {
  height: 100%;
  z-index: -1;
  opacity: 0.7;
  filter: grayscale(40%);
}
</style>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
