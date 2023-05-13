<template>
  <q-page>

    <!-- Active matchs area (Titel) -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>Aktuelle Spiele</q-toolbar-title>
        <q-btn class="bg-white text-primary" icon="add" label="Neu" @click="addMatch = true" v-if="IsAdministrator" />
      </q-toolbar>
    </div>

    <!-- List of active matches -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="(match, i) in activeMatchObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onMatchClick(match.row, match.matchId, match.match, match.published, match.date + ' ' + match.time, match.annotations)">
          <q-item-section avatar>
            <q-avatar size="50px">
              <img :src="getImageHomeTeam(match.match)">
            </q-avatar>
          </q-item-section>
          <q-item-section avatar>
            <q-avatar size="50px">
              <img :src="getImageAwayTeam(match.match)">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label overline>Spiel: {{ match.match }}</q-item-label>
            <q-item-label caption>Wann: {{ match.date }} - {{ match.time }}</q-item-label>
            <q-item-label caption v-if="match.published === 'TRUE'">Publiziert: Ja</q-item-label>
            <q-item-label caption v-if="match.published === 'FALSE'">Publiziert: Nein</q-item-label>
            <q-item-label caption>Kommentar: {{ match.annotations }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Inactive matchs area (Titel) -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>Vergangene Spiele</q-toolbar-title>
      </q-toolbar>
    </div>

    <!-- List of inactive matches -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="(match, i) in inactiveMatchObject"
        :key="i"
        v-ripple>
        <q-item>
          <q-item-section avatar>
            <q-avatar size="50px">
              <img :src="getImageHomeTeam(match.match)">
            </q-avatar>
          </q-item-section>
          <q-item-section avatar>
            <q-avatar size="50px">
              <img :src="getImageAwayTeam(match.match)">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label overline>Spiel: {{ match.match }}</q-item-label>
            <q-item-label caption>Wann: {{ match.date }} - {{ match.time }}</q-item-label>
            <q-item-label caption v-if="match.published === 'TRUE'">Publiziert: Ja</q-item-label>
            <q-item-label caption v-if="match.published === 'FALSE'">Publiziert: Nein</q-item-label>
            <q-item-label caption>Kommentar: {{ match.annotations }}</q-item-label>
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
            <q-btn icon="archive" color="primary" @click="arcMatch = true" v-if="IsAdministrator" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editMatchSave(intMatchRow, txtMatchId, txtMatch, txtMatchOld, chbPublished, txtDatetime, txtAnnotations)" :disable="txtMatch === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Archive match -->
      <q-dialog v-model="arcMatch" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="archive" color="primary" text-color="white" />
            <span class="q-ml-sm">Spiel archivieren?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Nein" color="primary" v-close-popup />
            <q-btn flat label="Ja" color="primary" @click="archiveMatch(intMatchRow, txtMatchId, txtDatetime)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- End Dialogs match -->
    </div>

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import useQuasar from 'quasar/src/composables/use-quasar.js'
import { IsAdministrator, URLMatch, URLParticipant, URLParticipantArchive, getImageHomeTeam, getImageAwayTeam } from 'src/boot/utils.js'
import { ref } from 'vue'

const _constMatchRow = ref(0)
const _constMatchId = ref('')
const _constMatch = ref('')
const _constMatchOld = ref('')
const _constPublished = ref(false)
const _constDatetime = ref('')
const _constAnnotations = ref('')

export default {
  name: 'ListMatch',

  setup () {
    const $q = useQuasar()

    return {
      intMatchRow: ref(_constMatchRow),
      txtMatchId: ref(_constMatchId),
      txtMatch: ref(_constMatch),
      txtMatchOld: ref(_constMatchOld),
      chbPublished: ref(_constPublished),
      txtDatetime: ref(_constDatetime),
      txtAnnotations: ref(_constAnnotations),

      txtMatchNew: ref(''),
      chbPublishedNew: ref(false),
      txtDatetimeNew: ref(''),
      txtAnnotationsNew: ref('<STANDARDTEXT>'),

      onMatchAlreadyExists () {
        $q.notify({
          type: 'negative',
          message: 'Dieses Spiel besteht bereits!'
        })
      },

      addMatch: ref(false),
      editMatch: ref(false),
      arcMatch: ref(false)
    }
  },

  data () {
    return {
      IsAdministrator,
      URLMatch,
      URLParticipant,
      URLParticipantArchive,
      getImageHomeTeam,
      getImageAwayTeam,

      activeMatchObject: [
        {
          row: '',
          matchId: '',
          match: '',
          published: '',
          time: '',
          annotations: '',
          date: ''
        }
      ],

      inactiveMatchObject: [
        {
          row: '',
          matchId: '',
          match: '',
          published: '',
          time: '',
          annotations: '',
          date: ''
        }
      ]
    }
  },

  computed: {
  },

  mounted () {
    this.getTableActiveMatch()
    this.getTableInactiveMatch()
  },

  methods: {
    getTableActiveMatch () {
      this.activeMatchObject = []

      const publishedParam = this.IsAdministrator ? '' : 'TRUE'
      // console.log('URLMatch: ' + this.URLMatch + '&func=ReadActive&published=' + publishedParam)
      this.$axios(`${this.URLMatch}&func=ReadActive&published=${publishedParam}`)
        .then((res) => {
          this.tableMatch = res.data.split('\n')
          for (let index = 0; index < this.tableMatch.length - 1; index++) {
            const element = this.tableMatch[index].split(',')
            this.setActiveMatchObject(element[0], element[1], element[3], element[4], element[5].substring(0, 5), element[6].replace(/<br>/g, '\n'), element[7])
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setActiveMatchObject (_row, _matchId, _match, _published, _time, _annotations, _date) {
      this.activeMatchObject.push({ row: parseInt(_row), matchId: _matchId, match: _match, published: _published, time: _time, annotations: _annotations, date: _date })

      // Sort array of objects
      this.activeMatchObject.sort(function (a, b) {
        let dateA = a.date
        dateA = dateA.substring(6, 10) + dateA.substring(3, 5) + dateA.substring(0, 2)

        let dateB = b.date
        dateB = dateB.substring(6, 10) + dateB.substring(3, 5) + dateB.substring(0, 2)

        if (dateA > dateB) return 1
        if (dateA < dateB) return -1
        return 0
      })
    },

    onMatchClick (_row, _matchId, _match, _published, _datetime, _annotations) {
      // console.log('Clicked on an Match: ' + _row + ', ' + _matchId + ', ' + _match + ', ' + _published + ', ' + _datetime + ', ' + _annotations)
      _constMatchRow.value = _row
      _constMatchId.value = _matchId
      _constMatch.value = _match
      _constMatchOld.value = _match
      _constPublished.value = _published === 'TRUE'
      _constDatetime.value = _datetime
      _constAnnotations.value = _annotations

      if (this.IsAdministrator) this.editMatch = true
    },

    addMatchSave (_match, _published, _datetime, _annotations) {
      // console.log('addMatchSave: ' + _match + ', ' + _published + ', ' + _datetime + ', ' + _annotations)

      const _matches = this.activeMatchObject.map(el => el.match)
      const _matchExists = _matches.includes(_match)
      if (_matchExists) {
        this.onMatchAlreadyExists()
      } else {
        const _date = _datetime.substring(0, 10)
        const _time = _datetime.substring(11, 16)

        this.$axios(`${this.URLMatch}&func=Add&match=${encodeURI(_match.replace(',', ' '))}&published=${_published}&time=${_time}&annotations=${encodeURI(_annotations.replace(',', ';').replace(/(?:\r\n|\r|\n)/g, '<br>'))}&date=${_date}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.getTableActiveMatch()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    editMatchSave (_row, _matchId, _match, _matchOld, _published, _datetime, _annotations) {
      // console.log('editMatchSave - Update: ' + _row + ', ' + _matchId + ', ' + _match + ', ' + _matchOld + ', ' + _published + ', ' + _datetime + ', ' + _annotations)

      const _matches = this.activeMatchObject.map(el => el.match)
      const _matchExists = _matches.includes(_match) && _match !== _matchOld
      if (_matchExists) {
        this.onMatchAlreadyExists()
      } else {
        const _date = _datetime.substring(0, 10)
        const _time = _datetime.substring(11, 16)
        const _newMatch = _match.trim() + ' ' + _date.substring(0, 6) + _date.substring(8, 10) + ' - ' + _time

        this.$axios(`${this.URLMatch}&func=Update&row=${_row}&matchId=${_matchId}&match=${encodeURI(_match.replace(',', ' '))}&published=${_published}&time=${_time}&annotations=${encodeURI(_annotations.replace(',', ';').replace(/(?:\r\n|\r|\n)/g, '<br>'))}&date=${_date}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              // console.log('editMatchSave - UpdateMatch: ' + _matchId + ', ' + _newMatch)
              this.$axios(`${this.URLParticipant}&func=UpdateMatch&matchId=${_matchId}&newMatch=${_newMatch}`)
                .then((res2) => {
                  if (res2.data === 'Success, requested action completed') {
                    this.getTableActiveMatch()
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
    },

    async archiveMatch (_row, _matchId, _datetime) {
      // console.log('archiveMatch: ' + _row + ', ' + _matchId + ', ' + _datetime)

      const _date = _datetime.substring(0, 10)

      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

      this.$axios(`${this.URLParticipant}&func=Read&matchId=${_matchId}`)
        .then(async (res) => {
          this.tableParticipant = res.data.split('\n')
          for (let index = 0; index < this.tableParticipant.length - 1; index++) {
            const element = this.tableParticipant[index].split(',')
            await sleep(1000)
            this.$axios(`${this.URLParticipantArchive}&func=Add&timestamp=${element[3]}&matchId=${element[2]}&match=${element[4]}&participant=${element[5]}&arrival=${element[6]}&annotations=${element[7]}&action=${element[8]}&reaction=${element[9]}&date=${_date}`)
              .catch((err) => {
                console.log(err)
              })
          }
        })
        .catch((err) => {
          console.log(err)
        })

      this.inactivateMatch(_row, _matchId)
    },

    inactivateMatch (_row, _matchId) {
      this.$axios(`${this.URLParticipant}&func=DeleteMatch&matchId=${_matchId}`)
        .then((res3) => {
          if (res3.data === 'Success, requested action completed') {
            // console.log(this.URLMatch + '&func=Inactivate&row=' + _row + '&matchId=' + _matchId)
            this.$axios(`${this.URLMatch}&func=Inactivate&row=${_row}&matchId=${_matchId}`)
              .then((res4) => {
                if (res4.data === 'Success, requested action completed') {
                  this.getTableActiveMatch()
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
    },

    getTableInactiveMatch () {
      this.inactiveMatchObject = []

      // console.log('URLMatch: ' + this.URLMatch + '&func=ReadInactive')
      this.$axios(`${this.URLMatch}&func=ReadInactive`)
        .then((res) => {
          this.tableMatch = res.data.split('\n')
          for (let index = 0; index < this.tableMatch.length - 1; index++) {
            const element = this.tableMatch[index].split(',')
            this.setInactiveMatchObject(element[0], element[1], element[3], element[4], element[5].substring(0, 5), element[6].replace(/<br>/g, '\n'), element[7])
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setInactiveMatchObject (_row, _matchId, _match, _published, _time, _annotations, _date) {
      this.inactiveMatchObject.push({ row: parseInt(_row), matchId: _matchId, match: _match, published: _published, time: _time, annotations: _annotations, date: _date })

      // Sort array of objects
      this.inactiveMatchObject.sort(function (a, b) {
        let dateA = a.date
        dateA = dateA.substring(6, 10) + dateA.substring(3, 5) + dateA.substring(0, 2)

        let dateB = b.date
        dateB = dateB.substring(6, 10) + dateB.substring(3, 5) + dateB.substring(0, 2)

        if (dateA > dateB) return 1
        if (dateA < dateB) return -1
        return 0
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
