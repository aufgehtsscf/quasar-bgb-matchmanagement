<template>
  <q-page>
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>
          Spiele
        </q-toolbar-title>
      </q-toolbar>
    </div>

    <!-- List of matches -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="i in index"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onMatchClick(position[i], match[i], published[i], time[i], annotations[i], date[i])" v-if="i > 0">
          <q-item-section>
            <q-item-label overline>{{ match[i] }}</q-item-label>
            <q-item-label caption>{{ date[i] }} - {{ time[i] }}</q-item-label>
            <q-item-label caption>{{ textPublished[i] }}</q-item-label>
            <q-item-label caption>{{ annotations[i] }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Dialogs -->
    <div class="q-pa-md q-gutter-sm">

      <!-- Start Dialogs match -->
      <!-- Add match -->
      <q-dialog v-model="addMatch" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Spiel erfassen</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="txtMatchNew" autofocus label="Spiel" />
            <q-input dense v-model="txtAnnotationsNew"  label="Kommentar"/>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addMatchSave(txtParticipantNew, txtArrivalNew, txtAnnotationsParticipantNew, txtActionNew, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit match -->
      <q-dialog v-model="editMatch" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Spiel ändern</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="txtMatch" autofocus label="Spiel" />
            <q-input dense v-model="txtPublished" label="Publizieren" />
            <q-input dense v-model="txtDate" label="Datum" />
            <q-input dense v-model="txtTime" label="Uhrzeit" />
            <q-input dense v-model="txtAnnotations"  label="Kommentar"/>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" label="Löschen" color="primary" @click="delMatch = true" v-if="IsAdministrator" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editMatchSave(intParticipantPosition, txtParticipantParticipant, txtParticipantArrival, txtParticipantAnnotations, txtParticipantAction, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete match -->
      <q-dialog v-model="delMatch" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="primary" text-color="white" />
            <span class="q-ml-sm">Datensatz löschen?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Nein" color="primary" v-close-popup />
            <q-btn flat label="Ja" color="primary" @click="deleteMatch(intParticipantPosition, txtParticipantReaction, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- End Dialogs match -->
    </div>

    <q-img src="statics/BGB.jpg" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import { ref } from 'vue'

const _constPosition = ref('')
const _constMatch = ref('')
const _constPublished = ref('')
const _constTime = ref('')
const _constAnnotations = ref('')
const _constDate = ref('')
const _constMatchName = ref('')

export default {
  name: 'ListMatch',

  setup () {
    return {
      IsAdministrator: ref(false),

      intPosition: ref(_constPosition),
      txtMatch: ref(_constMatch),
      txtPublished: ref(_constPublished),
      txtTime: ref(_constTime),
      txtAnnotations: ref(_constAnnotations),
      txtDate: ref(_constDate),

      txtMatchNew: ref(''),
      txtPublishedNew: ref(''),
      txtTimeNew: ref(''),
      txtAnnotationsNew: ref(''),
      txtDateNew: ref(''),

      addMatch: ref(false),
      editMatch: ref(false),
      delMatch: ref(false)
    }
  },

  data () {
    return {
      URLMatch: 'https://script.google.com/macros/s/AKfycbyh43MSF1Vz9W3TZ0_9e273B81CtCEk4se3yHj9HCbIvBlfw9g6tHE3d5O8eXW3yIkyog/exec?ID=1znyBnIzqghCeRImZ8fSVGB_gR6TESuqep20YbUhkhSU&SH=BGB-Match',

      index: [],
      position: [],
      match: [],
      published: [],
      textPublished: [],
      time: [],
      annotations: [],
      date: []
    }
  },

  computed: {
  },

  mounted () {
    this.getTableMatch()
  },

  methods: {
    getTableMatch () {
      console.log('URLMatch: ' + this.URLMatch + '&func=Read&published=TRUE')
      this.$axios(`${this.URLMatch}&func=Read&published=TRUE`)
        .then((res) => {
          this.tableMatch = res.data.split('\n')
          for (let index = 0; index < this.tableMatch.length - 1; index++) {
            const element = this.tableMatch[index].split(',')
            for (let index2 = 0; index2 < element.length; index2++) {
              switch (index2) {
                case 0:
                  this.index[index + 1] = index + 1
                  this.position[index + 1] = element[index2]
                  break
                case 2:
                  this.match[index + 1] = element[index2]
                  break
                case 3:
                  this.published[index + 1] = element[index2]
                  if (element[index2] === 'TRUE') {
                    this.textPublished[index + 1] = 'Aktiv'
                  } else {
                    this.textPublished[index + 1] = 'Inaktiv'
                  }
                  break
                case 4:
                  this.time[index + 1] = element[index2].substr(0, 5)
                  break
                case 5:
                  this.annotations[index + 1] = element[index2].replace(/§§§/g, ' / ')
                  break
                case 6:
                  this.date[index + 1] = element[index2]
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

    onMatchClick (_position, _match, _published, _time, _annotations, _date) {
      console.log('Clicked on an Match: ' + _position + ', ' + _match + ', ' + _published + ', ' + _time + ', ' + _annotations + ', ' + _date)
      _constPosition.value = _position
      _constMatch.value = _match
      _constPublished.value = _published
      _constTime.value = _time
      _constAnnotations.value = _annotations
      _constDate.value = _date
      _constMatchName.value = _match.trim() + ' ' + _date.substr(0, 6) + _date.substr(8, 2) + ' - ' + _time

      this.editMatch = true
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
