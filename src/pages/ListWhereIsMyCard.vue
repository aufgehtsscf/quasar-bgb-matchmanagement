<template>
  <q-page>

    <!-- WhereIsMyCard area (Titel) -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>Wer hat meine Karte</q-toolbar-title>
        <q-btn class="bg-white text-primary" icon="add" label="Neu" @click="addWhereIsMyCard = true" />
      </q-toolbar>
    </div>

    <!-- List of WhereIsMyCards -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="(card, i) in whereIsMyCardObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onWhereIsMyCardClick(card.row, card.cardHolderId, card.cardHolder, card.discounted, card.whoHasTheCard)">
          <q-item-section avatar>
            <q-avatar size="50px" color="lime-10" text-color="white" v-if="card.cardHolderAvatar === ''">
              {{ card.cardHolder.substring(0, 1) }}
            </q-avatar>
            <q-avatar size="50px" v-if="card.cardHolderAvatar !== ''">
              <img :src="getAvatar(getAdminCode(getCookie('applicationCode')), card.cardHolderAvatar, card.cardHolderAvatarIsCustomized === 'TRUE')">
            </q-avatar>
          </q-item-section>
          <q-item-section avatar>
            <q-avatar size="50px" color="green-10" text-color="white" v-if="card.whoHasTheCardAvatar === ''">
              {{ card.whoHasTheCard.substring(0, 1) }}
            </q-avatar>
            <q-avatar size="50px" v-if="card.whoHasTheCardAvatar !== ''">
              <img :src="getAvatar(getAdminCode(getCookie('applicationCode')), card.whoHasTheCardAvatar, card.whoHasTheCardAvatarIsCustomized === 'TRUE')">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label overline>Inhaber: {{ card.cardHolder }}</q-item-label>
            <q-item-label caption v-if="card.discounted === 'TRUE'">Kind: Ja</q-item-label>
            <q-item-label caption v-if="card.discounted === 'FALSE'">Kind: Nein</q-item-label>
            <q-item-label caption>Wer hat die Karte: {{ card.whoHasTheCard }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Dialogs -->
    <div class="q-pa-md q-gutter-sm">

      <!-- Start Dialogs WhereIsMyCard -->
      <!-- Add whereIsMyCard -->
      <q-dialog v-model="addWhereIsMyCard" persistent>
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
            <q-btn icon="save" label="Speichern" @click="addWhereIsMyCardSave(txtCardHolderNew, tglDiscountedNew, txtWhoHasTheCardNew)" :disable="txtCardHolderNew === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit whereIsMyCard -->
      <q-dialog v-model="editWhereIsMyCard" persistent>
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
            <q-btn icon="delete" color="primary" @click="delWhereIsMyCard = true" v-if="getCookie('isAdministrator') === 'true'" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editWhereIsMyCardSave(intCardHolderRow, txtCardHolderId, txtCardHolder, txtCardHolderOld, tglDiscounted, txtWhoHasTheCard)" :disable="txtCardHolder === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete WhereIsMyCard -->
      <q-dialog v-model="delWhereIsMyCard" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="primary" text-color="white" />
            <span class="q-ml-sm">Datensatz löschen?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Nein" color="primary" v-close-popup />
            <q-btn flat label="Ja" color="primary" @click="deleteWhereIsMyCard(intCardHolderRow, txtCardHolderId)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- End Dialogs WhereIsMyCard -->
    </div>

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import useQuasar from 'quasar/src/composables/use-quasar.js'
import { getCookie, getAdminCode, getAvatar, URLWhereIsMyCardBasis, URLMemberBasis } from 'src/boot/utils.js'
import { ref } from 'vue'

const _constCardHolderRow = ref(0)
const _constCardHolderId = ref('')
const _constCardHolder = ref('')
const _constCardHolderOld = ref('')
const _constDiscounted = ref('')
const _constWhoHasTheCard = ref('')

let _URLWhereIsMyCard
let _URLMember

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
          message: 'Karteninhaber wurde erfolgreich erfasst!'
        })
      },

      onCardHolderUpdated () {
        $q.notify({
          type: 'positive',
          message: 'Karteninhaber wurde erfolgreich aktualisiert!'
        })
      },

      onCardHolderDeleted () {
        $q.notify({
          message: 'Karteninhaber wurde erfolgreich gelöscht!',
          color: 'orange'
        })
      },

      onCardHolderAlreadyExists () {
        $q.notify({
          type: 'negative',
          message: 'Dieser Karteninhaber besteht bereits!'
        })
      },

      addWhereIsMyCard: ref(false),
      editWhereIsMyCard: ref(false),
      delWhereIsMyCard: ref(false)
    }
  },

  data () {
    return {
      getCookie,
      getAdminCode,
      getAvatar,
      URLWhereIsMyCardBasis,
      URLMemberBasis,

      whereIsMyCardObject: [
        {
          row: '',
          cardHolderId: '',
          cardHolder: '',
          cardHolderAvatar: '',
          cardHolderAvatarIsCustomized: '',
          discounted: '',
          whoHasTheCard: '',
          whoHasTheCardAvatar: '',
          whoHasTheCardAvatarIsCustomized: ''
        }
      ],

      memberObject: [
        {
          member: '',
          avatar: '',
          customized: ''
        }
      ]
    }
  },

  computed: {
  },

  mounted () {
    this.setVariables()
    this.getTableWhereIsMyCard()
  },

  methods: {
    setVariables () {
      _URLWhereIsMyCard = URLWhereIsMyCardBasis + '?sh=' + getAdminCode(getCookie('applicationCode'))
      _URLMember = URLMemberBasis + '?sh=' + getAdminCode(getCookie('applicationCode'))
    },

    getTableMember () {
      this.memberObject = []

      // console.log('URLMember: ' + _URLMember + '&func=Read')
      this.$axios(`${_URLMember}&func=Read`)
        .then((res) => {
          this.tableMember = res.data.split('\n')
          for (let index = 0; index < this.tableMember.length - 1; index++) {
            const element = this.tableMember[index].split(',')
            this.setMemberObject(element[3].trim(), element[4].trim(), element[5])
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setMemberObject (_member, _avatar, _customized) {
      this.memberObject.push({ member: _member, avatar: _avatar, customized: _customized })
    },

    async getTableWhereIsMyCard () {
      this.getTableMember()

      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      await sleep(1000)

      this.whereIsMyCardObject = []

      // console.log('URLWhereIsMyCard: ' + _URLWhereIsMyCard + '&func=Read')
      this.$axios(`${_URLWhereIsMyCard}&func=Read`)
        .then((res) => {
          this.tableWhereIsMyCard = res.data.split('\n')
          for (let index = 0; index < this.tableWhereIsMyCard.length - 1; index++) {
            const element = this.tableWhereIsMyCard[index].split(',')

            let _cardHolderAvatar = this.memberObject.find(el => el.member === element[3].trim())?.avatar
            if (typeof _cardHolderAvatar === 'undefined') _cardHolderAvatar = ''
            let _cardHolderAvatarIsCustomized = this.memberObject.find(el => el.member === element[3].trim())?.customized
            if (typeof _cardHolderAvatarIsCustomized === 'undefined') _cardHolderAvatarIsCustomized = 'FALSE'

            let _whoHasTheCardAvatar = this.memberObject.find(el => el.member === element[5].trim())?.avatar
            if (typeof _whoHasTheCardAvatar === 'undefined') _whoHasTheCardAvatar = ''
            let _whoHasTheCardAvatarIsCustomized = this.memberObject.find(el => el.member === element[5].trim())?.customized
            if (typeof _whoHasTheCardAvatarIsCustomized === 'undefined') _whoHasTheCardAvatarIsCustomized = 'FALSE'

            this.setWhereIsMyCardObject(element[0], element[1], element[3].trim(), _cardHolderAvatar, _cardHolderAvatarIsCustomized, element[4], element[5].trim(), _whoHasTheCardAvatar, _whoHasTheCardAvatarIsCustomized)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setWhereIsMyCardObject (_row, _cardHolderId, _cardHolder, _cardHolderAvatar, _cardHolderAvatarIsCustomized, _discounted, _whoHasTheCard, _whoHasTheCardAvatar, _whoHasTheCardAvatarIsCustomized) {
      this.whereIsMyCardObject.push({ row: parseInt(_row), cardHolderId: _cardHolderId, cardHolder: _cardHolder, cardHolderAvatar: _cardHolderAvatar, cardHolderAvatarIsCustomized: _cardHolderAvatarIsCustomized, discounted: _discounted, whoHasTheCard: _whoHasTheCard, whoHasTheCardAvatar: _whoHasTheCardAvatar, whoHasTheCardAvatarIsCustomized: _whoHasTheCardAvatarIsCustomized })
    },

    onWhereIsMyCardClick (_row, _cardHolderId, _cardHolder, _discounted, _whoHasTheCard) {
      // console.log('Clicked on WhereIsMyCard: ' + _row + ', ' + _cardHolderId + ', ' + _cardHolder + ', ' + _discounted + ', ' + _whoHasTheCard)
      _constCardHolderRow.value = _row
      _constCardHolderId.value = _cardHolderId
      _constCardHolder.value = _cardHolder
      _constCardHolderOld.value = _cardHolder
      _constDiscounted.value = _discounted === 'TRUE'
      _constWhoHasTheCard.value = _whoHasTheCard

      this.editWhereIsMyCard = true
    },

    addWhereIsMyCardSave (_cardHolder, _discounted, _whoHasTheCard) {
      // console.log('addWhereIsMyCardSave: ' + _cardHolder + ', ' + _discounted + ', ' + _whoHasTheCard)

      const _cardHolders = this.whereIsMyCardObject.map(el => el.cardHolder)
      const _cardHolderExists = _cardHolders.includes(_cardHolder)
      if (_cardHolderExists) {
        this.onCardHolderAlreadyExists()
      } else {
        this.$axios(`${_URLWhereIsMyCard}&func=Add&cardholder=${encodeURI(_cardHolder.replace(',', ' '))}&discounted=${_discounted}&whohasthecard=${encodeURI(_whoHasTheCard.replace(',', ''))}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.onCardHolderCreated()
              this.getTableWhereIsMyCard()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    editWhereIsMyCardSave (_row, _cardHolderId, _cardHolder, _cardHolderOld, _discounted, _whoHasTheCard) {
      // console.log('editWhereIsMyCardSave: ' + _row + ', ' + _cardHolderId + ', ' + _cardHolder + ', ' + _cardHolderOld + ', ' + _discounted + ', ' + _whoHasTheCard)

      const _cardHolders = this.whereIsMyCardObject.map(el => el.cardHolder)
      const _cardHolderExists = _cardHolders.includes(_cardHolder) && _cardHolder !== _cardHolderOld
      if (_cardHolderExists) {
        this.onCardHolderAlreadyExists()
      } else {
        this.$axios(`${_URLWhereIsMyCard}&func=Update&row=${_row}&cardholderId=${_cardHolderId}&cardholder=${encodeURI(_cardHolder.replace(',', ' '))}&discounted=${_discounted}&whohasthecard=${encodeURI(_whoHasTheCard.replace(',', ''))}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.onCardHolderUpdated()
              this.getTableWhereIsMyCard()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    deleteWhereIsMyCard (_row, _cardHolderId) {
      // console.log('deleteWhereIsMyCard: ' + _cardHolderId)

      this.$axios(`${_URLWhereIsMyCard}&func=Delete&row=${_row}&cardholderId=${_cardHolderId}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.editWhereIsMyCard = false
            this.onCardHolderDeleted()
            this.getTableWhereIsMyCard()
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
