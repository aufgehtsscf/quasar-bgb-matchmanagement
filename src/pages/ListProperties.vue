<template>
  <q-page>

    <!-- Properties area (Titel) -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>Einstellungen</q-toolbar-title>
      </q-toolbar>
    </div>

    <!-- List of Properties -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="(prop, i) in propertyObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onPropertyClick(prop.adminCode, prop.clientName, prop.email, prop.homeTeam, prop.homeTeamAlias, prop.standardText)">
          <q-item-section>
            <q-item-label overline>Name: {{ prop.clientName }}</q-item-label>
            <q-item-label caption>Admincode: {{ prop.adminCode }}</q-item-label>
            <q-item-label caption>Usercode: {{ getUserCode(prop.adminCode) }}</q-item-label>
            <q-item-label caption>Email: {{ prop.email }}</q-item-label>
            <q-item-label caption>Heimmannschaft: {{ prop.homeTeam }}</q-item-label>
            <q-item-label caption>Heimmannschaft (Alias): {{ prop.homeTeamAlias }}</q-item-label>
            <q-item-label caption>Standardtext: {{ prop.standardText }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Dialogs -->
    <div class="q-pa-md q-gutter-sm">

      <!-- Start Dialogs Property -->
      <!-- Add property -->
      <q-dialog v-model="addProperty" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Karte erfassen</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="txtCardHolderNew" autofocus label="Inhaber" />

            <q-toggle
              v-model="tglDiscountedNew"
              color="red"
              label="Kind"
              left-label
            />

            <q-input dense v-model="txtWhoHasTheCardNew" autofocus label="Wer hat die Karte" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addPropertySave(txtCardHolderNew, tglDiscountedNew, txtWhoHasTheCardNew)" :disable="txtCardHolderNew === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit property -->
      <q-dialog v-model="editProperty" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Karte ändern</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="txtCardHolder" autofocus label="Inhaber" />

            <q-toggle
              v-model="tglDiscounted"
              color="red"
              label="Kind"
              left-label
            />

            <q-input dense v-model="txtWhoHasTheCard" autofocus label="Wer hat die Karte" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" color="primary" @click="delProperty = true" v-if="getCookie('isAdministrator') === 'true'" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editPropertySave(intCardHolderRow, txtCardHolderId, txtCardHolder, txtCardHolderOld, tglDiscounted, txtWhoHasTheCard)" :disable="txtCardHolder === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete Property -->
      <q-dialog v-model="delProperty" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="primary" text-color="white" />
            <span class="q-ml-sm">Datensatz löschen?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Nein" color="primary" v-close-popup />
            <q-btn flat label="Ja" color="primary" @click="deleteProperty(intCardHolderRow, txtCardHolderId)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- End Dialogs Property -->
    </div>

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import useQuasar from 'quasar/src/composables/use-quasar.js'
import { AdminCode, getCookie, getAdminCode, getUserCode, URLProperties } from 'src/boot/utils.js'
import { ref } from 'vue'

const _constCardHolderRow = ref(0)
const _constCardHolderId = ref('')
const _constCardHolder = ref('')
const _constCardHolderOld = ref('')
const _constDiscounted = ref('')
const _constWhoHasTheCard = ref('')

export default {
  name: 'ListWhoHasTheCard',

  setup () {
    const $q = useQuasar()

    return {
      intCardHolderRow: ref(_constCardHolderRow),
      txtCardHolderId: ref(_constCardHolderId),
      txtCardHolder: ref(_constCardHolder),
      txtCardHolderOld: ref(_constCardHolderOld),
      tglDiscounted: ref(_constDiscounted),
      txtWhoHasTheCard: ref(_constWhoHasTheCard),

      txtCardHolderNew: ref(''),
      tglDiscountedNew: ref(false),
      txtWhoHasTheCardNew: ref(''),

      onCardHolderCreated () {
        $q.notify({
          type: 'positive',
          message: 'Einstellung wurde erfolgreich erfasst!'
        })
      },

      onCardHolderUpdated () {
        $q.notify({
          type: 'positive',
          message: 'Einstellung wurde erfolgreich aktualisiert!'
        })
      },

      onCardHolderDeleted () {
        $q.notify({
          message: 'Einstellung wurde erfolgreich gelöscht!',
          color: 'orange'
        })
      },

      onCardHolderAlreadyExists () {
        $q.notify({
          type: 'negative',
          message: 'Diese Einstellung besteht bereits!'
        })
      },

      addProperty: ref(false),
      editProperty: ref(false),
      delProperty: ref(false)
    }
  },

  data () {
    return {
      AdminCode,
      getCookie,
      getAdminCode,
      getUserCode,
      URLProperties,

      propertyObject: [
        {
          adminCode: '',
          clientName: '',
          email: '',
          homeTeam: '',
          homeTeamAlias: '',
          standardText: '',
          titleUrl1: '',
          captionUrl1: '',
          linkUrl1: '',
          titleUrl2: '',
          captionUrl2: '',
          linkUrl2: '',
          titleUrl3: '',
          captionUrl3: '',
          linkUrl3: '',
          titleUrl4: '',
          captionUrl4: '',
          linkUrl4: '',
          titleUrl5: '',
          captionUrl5: '',
          linkUrl5: ''
        }
      ]
    }
  },

  computed: {
  },

  mounted () {
    this.getTableProperty()
  },

  methods: {
    async getTableProperty () {
      this.propertyObject = []

      // console.log('URLProperties: ' + this.URLProperties + '&func=Read')
      this.$axios(`${this.URLProperties}&func=ReadAdminCode&adminCode=${this.AdminCode}`)
        .then((res) => {
          this.tableProperty = res.data.split('\n')
          for (let index = 0; index < this.tableProperty.length - 1; index++) {
            const element = this.tableProperty[index].split(',')

            this.setPropertyObject(element[1].trim(), element[3].trim(), element[4].trim(), element[5].trim(), element[6].trim(), element[7].trim(), element[8].trim(), element[9].trim(), element[10].trim(), element[11].trim(), element[11].trim(), element[12].trim(), element[13].trim(), element[14].trim(), element[15].trim(), element[16].trim(), element[17].trim(), element[18].trim(), element[19].trim(), element[20].trim(), element[21].trim(), element[22].trim())
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setPropertyObject (_adminCode, _clientName, _email, _homeTeam, _homeTeamAlias, _standardText, _titleUrl1, _captionUrl1, _linkUrl1, _titleUrl2, _captionUrl2, _linkUrl2, _titleUrl3, _captionUrl3, _linkUrl3, _titleUrl4, _captionUrl4, _linkUrl4, _titleUrl5, _captionUrl5, _linkUrl5) {
      this.propertyObject.push({ adminCode: _adminCode, clientName: _clientName, email: _email, homeTeam: _homeTeam, homeTeamAlias: _homeTeamAlias, standardText: _standardText, titleUrl1: _titleUrl1, captionUrl1: _captionUrl1, linkUrl1: _linkUrl1, titleUrl2: _titleUrl2, captionUrl2: _captionUrl2, linkUrl2: _linkUrl2, titleUrl3: _titleUrl3, captionUrl3: _captionUrl3, linkUrl3: _linkUrl3, titleUrl4: _titleUrl4, captionUrl4: _captionUrl4, linkUrl4: _linkUrl4, titleUrl5: _titleUrl5, captionUrl5: _captionUrl5, linkUrl5: _linkUrl5 })
    },

    onPropertyClick (_row, _cardHolderId, _cardHolder, _discounted, _whoHasTheCard) {
      // console.log('Clicked on Property: ' + _row + ', ' + _cardHolderId + ', ' + _cardHolder + ', ' + _discounted + ', ' + _whoHasTheCard)
      _constCardHolderRow.value = _row
      _constCardHolderId.value = _cardHolderId
      _constCardHolder.value = _cardHolder
      _constCardHolderOld.value = _cardHolder
      _constDiscounted.value = _discounted === 'TRUE'
      _constWhoHasTheCard.value = _whoHasTheCard

      this.editProperty = true
    },

    addPropertySave (_cardHolder, _discounted, _whoHasTheCard) {
      // console.log('addPropertySave: ' + _cardHolder + ', ' + _discounted + ', ' + _whoHasTheCard)

      const _cardHolders = this.propertyObject.map(el => el.cardHolder)
      const _cardHolderExists = _cardHolders.includes(_cardHolder)
      if (_cardHolderExists) {
        this.onCardHolderAlreadyExists()
      } else {
        this.$axios(`${this.URLProperties}&func=Add&cardholder=${encodeURI(_cardHolder.replace(',', ' '))}&discounted=${_discounted}&whohasthecard=${encodeURI(_whoHasTheCard.replace(',', ''))}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.onCardHolderCreated()
              this.getTableProperty()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    editPropertySave (_row, _cardHolderId, _cardHolder, _cardHolderOld, _discounted, _whoHasTheCard) {
      // console.log('editPropertySave: ' + _cardHolderId + ', ' + _cardHolder + ', ' + _cardHolderOld + ', ' + _discounted + ', ' + _whoHasTheCard)

      const _cardHolders = this.propertyObject.map(el => el.cardHolder)
      const _cardHolderExists = _cardHolders.includes(_cardHolder) && _cardHolder !== _cardHolderOld
      if (_cardHolderExists) {
        this.onCardHolderAlreadyExists()
      } else {
        this.$axios(`${this.URLProperties}&func=Update&row=${_row}&cardholderId=${_cardHolderId}&cardholder=${encodeURI(_cardHolder.replace(',', ' '))}&discounted=${_discounted}&whohasthecard=${encodeURI(_whoHasTheCard.replace(',', ''))}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.onCardHolderUpdated()
              this.getTableProperty()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    deleteProperty (_row, _cardHolderId) {
      // console.log('deleteProperty: ' + _cardHolderId)

      this.$axios(`${this.URLProperties}&func=Delete&row=${_row}&cardholderId=${_cardHolderId}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.editProperty = false
            this.onCardHolderDeleted()
            this.getTableProperty()
          }
        })
        .catch((err) => {
          console.log(err)
        })
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
