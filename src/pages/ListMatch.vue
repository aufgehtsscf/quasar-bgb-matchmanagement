  <template>
  <q-page>

    <!-- Active matchs area (Titel) -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title class="text-overline">Aktuelle Spiele ({{ activeMatchObject.length }})</q-toolbar-title>
        <q-btn class="bg-white text-primary" icon="add" label="Neu" @click="addMatch = true"  v-if="getCookie('isAdministrator') === 'true'" />
      </q-toolbar>
    </div>

    <!-- List of active matches -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="(match, i) in activeMatchObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onMatchClick(match.row, match.matchId, match.homeTeam, match.awayTeam, match.matchName, match.published, match.date + ' ' + match.time, match.annotations)">
            <q-avatar size="50px" v-if="match.homeTeam !== '' && match.awayTeam !== ''">
              <img :src="getTeamImage(match.homeTeam)">
            </q-avatar>
            <q-item-label v-if="match.homeTeam !== '' && match.awayTeam !== ''">&ThickSpace;</q-item-label>
            <q-avatar size="50px" v-if="match.homeTeam !== '' && match.awayTeam !== ''">
              <img :src="getTeamImage(match.awayTeam)">
            </q-avatar>

            <q-avatar size="50px" v-if="match.homeTeam === '' && match.awayTeam === ''">
              <img :src="getEventImage(match.matchName)">
            </q-avatar>

            <q-item-label>&ThickSpace;&ThickSpace;&ThickSpace;</q-item-label>

            <q-item-section>
              <q-item-label overline>Spiel: {{ match.matchName }}</q-item-label>
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
        <q-toolbar-title class="text-overline">Vergangene Spiele ({{ inactiveMatchObject.length }})</q-toolbar-title>
      </q-toolbar>
    </div>

    <!-- List of inactive matches -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="(match, i) in inactiveMatchObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onInactiveMatchClick(match.matchId, match.matchName, match.date + ' ' + match.time, match.numberOfParticipants)">
            <q-avatar size="50px" v-if="match.homeTeam !== '' && match.awayTeam !== ''">
              <img :src="getTeamImage(match.homeTeam)">
            </q-avatar>
            <q-item-label v-if="match.homeTeam !== '' && match.awayTeam !== ''">&ThickSpace;</q-item-label>
            <q-avatar size="50px" v-if="match.homeTeam !== '' && match.awayTeam !== ''">
              <img :src="getTeamImage(match.awayTeam)">
            </q-avatar>

            <q-avatar size="50px" v-if="match.homeTeam === '' && match.awayTeam === ''">
              <img :src="getEventImage(match.matchName)">
            </q-avatar>

            <q-item-label>&ThickSpace;&ThickSpace;&ThickSpace;</q-item-label>

            <q-item-section>
              <q-item-label overline>Spiel: {{ match.matchName }}</q-item-label>
              <q-item-label caption>{{ match.date }} - {{ match.time }}</q-item-label>
            </q-item-section>
            <q-badge floating color="teal">{{ match.numberOfParticipants }}</q-badge>
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
            <div class="text-h6">Spiel/Veranstaltung erfassen</div>
          </q-card-section>

          <q-card-section class="q-pt-none">

            <div class="q-pt-md" style="max-width: 350px">
              <q-toggle
                v-model="tglIsEventNew"
                color="red"
                label="Veranstaltung"
                left-label/>
            </div>

            <div class="q-pt-md" style="max-width: 350px">
              <q-select
                filled dense
                v-model="txtHomeTeamNew"
                :options="teamOptions"
                label="Heim *"
                options-selected-class="text-deep-orange"
                v-if="!tglIsEventNew"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section homeTeam>
                      <q-avatar size="50px">
                        <img :src="scope.opt.image">
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-select
                filled dense
                v-model="txtAwayTeamNew"
                :options="teamOptions"
                autofocus
                label="Gast *"
                options-selected-class="text-deep-orange"
                v-if="!tglIsEventNew"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section awayTeam>
                      <q-avatar size="50px">
                        <img :src="scope.opt.image">
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="q-pt-md" style="max-width: 350px">
              <q-input filled dense v-model="txtMatchNameNew" @focus="setFieldsForMatchNameNew(txtHomeTeamNew.value, txtAwayTeamNew.value)" label="Spielname *" v-if="!tglIsEventNew" />
              <q-input filled dense v-model="txtMatchNameNew" label="Veranstaltungsname *" v-if="tglIsEventNew" />
            </div>

            <div class="q-pt-md" style="max-width: 350px">
              <q-toggle
                v-model="tglPublishedNew"
                color="red"
                label="Publizieren"
                left-label/>
            </div>

            <div class="q-pt-md" style="max-width: 350px">
              <q-input
                filled dense
                v-model="txtDatetimeNew">
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

            <div class="q-pt-md" style="max-width: 350px">
              <q-input filled dense v-model="txtAnnotationsNew" type="textarea" label="Kommentar"/>
            </div>

          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addMatchSave(txtHomeTeamNew.value, txtAwayTeamNew.value, txtMatchNameNew, tglIsEventNew, tglPublishedNew, txtDatetimeNew, txtAnnotationsNew)" :disable="((txtHomeTeamNew === '' || txtAwayTeamNew === '' || txtMatchNameNew === '') && !tglIsEventNew) || (txtMatchNameNew === '' && tglIsEventNew)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit match -->
      <q-dialog v-model="editMatch" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Spiel/Veranstaltung ändern</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="q-pt-md" style="max-width: 350px">
              <q-toggle
                v-model="tglIsEvent"
                color="red"
                label="Veranstaltung"
                left-label/>
            </div>

            <div class="q-pt-md" style="max-width: 350px">
              <q-select
                filled dense
                v-model="txtHomeTeam"
                :options="teamOptions"
                autofocus
                label="Heim *"
                options-selected-class="text-deep-orange"
                v-if="!tglIsEvent"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section homeTeam>
                      <q-avatar size="50px">
                        <img :src="scope.opt.image">
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-select
                filled dense
                v-model="txtAwayTeam"
                :options="teamOptions"
                label="Gast *"
                options-selected-class="text-deep-orange"
                v-if="!tglIsEvent"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section awayTeam>
                      <q-avatar size="50px">
                        <img :src="scope.opt.image">
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>

            <div class="q-pt-md" style="max-width: 350px">
              <q-input filled dense v-model="txtMatchName" label="Spielname *" v-if="!tglIsEvent" />
              <q-input filled dense v-model="txtMatchName" label="Veranstaltungsname *" v-if="tglIsEvent" />
            </div>

            <div class="q-pt-md" style="max-width: 350px">
              <q-toggle
                v-model="tglPublished"
                color="red"
                label="Publizieren"
                left-label/>
            </div>

            <div class="q-pt-md" style="max-width: 350px">
              <q-input
                filled dense
                v-model="txtDatetime">
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

            <div class="q-pt-md" style="max-width: 350px">
              <q-input filled dense v-model="txtAnnotations" type="textarea" label="Kommentar"/>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="archive" color="primary" @click="arcMatch = true" v-if="getCookie('isAdministrator') === 'true'" />
            <q-btn icon="delete" color="primary" @click="delMatch = true" v-if="getCookie('isAdministrator') === 'true'" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editMatchSave(intMatchRow, txtMatchId, txtHomeTeam.value, txtAwayTeam.value, txtMatchName, txtMatchNameOld, tglIsEvent, tglPublished, txtDatetime, txtAnnotations)" :disable="((txtHomeTeam ==='' || txtAwayTeam === '' || txtMatchName === '') && !tglIsEvent) || (txtMatchName === '' && tglIsEvent)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Show inactive match -->
      <q-dialog v-model="showInactiveMatch" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Anzahl Teilnehmer: {{ intInactiveNumberOfParticipants }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input filled dense v-model="txtInactiveMatch" label="Spiel" :readonly="true" />

            <div class="q-pt-md">
              <q-input filled dense v-model="txtInactiveDatetime" label="Wann" :readonly="true" />
            </div>
          </q-card-section>

          <div class="q-pa-md q-gutter-sm" style="height: 80px">
            <q-avatar
              v-for="(el, n) in participantInactiveMatchObject"
              :key="n"
              size="40px"
              class="overlapping"
              :style="`left: ${n * 32}px`"
            >
              <img :src="getAvatar(getAdminCode(getCookie('applicationCode')), el.participantAvatar, el.participantAvatarIsCustomized === 'TRUE')" v-if="n <= 9">
            </q-avatar>
          </div>

          <div class="q-pa-md q-gutter-sm" style="height: 80px">
            <q-avatar
              v-for="(el, n) in participantInactiveMatchObject"
              :key="n"
              size="40px"
              class="overlapping"
              :style="`left: ${(n - 10) * 32}px`"
            >
              <img :src="getAvatar(getAdminCode(getCookie('applicationCode')), el.participantAvatar, el.participantAvatarIsCustomized === 'TRUE')" v-if="n > 9 && n <= 19">
            </q-avatar>
          </div>

          <div class="q-pa-md q-gutter-sm" style="height: 80px">
            <q-avatar
              v-for="(el, n) in participantInactiveMatchObject"
              :key="n"
              size="40px"
              class="overlapping"
              :style="`left: ${(n - 20) * 32}px`"
            >
              <img :src="getAvatar(getAdminCode(getCookie('applicationCode')), el.participantAvatar, el.participantAvatarIsCustomized === 'TRUE')" v-if="n > 19 && n <= 29">
            </q-avatar>
          </div>

          <div class="q-pa-md q-gutter-sm" style="height: 80px">
            <q-avatar
              v-for="(el, n) in participantInactiveMatchObject"
              :key="n"
              size="40px"
              class="overlapping"
              :style="`left: ${(n - 30) * 32}px`"
            >
              <img :src="getAvatar(getAdminCode(getCookie('applicationCode')), el.participantAvatar, el.participantAvatarIsCustomized === 'TRUE')" v-if="n > 29">
            </q-avatar>
          </div>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
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

      <!-- Delete match -->
      <q-dialog v-model="delMatch" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="primary" text-color="white" />
            <span class="q-ml-sm">Datensatz löschen?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Nein" color="primary" v-close-popup />
            <q-btn flat label="Ja" color="primary" @click="deleteMatch(intMatchRow, txtMatchId)" v-close-popup />
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
import { getCookie, getAdminCode, getAvatar, getTeamImage, getEventImage, teamImages, URLMatchBasis, URLNextMatchBasis, URLParticipantBasis, URLParticipantArchiveBasis, URLMemberBasis } from 'src/boot/utils.js'
import { ref } from 'vue'

const _constMatchRow = ref(0)
const _constMatchId = ref('')
const _constIsEvent = ref(false)
const _constHomeTeamNew = ref(getCookie('homeTeam'))
const _constHomeTeam = ref('')
const _constAwayTeam = ref('')
const _constMatchName = ref('')
const _constMatchNameOld = ref('')
const _constPublished = ref(false)
const _constDatetime = ref('')
const _constAnnotations = ref('')

const _constInactiveMatch = ref('')
const _constInactiveDatetime = ref('')
const _constInactiveNumberOfParticipants = ref('')

const _constMatchNameNew = ref('')
const _constDatetimeNew = ref('')

let _URLMatch
let _URLNextMatch
let _URLParticipant
let _URLParticipantArchive
let _URLMember

export default {
  name: 'ListMatch',

  setup () {
    const $q = useQuasar()

    return {
      intMatchRow: ref(_constMatchRow),
      txtMatchId: ref(_constMatchId),
      tglIsEvent: ref(_constIsEvent),
      txtHomeTeam: ref(_constHomeTeam),
      txtAwayTeam: ref(_constAwayTeam),
      txtMatchName: ref(_constMatchName),
      txtMatchNameOld: ref(_constMatchNameOld),
      tglPublished: ref(_constPublished),
      txtDatetime: ref(_constDatetime),
      txtAnnotations: ref(_constAnnotations),

      txtInactiveMatch: ref(_constInactiveMatch),
      txtInactiveDatetime: ref(_constInactiveDatetime),
      intInactiveNumberOfParticipants: ref(_constInactiveNumberOfParticipants),

      tglIsEventNew: ref(false),
      txtHomeTeamNew: ref(_constHomeTeamNew),
      txtAwayTeamNew: ref(''),
      txtMatchNameNew: ref(_constMatchNameNew),
      tglPublishedNew: ref(false),
      txtDatetimeNew: ref(_constDatetimeNew),
      txtAnnotationsNew: ref('<STANDARDTEXT>'),

      onMatchCreated () {
        $q.notify({
          type: 'positive',
          message: 'Spiel wurde erfolgreich erfasst!'
        })
      },

      onMatchUpdated () {
        $q.notify({
          type: 'positive',
          message: 'Spiel wurde erfolgreich aktualisiert!'
        })
      },

      onMatchArchived () {
        $q.notify({
          type: 'positive',
          message: 'Spiel wurde erfolgreich archiviert!'
        })
      },

      onMatchDeleted () {
        $q.notify({
          message: 'Spiel wurde erfolgreich gelöscht!',
          color: 'orange'
        })
      },

      onMatchAlreadyExists () {
        $q.notify({
          type: 'negative',
          message: 'Dieses Spiel besteht bereits!'
        })
      },

      addMatch: ref(false),
      editMatch: ref(false),
      arcMatch: ref(false),
      delMatch: ref(false),
      showInactiveMatch: ref(false)
    }
  },

  data () {
    return {
      getCookie,
      getAdminCode,
      getAvatar,
      getTeamImage,
      getEventImage,
      teamImages,
      URLMatchBasis,
      URLNextMatchBasis,
      URLParticipantBasis,
      URLParticipantArchiveBasis,
      URLMemberBasis,

      activeMatchObject: [
        {
          row: '',
          matchId: '',
          homeTeam: '',
          awayTeam: '',
          matchName: '',
          published: '',
          time: '',
          annotations: '',
          date: ''
        }
      ],

      inactiveMatchObject: [
        {
          matchId: '',
          homeTeam: '',
          awayTeam: '',
          matchName: '',
          time: '',
          date: '',
          numberOfParticipants: ''
        }
      ],

      participantInactiveMatchObject: [
        {
          participant: '',
          participantAvatar: '',
          participantAvatarIsCustomized: ''
        }
      ],

      memberObject: [
        {
          member: '',
          avatar: '',
          customized: ''
        }
      ],

      teamOptions: [
        {
          label: '',
          value: '',
          image: '',
          date: '',
          time: ''
        }
      ]

    }
  },

  computed: {
  },

  mounted () {
    this.setVariables()
    this.getTableMember()
    this.getTableActiveMatch()
    this.getTableInactiveMatch()
    this.getTableNextMatch()
  },

  methods: {
    setVariables () {
      _URLMatch = URLMatchBasis + '?sh=' + getAdminCode(getCookie('applicationCode'))
      _URLNextMatch = URLNextMatchBasis + '?sh=' + getCookie('homeTeam')
      _URLParticipant = URLParticipantBasis + '?sh=' + getAdminCode(getCookie('applicationCode'))
      _URLParticipantArchive = URLParticipantArchiveBasis + '?sh=' + getAdminCode(getCookie('applicationCode'))
      _URLMember = URLMemberBasis + '?sh=' + getAdminCode(getCookie('applicationCode'))
    },

    getTableActiveMatch () {
      this.activeMatchObject = []

      const publishedParam = getCookie('isAdministrator') === 'true' ? '' : 'TRUE'
      // console.log('URLMatch: ' + _URLMatch + '&func=ReadActive&published=' + publishedParam)
      this.$axios(`${_URLMatch}&func=ReadActive&published=${publishedParam}`)
        .then((res) => {
          this.tableMatch = res.data.split('\n')
          for (let index = 0; index < this.tableMatch.length - 1; index++) {
            const element = this.tableMatch[index].split(',')
            this.setActiveMatchObject(element[0], element[1], element[3].trim(), element[4].trim(), element[5].trim(), element[6], element[7].substring(0, 5), element[8].trim().replace(/<br>/g, '\n'), element[9])
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setActiveMatchObject (_row, _matchId, _homeTeam, _awayTeam, _matchName, _published, _time, _annotations, _date) {
      this.activeMatchObject.push({ row: parseInt(_row), matchId: _matchId, homeTeam: _homeTeam, awayTeam: _awayTeam, matchName: _matchName, published: _published, time: _time, annotations: _annotations, date: _date })

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

    onInactiveMatchClick (_matchId, _matchName, _datetime, _numberOfParticipants) {
      // console.log('Clicked on an inactive Match: ' + _matchId + ', ' + _matchName + ', ' + _datetime + ', ' + _numberOfParticipants)
      _constInactiveMatch.value = _matchName
      _constInactiveDatetime.value = _datetime
      _constInactiveNumberOfParticipants.value = _numberOfParticipants

      this.participantInactiveMatchObject = []
      // console.log('URLParticipantArchive: ' + _URLParticipantArchive + '&func=ReadMatch&matchId=' + _matchId)
      this.$axios(`${_URLParticipantArchive}&func=ReadMatch&matchId=${_matchId}`)
        .then((res) => {
          this.tableParticipantArchive = res.data.split('\n')
          for (let index = 0; index < this.tableParticipantArchive.length - 1; index++) {
            const element = this.tableParticipantArchive[index].split(',')

            let _participantAvatar = this.memberObject.find(el => el.member === element[4].trim())?.avatar
            if (typeof _participantAvatar === 'undefined') _participantAvatar = ''
            let _participantAvatarIsCustomized = this.memberObject.find(el => el.member === element[4].trim())?.customized
            if (typeof _participantAvatarIsCustomized === 'undefined') _participantAvatarIsCustomized = 'FALSE'

            this.setParticipantInactiveMatchObject(element[4].trim(), _participantAvatar, _participantAvatarIsCustomized)
          }
        })
        .catch((err) => {
          console.log(err)
        })

      this.showInactiveMatch = true
    },

    setParticipantInactiveMatchObject (_participant, _participantAvatar, _participantAvatarIsCustomized) {
      this.participantInactiveMatchObject.push({ participant: _participant, participantAvatar: _participantAvatar, participantAvatarIsCustomized: _participantAvatarIsCustomized })
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

    onMatchClick (_row, _matchId, _homeTeam, _awayTeam, _matchName, _published, _datetime, _annotations) {
      // console.log('Clicked on an Match: ' + _row + ', ' + _matchId + ', ' + _homeTeam + ', ' + _awayTeam + ', ' + _matchName + ', ' + _published + ', ' + _datetime + ', ' + _annotations)
      _constMatchRow.value = _row
      _constMatchId.value = _matchId
      _constIsEvent.value = _homeTeam === '' && _awayTeam === ''
      _constHomeTeam.value = _homeTeam
      _constAwayTeam.value = _awayTeam
      _constMatchName.value = _matchName
      _constMatchNameOld.value = _matchName
      _constPublished.value = _published === 'TRUE'
      _constDatetime.value = _datetime
      _constAnnotations.value = _annotations

      if (getCookie('isAdministrator') === 'true') this.editMatch = true
    },

    setFieldsForMatchNameNew (_homeTeam, _awayTeam) {
      if (typeof _homeTeam === 'undefined') _homeTeam = _constHomeTeamNew.value

      if (typeof _homeTeam !== 'undefined' && typeof _awayTeam !== 'undefined') {
        let _labelHomeTeam = ''
        if (_homeTeam === getCookie('homeTeam')) {
          _labelHomeTeam = getCookie('homeTeamAlias')
        } else {
          _labelHomeTeam = this.teamOptions.find(el => el.value === _homeTeam)?.label
        }
        let _labelAwayTeam = ''
        if (_awayTeam === getCookie('homeTeam')) {
          _labelAwayTeam = getCookie('homeTeamAlias')
        } else {
          _labelAwayTeam = this.teamOptions.find(el => el.value === _awayTeam)?.label
        }
        _constMatchNameNew.value = _labelHomeTeam + ' vs. ' + _labelAwayTeam

        let _date = this.teamOptions.find(el => el.value === _awayTeam)?.date
        let _time = this.teamOptions.find(el => el.value === _awayTeam)?.time

        if (typeof _date === 'undefined' && typeof _time === 'undefined') {
          _date = this.teamOptions.find(el => el.value === _homeTeam)?.date
          _time = this.teamOptions.find(el => el.value === _homeTeam)?.time
        }
        _constDatetimeNew.value = _date + ' ' + _time
      }
    },

    addMatchSave (_homeTeam, _awayTeam, _matchName, _isEvent, _published, _datetime, _annotations) {
      // console.log('addMatchSave: ' + _homeTeam + ', ' + _awayTeam + ', ' + _matchName + ', ' + _isEvent + ', ' + _published + ', ' + _datetime + ', ' + _annotations)

      if (_isEvent) {
        _homeTeam = ''
        _awayTeam = ''
      } else {
        if (typeof _homeTeam === 'undefined') _homeTeam = _constHomeTeamNew.value
      }

      const _matches = this.activeMatchObject.map(el => el.matchName)
      const _matchExists = _matches.includes(_matchName)
      if (_matchExists) {
        this.onMatchAlreadyExists()
      } else {
        const _date = _datetime.substring(0, 10)
        const _time = _datetime.substring(11, 16)

        this.$axios(`${_URLMatch}&func=Add&homeTeam=${_homeTeam}&awayTeam=${_awayTeam}&matchName=${encodeURI(_matchName.replace(',', ' '))}&published=${_published}&time=${_time}&annotations=${encodeURI(_annotations.replace(',', ';').replace(/(?:\r\n|\r|\n)/g, '<br>'))}&date=${_date}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.onMatchCreated()
              this.getTableActiveMatch()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    editMatchSave (_row, _matchId, _homeTeam, _awayTeam, _matchName, _matchNameOld, _isEvent, _published, _datetime, _annotations) {
      // console.log('editMatchSave - Update: ' + _row + ', ' + _matchId + ', ' + _homeTeam + ', ' + _awayTeam + ', ' + _matchName + ', ' + _matchNameOld + ', ' + _isEvent + ', ' + _published + ', ' + _datetime + ', ' + _annotations)

      if (_isEvent) {
        _homeTeam = ''
        _awayTeam = ''
      } else {
        if (typeof _homeTeam === 'undefined') _homeTeam = _constHomeTeam.value
        if (typeof _awayTeam === 'undefined') _awayTeam = _constAwayTeam.value
      }

      const _matches = this.activeMatchObject.map(el => el.matchName)
      const _matchExists = _matches.includes(_matchName) && _matchName !== _matchNameOld
      if (_matchExists) {
        this.onMatchAlreadyExists()
      } else {
        const _date = _datetime.substring(0, 10)
        const _time = _datetime.substring(11, 16)
        const _newMatchName = _matchName.trim() + ' ' + _date.substring(0, 6) + _date.substring(8, 10) + ' - ' + _time

        this.$axios(`${_URLMatch}&func=Update&row=${_row}&matchId=${_matchId}&homeTeam=${_homeTeam}&awayTeam=${_awayTeam}&matchName=${encodeURI(_matchName.replace(',', ' '))}&published=${_published}&time=${_time}&annotations=${encodeURI(_annotations.replace(',', ';').replace(/(?:\r\n|\r|\n)/g, '<br>'))}&date=${_date}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              // console.log('editMatchSave - UpdateMatch: ' + _matchId + ', ' + _newMatchName)
              this.$axios(`${_URLParticipant}&func=UpdateMatch&matchId=${_matchId}&newMatchName=${_newMatchName}`)
                .then((res2) => {
                  if (res2.data === 'Success, requested action completed') {
                    this.onMatchUpdated()
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

      this.$axios(`${_URLParticipant}&func=Read&matchId=${_matchId}`)
        .then(async (res) => {
          this.tableParticipant = res.data.split('\n')
          for (let index = 0; index < this.tableParticipant.length - 1; index++) {
            const element = this.tableParticipant[index].split(',')
            await sleep(1000)
            this.$axios(`${_URLParticipantArchive}&func=Add&timestamp=${element[3]}&matchId=${element[2]}&matchName=${element[4]}&participant=${element[5]}&arrival=${element[6]}&annotations=${element[7]}&action=${element[8]}&reaction=${element[9]}&date=${_date}`)
              .catch((err) => {
                console.log(err)
              })
          }
        })
        .catch((err) => {
          console.log(err)
        })

      this.inactivateDeleteMatch(_row, _matchId, true)
    },

    inactivateDeleteMatch (_row, _matchId, _inactivate) {
      this.$axios(`${_URLParticipant}&func=DeleteMatch&matchId=${_matchId}`)
        .then((res3) => {
          if (res3.data === 'Success, requested action completed') {
            if (_inactivate) {
            // console.log(_URLMatch + '&func=Inactivate&row=' + _row + '&matchId=' + _matchId)
              this.$axios(`${_URLMatch}&func=Inactivate&row=${_row}&matchId=${_matchId}`)
                .then((res4) => {
                  if (res4.data === 'Success, requested action completed') {
                    this.onMatchArchived()
                    this.getTableActiveMatch()
                    this.editMatch = false
                  }
                })
                .catch((err) => {
                  console.log(err)
                })
            } else {
            // console.log(_URLMatch + '&func=Delete&row=' + _row + '&matchId=' + _matchId)
              this.$axios(`${_URLMatch}&func=Delete&row=${_row}&matchId=${_matchId}`)
                .then((res5) => {
                  if (res5.data === 'Success, requested action completed') {
                    this.onMatchDeleted()
                    this.getTableActiveMatch()
                    this.editMatch = false
                  }
                })
                .catch((err) => {
                  console.log(err)
                })
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    async deleteMatch (_row, _matchId) {
      // console.log('deleteMatch: ' + _row + ', ' + _matchId + ', ' + _datetime)

      this.inactivateDeleteMatch(_row, _matchId, false)
    },

    getTableInactiveMatch () {
      this.inactiveMatchObject = []

      // console.log('URLMatch: ' + _URLMatch + '&func=ReadInactive')
      this.$axios(`${_URLMatch}&func=ReadInactive`)
        .then((res) => {
          this.tableInactiveMatch = res.data.split('\n')
          for (let index = 0; index < this.tableInactiveMatch.length - 1; index++) {
            const element = this.tableInactiveMatch[index].split(',')

            let _numberOfParticipants = 0
            // console.log('URLParticipantArchive: ' + _URLParticipantArchive + '&func=ReadMatch')
            this.$axios(`${_URLParticipantArchive}&func=ReadMatch&matchId=${element[1]}`)
              .then((res2) => {
                this.tableParticipantArchive = res2.data.split('\n')
                _numberOfParticipants = this.tableParticipantArchive.length - 1
                this.setInactiveMatchObject(element[1], element[3].trim(), element[4].trim(), element[5].trim(), element[7].substring(0, 5), element[9], _numberOfParticipants)
              })
              .catch((err2) => {
                console.log(err2)
              })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setInactiveMatchObject (_matchId, _homeTeam, _awayTeam, _matchName, _time, _date, _numberOfParticipants) {
      this.inactiveMatchObject.push({ matchId: _matchId, homeTeam: _homeTeam, awayTeam: _awayTeam, matchName: _matchName, time: _time, date: _date, numberOfParticipants: _numberOfParticipants })

      // Sort array of objects
      this.inactiveMatchObject.sort(function (a, b) {
        let dateA = a.date
        dateA = dateA.substring(6, 10) + dateA.substring(3, 5) + dateA.substring(0, 2)

        let dateB = b.date
        dateB = dateB.substring(6, 10) + dateB.substring(3, 5) + dateB.substring(0, 2)

        if (dateA < dateB) return 1
        if (dateA > dateB) return -1
        return 0
      })
    },

    getTableNextMatch () {
      this.teamOptions = []

      let _label = this.teamImages.find(el => el.value === getCookie('homeTeam'))?.label
      let _image = this.teamImages.find(el => el.value === getCookie('homeTeam'))?.image
      this.setTeamOptionsObject(_label, getCookie('homeTeam'), _image)

      // console.log('URLNextMatch: ' + _URLNextMatch + '&func=Read')
      this.$axios(`${_URLNextMatch}&func=Read`)
        .then((res) => {
          this.tableNextMatch = res.data.split('\n')
          for (let index = 0; index < this.tableNextMatch.length - 1; index++) {
            const element = this.tableNextMatch[index].split(',')

            _label = this.teamImages.find(el => el.value === element[1].trim())?.label
            _image = this.teamImages.find(el => el.value === element[1].trim())?.image
            this.setTeamOptionsObject(_label, element[1].trim(), _image, element[2], element[3])
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setTeamOptionsObject (_label, _value, _image, _date, _time) {
      this.teamOptions.push({ label: _label, value: _value, image: _image, date: _date, time: _time })
    }

  }
}
</script>

<style lang="scss">
.overlapping {
  border: 2px solid white;
  position: absolute
}

.header-image {
  height: 100%;
  z-index: -1;
  opacity: 0.2;
  filter: grayscale(100%);
}
</style>
