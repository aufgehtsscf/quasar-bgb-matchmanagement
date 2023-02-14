<template>
  <q-page>

    <!-- Match area (Titel) -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>Spiele</q-toolbar-title>
        <q-btn class="bg-white text-primary" icon="add" label="Neu" @click="addMatch = true" v-if="IsAdministrator" />
      </q-toolbar>
    </div>

    <!-- List of matches -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="i in index"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onMatchClick(position[i], match[i], published[i], date[i] + ' ' + time[i], annotations[i])" v-if="i > 0">
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

            <div class="q-pt-md">
              <div class="q-gutter-sm">
                <div><q-checkbox left-label v-model="chbPublishedNew" label="Publizieren" /></div>
              </div>
            </div>

            <div class="q-pt-md" style="max-width: 300px">
              <q-input filled v-model="txtDatetimeNew">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="txtDatetimeNew" mask="DD.MM.YYYY HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="txtDatetimeNew" mask="DD.MM.YYYY HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="q-pt-md" style="max-width: 300px">
              <q-input v-model="txtAnnotationsNew" filled type="textarea" label="Kommentar"/>
            </div>

          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addMatchSave(txtMatchNew, chbPublishedNew, txtDatetimeNew, txtAnnotationsNew)" v-close-popup />
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

            <div class="q-pt-md">
              <div class="q-gutter-sm">
                <div><q-checkbox left-label v-model="chbPublished" label="Publizieren" /></div>
              </div>
            </div>

            <div class="q-pt-md" style="max-width: 300px">
              <q-input filled v-model="txtDatetime">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="txtDatetime" mask="DD.MM.YYYY HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="txtDatetime" mask="DD.MM.YYYY HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="q-pt-md" style="max-width: 300px">
              <q-input v-model="txtAnnotations" filled type="textarea" label="Kommentar"/>
            </div>

          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" label="Löschen" color="primary" @click="delMatch = true" v-if="IsSuperadministrator" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editMatchSave(intPosition, txtMatch, chbPublished, txtDatetime, txtAnnotations)" v-close-popup />
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
            <q-btn flat label="Ja" color="primary" @click="deleteMatch(intPosition)" v-close-popup />
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
const _constPublished = ref(false)
const _constDatetime = ref('')
const _constAnnotations = ref('')
const _constMatchName = ref('')

export default {
  name: 'ListMatch',

  setup () {
    return {
      IsAdministrator: ref(false),
      IsSuperadministrator: ref(false),

      intPosition: ref(_constPosition),
      txtMatch: ref(_constMatch),
      chbPublished: ref(_constPublished),
      txtDatetime: ref(_constDatetime),
      txtAnnotations: ref(_constAnnotations),

      txtMatchNew: ref(''),
      chbPublishedNew: ref(false),
      txtDatetimeNew: ref(''),
      txtAnnotationsNew: ref(''),

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

    onMatchClick (_position, _match, _published, _datetime, _annotations) {
      console.log('Clicked on an Match: ' + _position + ', ' + _match + ', ' + _published + ', ' + _datetime + ', ' + _annotations)
      _constPosition.value = _position
      _constMatch.value = _match
      _constPublished.value = _published === 'TRUE'
      _constDatetime.value = _datetime
      _constAnnotations.value = _annotations
      _constMatchName.value = _match.trim() + ' ' + _datetime.replace(' ', ' - ')

      if (this.IsAdministrator) this.editMatch = true
    },

    addMatchSave (_match, _published, _datetime, _annotations) {
      console.log('addMatchSave: ' + _match + ', ' + _published + ', ' + _datetime + ', ' + _annotations)

      if (_match !== '') {
        const _date = _datetime.substr(0, 10)
        const _time = _datetime.substr(11, 5)

        this.$axios(`${this.URLMatch}&func=Add&match=${encodeURI(_match.replace(',', ' '))}&published=${_published}&time=${_time}&annotations=${encodeURI(_datetime.replace(',', ';'))}&date=${_date}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.getTableMatch()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        alert('Spiel ist erforderlich')
      }
    },

    editMatchSave (_position, _match, _published, _datetime, _annotations) {
      console.log('editMatchSave: ' + _position + ', ' + _match + ', ' + _published + ', ' + _datetime + ', ' + _annotations)

      if (_match !== '') {
        const _date = _datetime.substr(0, 10)
        const _time = _datetime.substr(11, 5)

        this.$axios(`${this.URLMatch}&func=Update&index=${_position}&match=${encodeURI(_match.replace(',', ' '))}&published=${_published}&time=${_time}&annotations=${encodeURI(_annotations.replace(',', ';'))}&date=${_date}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.getTableMatch()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        alert('Spiel ist erforderlich')
      }
    },

    deleteMatch (_position) {
      console.log('deleteMatch: ' + _position)

      this.$axios(`${this.URLMatch}&func=Delete&index=${_position}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.editMatch = false
            this.getTableMatch()
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
