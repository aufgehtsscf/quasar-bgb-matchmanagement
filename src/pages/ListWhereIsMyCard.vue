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
        <q-item clickable v-ripple @click="onWhereIsMyCardClick(card.cardHolderId, card.cardHolder, card.discounted, card.whoHasTheCard)">
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

            <div class="q-pt-md">
              <div class="q-gutter-sm">
                <div><q-checkbox left-label v-model="txtDiscountedNew" label="Kind" /></div>
              </div>
            </div>

            <q-input dense v-model="txtWhoHasTheCardNew" autofocus label="Wer hat die Karte" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addWhereIsMyCardSave(txtCardHolderNew, txtDiscountedNew, txtWhoHasTheCardNew)" :disable="txtCardHolderNew === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Show whereIsMyCard exists -->
      <q-dialog v-model="showWhereIsMyCardExists" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="pan_tool" color="primary" text-color="white" />
            <span class="q-ml-sm">Dieser Inhaber besteht bereits!</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Schliessen" color="primary" v-close-popup />
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

            <div class="q-pt-md">
              <div class="q-gutter-sm">
                <div><q-checkbox left-label v-model="boolDiscounted" label="Kind" /></div>
              </div>
            </div>

            <q-input dense v-model="txtWhoHasTheCard" autofocus label="Wer hat die Karte" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" color="primary" @click="delWhereIsMyCard = true" v-if="IsAdministrator" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editWhereIsMyCardSave(txtCardHolderId, txtCardHolder, txtCardHolderOld, boolDiscounted, txtWhoHasTheCard)" :disable="txtCardHolder === ''" v-close-popup />
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
            <q-btn flat label="Ja" color="primary" @click="deleteWhereIsMyCard(txtCardHolderId)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- End Dialogs WhereIsMyCard -->
    </div>

    <q-img src="statics/BGB.jpg" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import { ref } from 'vue'

const _constHolderId = ref('')
const _constCardHolder = ref('')
const _constCardHolderOld = ref('')
const _constDiscounted = ref('')
const _constWhoHasTheCard = ref('')

export default {
  name: 'ListWhoHasTheCard',

  setup () {
    return {
      IsAdministrator: ref(false),

      txtCardHolderId: ref(_constHolderId),
      txtCardHolder: ref(_constCardHolder),
      txtCardHolderOld: ref(_constCardHolderOld),
      boolDiscounted: ref(_constDiscounted),
      txtWhoHasTheCard: ref(_constWhoHasTheCard),

      txtCardHolderNew: ref(''),
      txtDiscountedNew: ref(false),
      txtWhoHasTheCardNew: ref(''),

      addWhereIsMyCard: ref(false),
      showWhereIsMyCardExists: ref(false),
      editWhereIsMyCard: ref(false),
      delWhereIsMyCard: ref(false)
    }
  },

  data () {
    return {
      URLWhereIsMyCard: 'https://script.google.com/macros/s/AKfycbzlc-2httq6jMOsqbGIQmE6oAXNcWpLRZmGckDWQ6DqFoGQgHD-C1BkennQGntzAkJj/exec?ID=1AA2nnIb886xaBjpSaxwf2JNtujKnJc4xSVR-ChRGs2U&SH=BGB-WhereIsMyCard',

      whereIsMyCardObject: [
        {
          cardHolder: '',
          discounted: '',
          whoHasTheCard: '',
          cardHolderId: ''
        }
      ]
    }
  },

  computed: {
  },

  mounted () {
    this.getTableWhereIsMyCard()
  },

  methods: {
    getTableWhereIsMyCard () {
      this.whereIsMyCardObject = []

      console.log('URLWhereIsMyCard: ' + this.URLWhereIsMyCard + '&func=Read&cardholder=')
      this.$axios(`${this.URLWhereIsMyCard}&func=Read&cardholder=`)
        .then((res) => {
          this.tableWhereIsMyCard = res.data.split('\n')
          for (let index = 0; index < this.tableWhereIsMyCard.length - 1; index++) {
            const element = this.tableWhereIsMyCard[index].split(',')
            this.setWhereIsMyCardObject(element[2], element[3], element[4], element[5])
          }
          console.log(this.whereIsMyCardObject)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setWhereIsMyCardObject (_cardHolder, _discounted, _whoHasTheCard, _cardHolderId) {
      this.whereIsMyCardObject.push({ cardHolder: _cardHolder, discounted: _discounted, whoHasTheCard: _whoHasTheCard, cardHolderId: _cardHolderId })
    },

    onWhereIsMyCardClick (_cardHolderId, _cardHolder, _discounted, _whoHasTheCard) {
      console.log('Clicked on WhereIsMyCard: ' + _cardHolderId + ', ' + _cardHolder + ', ' + _discounted + ', ' + _whoHasTheCard)
      _constHolderId.value = _cardHolderId
      _constCardHolder.value = _cardHolder
      _constCardHolderOld.value = _cardHolder
      _constDiscounted.value = _discounted === 'TRUE'
      _constWhoHasTheCard.value = _whoHasTheCard

      this.editWhereIsMyCard = true
    },

    addWhereIsMyCardSave (_cardHolder, _discounted, _whoHasTheCard) {
      console.log('addWhereIsMyCardSave: ' + _cardHolder + ', ' + _discounted + ', ' + _whoHasTheCard)

      const _cardHolders = this.whereIsMyCardObject.map(el => el.cardHolder)
      const _cardHolderExists = _cardHolders.includes(_cardHolder)
      if (_cardHolderExists) {
        this.showWhereIsMyCardExists = true
      } else {
        this.$axios(`${this.URLWhereIsMyCard}&func=Add&cardholder=${encodeURI(_cardHolder.replace(',', ' '))}&discounted=${_discounted}&whohasthecard=${encodeURI(_whoHasTheCard.replace(',', ''))}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.getTableWhereIsMyCard()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    editWhereIsMyCardSave (_cardHolderId, _cardHolder, _cardHolderOld, _discounted, _whoHasTheCard) {
      console.log('editWhereIsMyCardSave: ' + _cardHolderId + ', ' + _cardHolder + ', ' + _cardHolderOld + ', ' + _discounted + ', ' + _whoHasTheCard)

      const _cardHolders = this.whereIsMyCardObject.map(el => el.cardHolder)
      const _cardHolderExists = _cardHolders.includes(_cardHolder) && _cardHolder !== _cardHolderOld
      if (_cardHolderExists) {
        this.showWhereIsMyCardExists = true
      } else {
        this.$axios(`${this.URLWhereIsMyCard}&func=Update&cardholderId=${_cardHolderId}&cardholder=${encodeURI(_cardHolder.replace(',', ' '))}&discounted=${_discounted}&whohasthecard=${encodeURI(_whoHasTheCard.replace(',', ''))}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.getTableWhereIsMyCard()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    deleteWhereIsMyCard (_cardHolderId) {
      console.log('deleteWhereIsMyCard: ' + _cardHolderId)

      this.$axios(`${this.URLWhereIsMyCard}&func=Delete&cardholderId=${_cardHolderId}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.getTableWhereIsMyCard()
            this.editWhereIsMyCard = false
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
