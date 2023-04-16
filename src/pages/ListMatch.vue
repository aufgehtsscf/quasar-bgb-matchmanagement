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
      <q-list dark bordered separator style="max-width: 470px" v-for="(match, i) in matchObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onMatchClick(match.matchId, match.match, match.published, match.date + ' ' + match.time, match.annotations)">
          <q-item-section avatar>
            <q-avatar size="90px">
              <img :src="getImageHomeTeam(match.match)">
            </q-avatar>
          </q-item-section>
          <q-item-section avatar>
            <q-avatar size="90px">
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

      <!-- Show match exists -->
      <q-dialog v-model="showMatchExists" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="pan_tool" color="primary" text-color="white" />
            <span class="q-ml-sm">Dieses Spiel besteht bereits!</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Schliessen" color="primary" v-close-popup />
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
            <q-btn icon="save" label="Speichern" @click="editMatchSave(txtMatchId, txtMatch, txtMatchOld, chbPublished, txtDatetime, txtAnnotations)" :disable="txtMatch === ''" v-close-popup />
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
            <q-btn flat label="Ja" color="primary" @click="archiveMatch(txtMatchId, txtDatetime)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- End Dialogs match -->
    </div>

    <q-img src="statics/BGB.jpg" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import { URLMatch, URLParticipant, URLParticipantArchive } from 'src/boot/axios'
import { ref } from 'vue'

const _constMatchId = ref('')
const _constMatch = ref('')
const _constMatchOld = ref('')
const _constPublished = ref(false)
const _constDatetime = ref('')
const _constAnnotations = ref('')

