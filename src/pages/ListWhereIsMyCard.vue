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
        <q-item clickable v-ripple @click="onWhereIsMyCardClick(card.position, card.cardHolder, card.discounted, card.whoHasTheCard)">
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
      <!-- Add WhereIsMyCard -->
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

      <!-- Edit WhereIsMyCard -->
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
            <q-btn icon="save" label="Speichern" @click="editWhereIsMyCardSave(intPosition, txtCardHolder, boolDiscounted, txtWhoHasTheCard)" :disable="txtCardHolder === ''" v-close-popup />
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
            <q-btn flat label="Ja" color="primary" @click="deleteWhereIsMyCard(intPosition)" v-close-popup />
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

const _constPosition = ref('')
const _constCardHolder = ref('')
const _constDiscounted = ref('')
const _constWhoHasTheCard = ref('')

export default {
  name: 'ListWhoHasTheCard',

  setup () {
    return {
      IsAdministrator: ref(false),

      intPosition: ref(_constPosition),
      txtCardHolder: ref(_constCardHolder),
      boolDiscounted: ref(_constDiscounted),
      txtWhoHasTheCard: ref(_constWhoHasTheCard),

      txtCardHolderNew: ref(''),
      txtDiscountedNew: ref(false),
      txtWhoHasTheCardNew: ref(''),

      addWhereIsMyCard: ref(false),
      editWhereIsMyCard: ref(false),
      delWhereIsMyCard: ref(false)
    }
  },

  data () {
    return {
      URLWhereIsMyCard: 'https://script.google.com/macros/s/AKfycbxvZGxE36y7SOsB3ebFVPDlz4C3HYROautgYqbLE5aO1eD7JVWNBqD-49JsP182OAV_/exec?ID=1AA2nnIb886xaBjpSaxwf2JNtujKnJc4xSVR-ChRGs2U&SH=BGB-WhereIsMyCard',

      whereIsMyCardObject: [
        {
          position: 0,
          cardHolder: '',
          discounted: '',
          whoHasTheCard: ''
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
            this.setWhereIsMyCardObject(element[0], element[2], element[3], element[4])
          }
          // console.log(this.whereIsMyCardObject)
          // console.log(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setWhereIsMyCardObject (_position, _cardHolder, _discounted, _whoHasTheCard) {
      // console.log('Function WhereIsMyCard: ' + _position + ', ' + _cardHolder + ', ' + _discounted + ', ' + _whoHasTheCard)
      this.whereIsMyCardObject.push({ position: _position, cardHolder: _cardHolder, discounted: _discounted, whoHasTheCard: _whoHasTheCard })
    },

    onWhereIsMyCardClick (_position, _cardHolder, _discounted, _whoHasTheCard) {
      console.log('Clicked on WhereIsMyCard: ' + _position + ', ' + _cardHolder + ', ' + _discounted + ', ' + _whoHasTheCard)
      _constPosition.value = _position
      _constCardHolder.value = _cardHolder
      _constDiscounted.value = _discounted === 'TRUE'
      _constWhoHasTheCard.value = _whoHasTheCard

      this.editWhereIsMyCard = true
    },

    addWhereIsMyCardSave (_cardHolder, _discounted, _whoHasTheCard) {
      console.log('addWhereIsMyCardSave: ' + _cardHolder + ', ' + _discounted + ', ' + _whoHasTheCard)

      this.$axios(`${this.URLWhereIsMyCard}&func=Add&cardholder=${encodeURI(_cardHolder.replace(',', ' '))}&discounted=${_discounted}&whohasthecard=${encodeURI(_whoHasTheCard.replace(',', ''))}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.getTableWhereIsMyCard()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    editWhereIsMyCardSave (_position, _cardHolder, _discounted, _whoHasTheCard) {
      console.log('editWhereIsMyCardSave: ' + _position + ', ' + _cardHolder + ', ' + _discounted + ', ' + _whoHasTheCard)

      this.$axios(`${this.URLWhereIsMyCard}&func=Update&index=${_position}&cardholder=${encodeURI(_cardHolder.replace(',', ' '))}&discounted=${_discounted}&whohasthecard=${encodeURI(_whoHasTheCard.replace(',', ''))}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.getTableWhereIsMyCard()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    deleteWhereIsMyCard (_position) {
      console.log('deleteWhereIsMyCard: ' + _position)

      this.$axios(`${this.URLWhereIsMyCard}&func=Delete&index=${_position}`)
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
