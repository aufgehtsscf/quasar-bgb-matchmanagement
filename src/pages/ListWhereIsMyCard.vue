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
      <q-list dark bordered separator style="max-width: 470px" v-for="i in index"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onWhereIsMyCardClick(position[i], cardHolder[i], discounted[i], whoHasTheCard[i])" v-if="i > 0">
          <q-item-section>
            <q-item-label overline>Inhaber: {{ cardHolder[i] }}</q-item-label>
            <q-item-label caption>Ermäßigt: {{ textDiscounted[i] }}</q-item-label>
            <q-item-label caption>Wer hat die Karte: {{ whoHasTheCard[i] }}</q-item-label>
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
                <div><q-checkbox left-label v-model="txtDiscountedNew" label="Ermäßigt" /></div>
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
                <div><q-checkbox left-label v-model="txtDiscounted" label="Ermäßigt" /></div>
              </div>
            </div>

            <q-input dense v-model="txtWhoHasTheCard" autofocus label="Wer hat die Karte" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" label="Löschen" color="primary" @click="delWhereIsMyCard = true" v-if="IsAdministrator" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editWhereIsMyCardSave(intPosition, txtCardHolder, txtDiscounted, txtWhoHasTheCard)" :disable="txtCardHolder === ''" v-close-popup />
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
      IsAdministrator: ref(true),

      intPosition: ref(_constPosition),
      txtCardHolder: ref(_constCardHolder),
      txtDiscounted: ref(_constDiscounted),
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
      URLWhereIsMyCard: 'https://script.google.com/macros/s/AKfycbx3lJiQMsu9KNp7WgXYO4FX-5nPjeEpP7f2SmFgZ8ZZ2f944rghYctGxUMiNVZZ7Jn2/exec?ID=1AA2nnIb886xaBjpSaxwf2JNtujKnJc4xSVR-ChRGs2U&SH=BGB-WhereIsMyCard',

      index: [],
      position: [],
      cardHolder: [],
      discounted: [],
      textDiscounted: [],
      whoHasTheCard: []
    }
  },

  computed: {
  },

  mounted () {
    this.getTableWhereIsMyCard()
  },

  methods: {
    getTableWhereIsMyCard () {
      console.log('URLWhereIsMyCard: ' + this.URLWhereIsMyCard + '&func=Read')
      this.$axios(`${this.URLWhereIsMyCard}&func=Read`)
        .then((res) => {
          this.tableWhereIsMyCard = res.data.split('\n')
          for (let index = 0; index < this.tableWhereIsMyCard.length - 1; index++) {
            const element = this.tableWhereIsMyCard[index].split(',')
            for (let index2 = 0; index2 < element.length; index2++) {
              switch (index2) {
                case 0:
                  this.index[index + 1] = index + 1
                  this.position[index + 1] = element[index2]
                  break
                case 2:
                  this.cardHolder[index + 1] = element[index2]
                  break
                case 3:
                  this.discounted[index + 1] = element[index2]
                  if (element[index2] === 'TRUE') {
                    this.textDiscounted[index + 1] = 'Ja'
                  } else {
                    this.textDiscounted[index + 1] = 'Nein'
                  }
                  break
                case 4:
                  this.whoHasTheCard[index + 1] = element[index2]
                  break
                default:
                  break
              }
            }
          }
          // console.log(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
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

    editWhereIsMyCardSave (_position, _cardHolder, _discounted, _whoHasTheCard, _annotations) {
      console.log('editWhereIsMyCardSave: ' + _position + ', ' + _cardHolder + ', ' + _discounted + ', ' + _whoHasTheCard + ', ' + _annotations)

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
