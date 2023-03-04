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
            <q-btn icon="save" label="Speichern" @click="addMatchSave(txtMatchNew, chbPublishedNew, txtDatetimeNew, txtAnnotationsNew)" :disable="txtMatchNew === ''" v-close-popup />
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
            <q-btn icon="delete" color="primary" @click="delMatch = true" v-if="IsAdministrator" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editMatchSave(intPosition, txtOldMatch, txtMatch, chbPublished, txtDatetime, txtAnnotations)" :disable="txtMatch === ''" v-close-popup />
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
            <q-btn flat label="Ja" color="primary" @click="archiveMatch(intPosition, txtOldMatch, txtDatetime)" v-close-popup />
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
      IsAdministrator: ref(true),

      intPosition: ref(_constPosition),
      txtMatch: ref(_constMatch),
      chbPublished: ref(_constPublished),
      txtDatetime: ref(_constDatetime),
      txtAnnotations: ref(_constAnnotations),
      txtOldMatch: ref(_constMatchName),

      txtMatchNew: ref(''),
      chbPublishedNew: ref(false),
      txtDatetimeNew: ref(''),
      txtAnnotationsNew: ref('<STANDARDTEXT>'),

      addMatch: ref(false),
      editMatch: ref(false),
      delMatch: ref(false)
    }
  },

  data () {
    return {
      URLMatch: 'https://script.google.com/macros/s/AKfycbyh43MSF1Vz9W3TZ0_9e273B81CtCEk4se3yHj9HCbIvBlfw9g6tHE3d5O8eXW3yIkyog/exec?ID=1znyBnIzqghCeRImZ8fSVGB_gR6TESuqep20YbUhkhSU&SH=BGB-Match',
      URLParticipant: 'https://script.google.com/macros/s/AKfycbz7shs3qaBAxwLyvDH7XZVuqFcX2Yg8mzVxZe8RcO3KWQuFCRKlBSKu5uMSvJTKQOGkDw/exec?ID=1HCZKuGO-dmNJwrEsFyN2acvnE-WMHabBW8jWdhO4ggI&SH=BGB-Participant',
      URLParticipantArchive: 'https://script.google.com/macros/s/AKfycby__5OEag_-ClbApCv2r8x9Ity4MYBBrrJ7ZD4B2FOeqxSAZD-bB0bUqM4Su91W3NvnPA/exec?ID=1fjnXO0Fsrj03Da8CDaBSClheSrE9Qr6VMNWzL-JQR7s&SH=BGB-ParticipantArchive',

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
      const publishedParam = this.IsAdministrator ? '' : 'TRUE'
      console.log('URLMatch: ' + this.URLMatch + '&func=Read&published=' + publishedParam)
      this.$axios(`${this.URLMatch}&func=Read&published=${publishedParam}`)
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

      const _date = _datetime.substr(0, 10)
      const _time = _datetime.substr(11, 5)
      _constMatchName.value = _match.trim() + ' ' + _date.substr(0, 6) + _date.substr(8, 2) + ' - ' + _time.substr(0, 5)

      if (this.IsAdministrator) this.editMatch = true
    },

    addMatchSave (_match, _published, _datetime, _annotations) {
      console.log('addMatchSave: ' + _match + ', ' + _published + ', ' + _datetime + ', ' + _annotations)

      const _date = _datetime.substr(0, 10)
      const _time = _datetime.substr(11, 5)

      this.$axios(`${this.URLMatch}&func=Add&match=${encodeURI(_match.replace(',', ' '))}&published=${_published}&time=${_time}&annotations=${encodeURI(_annotations.replace(',', ';'))}&date=${_date}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.getTableMatch()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    editMatchSave (_position, _oldMatch, _match, _published, _datetime, _annotations) {
      console.log('editMatchSave - Update: ' + _position + ', ' + _oldMatch + ', ' + _match + ', ' + _published + ', ' + _datetime + ', ' + _annotations)

      const _date = _datetime.substr(0, 10)
      const _time = _datetime.substr(11, 5)
      const _newMatch = _match.trim() + ' ' + _date.substr(0, 6) + _date.substr(8, 2) + ' - ' + _time.substr(0, 5)
      console.log('editMatchSave - UpdateMatch: ' + _oldMatch + ', ' + _newMatch)

      this.$axios(`${this.URLMatch}&func=Update&index=${_position}&match=${encodeURI(_match.replace(',', ' '))}&published=${_published}&time=${_time}&annotations=${encodeURI(_annotations.replace(',', ';'))}&date=${_date}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.$axios(`${this.URLParticipant}&func=UpdateMatch&oldMatch=${_oldMatch}&newMatch=${_newMatch}`)
              .then((res2) => {
                if (res2.data === 'Success, requested action completed') {
                  this.getTableMatch()
                }
              })

              .catch((err) => {
                console.log(err)
              })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    async archiveMatch (_position, _matchToDelete, _datetime) {
      console.log('deleteMatch: ' + _position + ', ' + _matchToDelete + ', ' + _datetime)

      const _date = _datetime.substr(0, 10)

      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

      this.$axios(`${this.URLParticipant}&func=ReadAll&match=${_matchToDelete}`)
        .then(async (res) => {
          this.tableParticipant = res.data.split('\n')
          for (let index = 0; index < this.tableParticipant.length - 1; index++) {
            const element = this.tableParticipant[index].split(',')
            await sleep(1000)
            this.$axios(`${this.URLParticipantArchive}&func=Add&timestamp=${element[1]}&match=${element[2]}&participant=${element[3]}&arrival=${element[4]}&annotations=${element[5]}&action=${element[6]}&reaction=${element[7]}&date=${_date}`)
              .catch((err) => {
                console.log(err)
              })
          }
        })
        .catch((err) => {
          console.log(err)
        })

      this.deleteMatch(_position, _matchToDelete)
    },

    deleteMatch (_position, _matchToDelete) {
      this.$axios(`${this.URLParticipant}&func=DeleteMatch&match=${_matchToDelete}`)
        .then((res3) => {
          if (res3.data === 'Success, requested action completed') {
            this.$axios(`${this.URLMatch}&func=Delete&index=${_position}`)
              .then((res4) => {
                if (res4.data === 'Success, requested action completed') {
                  this.getTableMatch()
                  this.editMatch = false
                }
              })
              .catch((err) => {
                console.log(err)
              })
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