export default {
  name: 'ListMatch',

  setup () {
    return {
      IsAdministrator: ref(false),

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

      addMatch: ref(false),
      showMatchExists: ref(false),
      editMatch: ref(false),
      delMatch: ref(false)
    }
  },

  data () {
    return {
      URLMatch,
      URLParticipant,
      URLParticipantArchive,

      matchObject: [
        {
          match: '',
          published: '',
          time: '',
          annotations: '',
          date: '',
          matchId: ''
        }
      ]
    }
  },

  computed: {
  },

  mounted () {
    this.getTableMatch()
  },

  methods: {
    getImageHomeTeam (_matchName) {
      if (_matchName.toLowerCase().indexOf('fest') >= 0 ||
          _matchName.toLowerCase().indexOf('party') >= 0 ||
          _matchName.toLowerCase().indexOf('anlass') >= 0 ||
          _matchName.toLowerCase().indexOf('geburtstag') >= 0 ||
          _matchName.toLowerCase().indexOf('event') >= 0) return 'statics/Event.png'
      if (_matchName.toLowerCase().indexOf('test') >= 0) return 'statics/Test.png'
      return 'statics/Freiburg.png'
    },

    getImageAwayTeam (_matchName) {
      if (_matchName.toLowerCase().indexOf('arminia') >= 0) return 'statics/Arminia.png'
      if (_matchName.toLowerCase().indexOf('augsburg') >= 0) return 'statics/Augsburg.png'
      if (_matchName.toLowerCase().indexOf('leverkusen') >= 0) return 'statics/Bayer_Leverkusen.png'
      if (_matchName.toLowerCase().indexOf('bayern') >= 0 || _matchName.toLowerCase().indexOf('münchen') >= 0) return 'statics/Bayern_München.png'
      if (_matchName.toLowerCase().indexOf('bochum') >= 0) return 'statics/Bochum.png'
      if (_matchName.toLowerCase().indexOf('dortmund') >= 0) return 'statics/Borussia_Dortmund.png'
      if (_matchName.toLowerCase().indexOf('gladbach') >= 0) return 'statics/Borussia_Mönchengladbach.png'
      if (_matchName.toLowerCase().indexOf('darmstadt') >= 0) return 'statics/Darmstadt.png'
      if (_matchName.toLowerCase().indexOf('braunschweig') >= 0) return 'statics/Eintracht_Braunschweig.png'
      if (_matchName.toLowerCase().indexOf('frankfurt') >= 0) return 'statics/Eintracht_Frankfurt.png'
      if (_matchName.toLowerCase().indexOf('fortuna') >= 0 || _matchName.toLowerCase().indexOf('düsseldorf') >= 0) return 'statics/Fortuna_Düsseldorf.png'
      if (_matchName.toLowerCase().indexOf('greuther') >= 0 || _matchName.toLowerCase().indexOf('fürth') >= 0) return 'statics/Greuther_Fürth.png'
      if (_matchName.toLowerCase().indexOf('hamburg') >= 0 || _matchName.toLowerCase().indexOf('hsv') >= 0) return 'statics/Hamburger_SV.png'
      if (_matchName.toLowerCase().indexOf('hannover') >= 0) return 'statics/Hannover.png'
      if (_matchName.toLowerCase().indexOf('hansa') >= 0 || _matchName.toLowerCase().indexOf('rostock') >= 0) return 'statics/Hansa_Rostock.png'
      if (_matchName.toLowerCase().indexOf('heidenheim') >= 0) return 'statics/Heidenheim.png'
      if (_matchName.toLowerCase().indexOf('hertha') >= 0) return 'statics/Hertha.png'
      if (_matchName.toLowerCase().indexOf('hoffenheim') >= 0) return 'statics/Hoffenheim.png'
      if (_matchName.toLowerCase().indexOf('holstein') >= 0) return 'statics/Holstein.png'
      if (_matchName.toLowerCase().indexOf('jahn') >= 0 || _matchName.toLowerCase().indexOf('regensburg') >= 0) return 'statics/Jahn_Regensburg.png'
      if (_matchName.toLowerCase().indexOf('fck') >= 0 || _matchName.toLowerCase().indexOf('kaiserslautern') >= 0) return 'statics/Kaiserslautern.png'
      if (_matchName.toLowerCase().indexOf('ksc') >= 0 || _matchName.toLowerCase().indexOf('karlsruher') >= 0) return 'statics/Karlsruher.png'
      if (_matchName.toLowerCase().indexOf('köln') >= 0) return 'statics/Köln.png'
      if (_matchName.toLowerCase().indexOf('leipzig') >= 0) return 'statics/Leipzig.png'
      if (_matchName.toLowerCase().indexOf('magdeburg') >= 0) return 'statics/Magdeburg.png'
      if (_matchName.toLowerCase().indexOf('mainz') >= 0) return 'statics/Mainz.png'
      if (_matchName.toLowerCase().indexOf('nürnberg') >= 0) return 'statics/Nürnberg.png'
      if (_matchName.toLowerCase().indexOf('paderborn') >= 0) return 'statics/Paderborn.png'
      if (_matchName.toLowerCase().indexOf('sandhausen') >= 0) return 'statics/Sandhausen.png'
      if (_matchName.toLowerCase().indexOf('schalke') >= 0) return 'statics/Schalke.png'
      if (_matchName.toLowerCase().indexOf('pauli') >= 0) return 'statics/St._Pauli.png'
      if (_matchName.toLowerCase().indexOf('vfb') >= 0 || _matchName.toLowerCase().indexOf('stuttgart') >= 0) return 'statics/Stuttgart.png'
      if (_matchName.toLowerCase().indexOf('union') >= 0) return 'statics/Union_Berlin.png'
      if (_matchName.toLowerCase().indexOf('werder') >= 0 || _matchName.toLowerCase().indexOf('bremen') >= 0) return 'statics/Werder_Bremen.png'
      if (_matchName.toLowerCase().indexOf('wolfsburg') >= 0) return 'statics/Wolfsburg.png'

      if (_matchName.toLowerCase().indexOf('fest') >= 0 ||
          _matchName.toLowerCase().indexOf('party') >= 0 ||
          _matchName.toLowerCase().indexOf('anlass') >= 0 ||
          _matchName.toLowerCase().indexOf('geburtstag') >= 0 ||
          _matchName.toLowerCase().indexOf('event') >= 0) return 'statics/Event.png'
      if (_matchName.toLowerCase().indexOf('test') >= 0) return 'statics/Test.png'
      return 'statics/QuestionMark.png'
    },

    getTableMatch () {
      this.matchObject = []

      const publishedParam = this.IsAdministrator ? '' : 'TRUE'
      // console.log('URLMatch: ' + this.URLMatch + '&func=Read&published=' + publishedParam)
      this.$axios(`${this.URLMatch}&func=Read&published=${publishedParam}`)
        .then((res) => {
          this.tableMatch = res.data.split('\n')
          for (let index = 0; index < this.tableMatch.length - 1; index++) {
            const element = this.tableMatch[index].split(',')
            this.setMatchObject(element[2], element[3], element[4].substring(0, 5), element[5].replace(/<br>/g, '\n'), element[6], element[7])
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setMatchObject (_match, _published, _time, _annotations, _date, _matchId) {
      this.matchObject.push({ match: _match, published: _published, time: _time, annotations: _annotations, date: _date, matchId: _matchId })
    },

    onMatchClick (_matchId, _match, _published, _datetime, _annotations) {
      // console.log('Clicked on an Match: ' + _matchId + ', ' + _match + ', ' + _published + ', ' + _datetime + ', ' + _annotations)
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

      const _matches = this.matchObject.map(el => el.match)
      const _matchExists = _matches.includes(_match)
      if (_matchExists) {
        this.showMatchExists = true
      } else {
        const _date = _datetime.substring(0, 10)
        const _time = _datetime.substring(11, 5)

        this.$axios(`${this.URLMatch}&func=Add&match=${encodeURI(_match.replace(',', ' '))}&published=${_published}&time=${_time}&annotations=${encodeURI(_annotations.replace(',', ';').replace(/(?:\r\n|\r|\n)/g, '<br>'))}&date=${_date}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.getTableMatch()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    editMatchSave (_matchId, _match, _matchOld, _published, _datetime, _annotations) {
      // console.log('editMatchSave - Update: ' + _matchId + ', ' + _match + ', ' + _matchOld + ', ' + _published + ', ' + _datetime + ', ' + _annotations)

      const _matches = this.matchObject.map(el => el.match)
      const _matchExists = _matches.includes(_match) && _match !== _matchOld
      if (_matchExists) {
        this.showMatchExists = true
      } else {
        const _date = _datetime.substring(0, 10)
        const _time = _datetime.substring(11, 5)
        const _newMatch = _match.trim() + ' ' + _date.substring(0, 6) + _date.substring(8, 10) + ' - ' + _time.substring(0, 5)

        this.$axios(`${this.URLMatch}&func=Update&matchId=${_matchId}&match=${encodeURI(_match.replace(',', ' '))}&published=${_published}&time=${_time}&annotations=${encodeURI(_annotations.replace(',', ';').replace(/(?:\r\n|\r|\n)/g, '<br>'))}&date=${_date}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              // console.log('editMatchSave - UpdateMatch: ' + _matchId + ', ' + _newMatch)
              this.$axios(`${this.URLParticipant}&func=UpdateMatch&matchId=${_matchId}&newMatch=${_newMatch}`)
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
      }
    },

    async archiveMatch (_matchId, _datetime) {
      // console.log('deleteMatch: ' + _matchId + ', ' + _datetime)

      const _date = _datetime.substring(0, 10)

      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

      this.$axios(`${this.URLParticipant}&func=ReadAll&matchId=${_matchId}`)
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

      this.deleteMatch(_matchId)
    },

    deleteMatch (_matchId) {
      this.$axios(`${this.URLParticipant}&func=DeleteMatch&matchId=${_matchId}`)
        .then((res3) => {
          if (res3.data === 'Success, requested action completed') {
            // console.log(this.URLMatch + '&func=Delete&matchId=' + _matchId)
            this.$axios(`${this.URLMatch}&func=Delete&matchId=${_matchId}`)
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
