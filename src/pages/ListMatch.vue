  <template>
  <q-page>

    <!-- Active matchs area (Titel) -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title class="text-overline">Aktuelle Spiele ({{ activeMatchObject.length }})</q-toolbar-title>
        <q-btn class="bg-white text-primary" icon="add" label="Neu" @click="addMatch = true" v-if="getCookie('isAdministrator')" />
      </q-toolbar>
    </div>

    <!-- List of active matches -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="(match, i) in activeMatchObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onMatchClick(match.matchId, match.homeTeam, match.awayTeam, match.matchName, match.published, match.matchDate, match.doorOpeningTime, match.annotations, match.season)">
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
              <q-item-label caption>Wann: {{ match.matchDate }}</q-item-label>
              <q-item-label caption v-if="match.published === true">Publiziert: Ja</q-item-label>
              <q-item-label caption v-if="match.published === false">Publiziert: Nein</q-item-label>
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
              <q-item-label caption>{{ match.date }}</q-item-label>
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
                :options="teamImages"
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
                :options="teamImages"
                autofocus
                @blur="setValueForMatchNameNew(txtHomeTeamNew.value, txtAwayTeamNew.value)"
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
              <q-input filled dense v-model="txtMatchNameNew" label="Spielname *" v-if="!tglIsEventNew" />
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
                v-model="txtMatchDateNew" label="Spieldatum">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="txtMatchDateNew" mask="DD.MM.YYYY - HH:mm">
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
                      <q-time v-model="txtMatchDateNew" mask="DD.MM.YYYY - HH:mm" format24h>
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
              <q-input
                filled dense
                v-model="txtDoorOpeningTimeNew" @focus="setValueForDoorOpeningTimeNew(txtMatchDateNew.substring(13, 18))" label="Türöffnungszeit">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="txtDoorOpeningTimeNew" mask="HH:mm" format24h>
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

            <div class="q-pt-md" style="max-width: 350px">
              <q-input filled dense v-model="txtSeasonNew" label="Saison" :disable="true" />
            </div>

          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addMatchSave(txtHomeTeamNew.value, txtAwayTeamNew.value, txtMatchNameNew, tglIsEventNew, tglPublishedNew, txtMatchDateNew, txtDoorOpeningTimeNew, txtAnnotationsNew, txtSeasonNew)" :disable="((txtHomeTeamNew === '' || txtAwayTeamNew === '' || txtMatchNameNew === '') && !tglIsEventNew) || (txtMatchNameNew === '' && tglIsEventNew)" v-close-popup />
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
                :options="teamImages"
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
                :options="teamImages"
                autofocus
                @blur="setValueForMatchName(txtHomeTeam.value, txtAwayTeam.value)"
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
                v-model="txtMatchDate" label="Spieldatum">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="txtMatchDate" mask="DD.MM.YYYY - HH:mm">
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
                      <q-time v-model="txtMatchDate" mask="DD.MM.YYYY - HH:mm" format24h>
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
              <q-input
                filled dense
                v-model="txtDoorOpeningTime" @focus="setValueForDoorOpeningTime(txtMatchDate.substring(13, 18))" label="Türöffnungszeit">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="txtDoorOpeningTime" mask="HH:mm" format24h>
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

            <div class="q-pt-md" style="max-width: 350px">
              <q-input filled dense v-model="txtSeason" label="Saison" :disable="true" />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="archive" color="primary" @click="arcMatch = true" v-if="getCookie('isAdministrator')" />
            <q-btn icon="delete" color="primary" @click="delMatch = true" v-if="getCookie('isAdministrator')" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editMatchSave(txtMatchId, txtHomeTeam.value, txtAwayTeam.value, txtMatchName, txtMatchNameOld, tglIsEvent, tglPublished, txtMatchDate, txtDoorOpeningTime, txtAnnotations, txtSeason)" :disable="((txtHomeTeam ==='' || txtAwayTeam === '' || txtMatchName === '') && !tglIsEvent) || (txtMatchName === '' && tglIsEvent)" v-close-popup />
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
              <img :src="getAvatar(getAdminCode(getCookie('applicationCode')), el.participantAvatar, el.participantAvatarIsCustomized === true)" v-if="n <= 9">
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
              <img :src="getAvatar(getAdminCode(getCookie('applicationCode')), el.participantAvatar, el.participantAvatarIsCustomized === true)" v-if="n > 9 && n <= 19">
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
              <img :src="getAvatar(getAdminCode(getCookie('applicationCode')), el.participantAvatar, el.participantAvatarIsCustomized === true)" v-if="n > 19 && n <= 29">
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
              <img :src="getAvatar(getAdminCode(getCookie('applicationCode')), el.participantAvatar, el.participantAvatarIsCustomized === true)" v-if="n > 29 && n <= 39">
            </q-avatar>
          </div>

          <div class="q-pa-md q-gutter-sm" style="height: 80px">
            <q-avatar
              v-for="(el, n) in participantInactiveMatchObject"
              :key="n"
              size="40px"
              class="overlapping"
              :style="`left: ${(n - 40) * 32}px`"
            >
              <img :src="getAvatar(getAdminCode(getCookie('applicationCode')), el.participantAvatar, el.participantAvatarIsCustomized === true)" v-if="n > 39">
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
            <q-btn flat label="Ja" color="primary" @click="archiveMatch(txtMatchId)" v-close-popup />
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
            <q-btn flat label="Ja" color="primary" @click="deleteMatch(txtMatchId)" v-close-popup />
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
import { getCookie, getAdminCode, getAvatar, getTeamImage, getEventImage, teamImages, URLMatchManagementAPI } from 'src/boot/utils.js'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const _constMatchId = ref('')
const _constIsEvent = ref(false)
const _constHomeTeamNew = ref(getCookie('homeTeam'))
const _constHomeTeam = ref('')
const _constAwayTeam = ref('')
const _constMatchName = ref('')
const _constMatchNameOld = ref('')
const _constPublished = ref(false)
const _constMatchDate = ref('')
const _constDoorOpeningTime = ref('')
const _constAnnotations = ref('')
const _constSeason = ref('')

const _constInactiveMatch = ref('')
const _constInactiveDatetime = ref('')
const _constInactiveNumberOfParticipants = ref('')

const _constMatchNameNew = ref('')
const _constDoorOpeningTimeNew = ref('')
const _constSeasonNew = ref('')

const _constAdminCode = ref('')

let _TenantId
let _URLTenant
let _URLMatch
let _URLParticipant
let _URLMember

export default {
  name: 'ListMatch',

  setup () {
    const $q = useQuasar()

    return {
      txtMatchId: ref(_constMatchId),
      tglIsEvent: ref(_constIsEvent),
      txtHomeTeam: ref(_constHomeTeam),
      txtAwayTeam: ref(_constAwayTeam),
      txtMatchName: ref(_constMatchName),
      txtMatchNameOld: ref(_constMatchNameOld),
      tglPublished: ref(_constPublished),
      txtMatchDate: ref(_constMatchDate),
      txtDoorOpeningTime: ref(_constDoorOpeningTime),
      txtAnnotations: ref(_constAnnotations),
      txtSeason: ref(_constSeason),

      txtInactiveMatch: ref(_constInactiveMatch),
      txtInactiveDatetime: ref(_constInactiveDatetime),
      intInactiveNumberOfParticipants: ref(_constInactiveNumberOfParticipants),

      tglIsEventNew: ref(false),
      txtHomeTeamNew: ref(_constHomeTeamNew),
      txtAwayTeamNew: ref(''),
      txtMatchNameNew: ref(_constMatchNameNew),
      tglPublishedNew: ref(false),
      txtMatchDateNew: ref(''),
      txtDoorOpeningTimeNew: ref(_constDoorOpeningTimeNew),
      txtAnnotationsNew: ref('<STANDARDTEXT>'),
      txtSeasonNew: ref(_constSeasonNew),

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
      URLMatchManagementAPI,

      activeMatchObject: [
        {
          matchId: '',
          homeTeam: '',
          awayTeam: '',
          matchName: '',
          published: '',
          matchDate: '',
          doorOpeningTime: '',
          annotations: '',
          season: ''
        }
      ],

      inactiveMatchObject: [
        {
          matchId: '',
          homeTeam: '',
          awayTeam: '',
          matchName: '',
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
      ]

    }
  },

  computed: {
  },

  mounted () {
    this.setVariables().then(() => {
      this.getTenantId().then(() => {
        this.getTableMember().then(() => {
          this.getTableActiveMatch()
          this.getTableInactiveMatch()
        })
      })
    })
  },

  methods: {
    setVariables () {
      _constAdminCode.value = getAdminCode(getCookie('applicationCode'))
      _URLTenant = URLMatchManagementAPI + '/Tenant'
      _URLMatch = URLMatchManagementAPI + '/Match'
      _URLParticipant = URLMatchManagementAPI + '/Participant'
      _URLMember = URLMatchManagementAPI + '/Member'

      this.activeMatchObject = []
      this.inactiveMatchObject = []

      return Promise.resolve()
    },

    getTenantId () {
      return new Promise((resolve, reject) => {
        this.$axios.get(`${_URLTenant}/code/${_constAdminCode.value}`)
          .then((res) => {
            if (res.status === 200) {
              _TenantId = res.data.id
              _constSeasonNew.value = res.data.season
              resolve()
            } else {
              console.log('Unexpected status code:', res.status)
              reject(new Error('Unexpected status code'))
            }
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      })
    },

    getTableActiveMatch () {
      this.activeMatchObject = []

      const publishedParam = getCookie('isAdministrator')
      this.$axios.get(`${_URLMatch}/${_TenantId}/${_constSeasonNew.value}/active/${publishedParam}`)
        .then((res) => {
          if (res.status === 200) {
            for (let index = 0; index < res.data.length; index++) {
              this.setActiveMatchObject(res.data[index].id, res.data[index].homeTeam, res.data[index].awayTeam, res.data[index].name, res.data[index].isPublished, res.data[index].date, res.data[index].doorOpeningTime, res.data[index].annotations, res.data[index].season)
            }
          } else {
            console.log('Unexpected status code:', res.status)
          }
        })
        .catch((err) => console.log(err))
    },

    setActiveMatchObject (_matchId, _homeTeam, _awayTeam, _matchName, _published, _matchDate, _doorOpeningTime, _annotations, _season) {
      this.activeMatchObject.push({ matchId: _matchId, homeTeam: _homeTeam, awayTeam: _awayTeam, matchName: _matchName, published: _published, matchDate: _matchDate, doorOpeningTime: _doorOpeningTime, annotations: _annotations, season: _season })

      // Sort array of objects
      this.activeMatchObject.sort(function (a, b) {
        let dateA = a.matchDate
        dateA = dateA.substring(6, 10) + dateA.substring(3, 5) + dateA.substring(0, 2)

        let dateB = b.matchDate
        dateB = dateB.substring(6, 10) + dateB.substring(3, 5) + dateB.substring(0, 2)

        if (dateA > dateB) return 1
        if (dateA < dateB) return -1
        return 0
      })
    },

    onInactiveMatchClick (_matchId, _matchName, _datetime, _numberOfParticipants) {
      _constInactiveMatch.value = _matchName
      _constInactiveDatetime.value = _datetime
      _constInactiveNumberOfParticipants.value = _numberOfParticipants

      this.participantInactiveMatchObject = []
      this.$axios.get(`${_URLParticipant}/${_TenantId}/${_matchId}`)
        .then((res) => {
          if (res.status === 200) {
            for (let index = 0; index < res.data.length; index++) {
              let _participantAvatar = this.memberObject.find(el => el.member === res.data[index].name)?.avatar
              if (typeof _participantAvatar === 'undefined') {
                _participantAvatar = ''
              }

              let _participantAvatarIsCustomized = this.memberObject.find(el => el.member === res.data[index].name)?.customized
              if (typeof _participantAvatarIsCustomized === 'undefined') {
                _participantAvatarIsCustomized = false
              }

              this.setParticipantInactiveMatchObject(res.data[index].name, _participantAvatar, _participantAvatarIsCustomized)
            }
          } else {
            console.log('Unexpected status code:', res.status)
          }
        })
        .catch((err) => console.log(err))

      this.showInactiveMatch = true
    },

    setParticipantInactiveMatchObject (_participant, _participantAvatar, _participantAvatarIsCustomized) {
      this.participantInactiveMatchObject.push({ participant: _participant, participantAvatar: _participantAvatar, participantAvatarIsCustomized: _participantAvatarIsCustomized })
    },

    getTableMember () {
      return new Promise((resolve, reject) => {
        this.memberObject = []

        this.$axios.get(`${_URLMember}/${_TenantId}`)
          .then((res) => {
            if (res.status === 200) {
              for (let index = 0; index < res.data.length; index++) {
                this.setMemberObject(res.data[index].name, res.data[index].avatar, res.data[index].isCustomized)
              }
              resolve()
            } else {
              console.log('Unexpected status code:', res.status)
              reject(new Error('Unexpected status code'))
            }
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      })
    },

    setMemberObject (_member, _avatar, _customized) {
      this.memberObject.push({ member: _member, avatar: _avatar, customized: _customized })
    },

    onMatchClick (_matchId, _homeTeam, _awayTeam, _matchName, _published, _matchDate, _doorOpeningTime, _annotations, _season) {
      _constMatchId.value = _matchId
      _constIsEvent.value = _homeTeam === '' && _awayTeam === ''
      _constHomeTeam.value = _homeTeam
      _constAwayTeam.value = _awayTeam
      _constMatchName.value = _matchName
      _constMatchNameOld.value = _matchName
      _constPublished.value = _published === true
      _constMatchDate.value = _matchDate
      _constDoorOpeningTime.value = _doorOpeningTime
      _constAnnotations.value = _annotations
      _constSeason.value = _season

      if (getCookie('isAdministrator')) this.editMatch = true
    },

    setValueForMatchNameNew (_homeTeam, _awayTeam) {
      if (typeof _homeTeam === 'undefined') _homeTeam = _constHomeTeamNew.value

      if (typeof _homeTeam !== 'undefined' && typeof _awayTeam !== 'undefined') {
        let _labelHomeTeam = ''
        if (_homeTeam === getCookie('homeTeam')) {
          _labelHomeTeam = getCookie('homeTeamAlias')
        } else {
          _labelHomeTeam = this.teamImages.find(el => el.value === _homeTeam)?.label
        }
        let _labelAwayTeam = ''
        if (_awayTeam === getCookie('homeTeam')) {
          _labelAwayTeam = getCookie('homeTeamAlias')
        } else {
          _labelAwayTeam = this.teamImages.find(el => el.value === _awayTeam)?.label
        }
        _constMatchNameNew.value = _labelHomeTeam + ' vs. ' + _labelAwayTeam
      }
    },

    setValueForMatchName (_homeTeam, _awayTeam) {
      if (typeof _homeTeam === 'undefined') _homeTeam = _constHomeTeam.value

      if (typeof _homeTeam !== 'undefined' && typeof _awayTeam !== 'undefined') {
        let _labelHomeTeam = ''
        if (_homeTeam === getCookie('homeTeam')) {
          _labelHomeTeam = getCookie('homeTeamAlias')
        } else {
          _labelHomeTeam = this.teamImages.find(el => el.value === _homeTeam)?.label
        }
        let _labelAwayTeam = ''
        if (_awayTeam === getCookie('homeTeam')) {
          _labelAwayTeam = getCookie('homeTeamAlias')
        } else {
          _labelAwayTeam = this.teamImages.find(el => el.value === _awayTeam)?.label
        }
        _constMatchName.value = _labelHomeTeam + ' vs. ' + _labelAwayTeam
      }
    },

    setValueForDoorOpeningTimeNew (_matchTime) {
      if (parseInt(_matchTime.substring(0, 2)) >= 2) {
        _constDoorOpeningTimeNew.value = (parseInt(_matchTime.substring(0, 2)) - 2).toString() + _matchTime.substring(2, 5)
      }
    },

    setValueForDoorOpeningTime (_matchTime) {
      if (parseInt(_matchTime.substring(0, 2)) >= 2) {
        _constDoorOpeningTime.value = (parseInt(_matchTime.substring(0, 2)) - 2).toString() + _matchTime.substring(2, 5)
      }
    },

    addMatchSave (_homeTeam, _awayTeam, _matchName, _isEvent, _published, _matchDate, _doorOpeningTime, _annotations, _season) {
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
        const _constNewGuid = uuidv4()
        const _constCreationTime = new Date()

        const newMatch = {
          id: _constNewGuid,
          creationTime: _constCreationTime,
          lastModificationTime: null,
          tenantId: _TenantId,
          homeTeam: _homeTeam,
          awayTeam: _awayTeam,
          name: _matchName,
          isPublished: _published,
          date: _matchDate,
          doorOpeningTime: _doorOpeningTime,
          annotations: _annotations,
          isDeactivated: false,
          season: _season
        }

        this.$axios.post(`${_URLMatch}/${_TenantId}`, newMatch)
          .then((res) => {
            if (res.status === 201) {
              this.onMatchCreated()
              this.getTableActiveMatch()
            } else {
              console.log('Unexpected status code:', res.status)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    editMatchSave (_matchId, _homeTeam, _awayTeam, _matchName, _matchNameOld, _isEvent, _published, _matchDate, _doorOpeningTime, _annotations, _season) {
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
        const updMatch = {
          id: _matchId,
          creationTime: null,
          lastModificationTime: null,
          tenantId: _TenantId,
          homeTeam: _homeTeam,
          awayTeam: _awayTeam,
          name: _matchName,
          isPublished: _published,
          date: _matchDate,
          doorOpeningTime: _doorOpeningTime,
          annotations: _annotations,
          isDeactivated: false,
          season: _season
        }

        this.$axios.put(`${_URLMatch}/${_TenantId}/${_matchId}`, updMatch)
          .then((res) => {
            if (res.status === 200) {
              this.onMatchUpdated()
              this.getTableActiveMatch()
            } else {
              console.log('Unexpected status code:', res.status)
            }
          })
          .catch((err) => console.log(err))
      }
    },

    archiveMatch (_matchId) {
      this.inactivateDeleteMatch(_matchId, true)
    },

    inactivateDeleteMatch (_matchId, _inactivate) {
      if (_inactivate) {
        this.$axios.patch(`${_URLMatch}/${_TenantId}/${_matchId}`)
          .then((res) => {
            if (res.status === 200) {
              this.onMatchArchived()
              this.getTableActiveMatch()
              this.editMatch = false
            } else {
              console.log('Unexpected status code:', res.status)
            }
          })
          .catch((err) => console.log(err))
      } else {
        this.$axios.delete(`${_URLMatch}/${_TenantId}/${_matchId}`)
          .then((res) => {
            if (res.status === 200) {
              this.onMatchDeleted()
              this.getTableActiveMatch()
              this.editMatch = false
            } else {
              console.log('Unexpected status code:', res.status)
            }
          })
          .catch((err) => console.log(err))
      }
    },

    deleteMatch (_matchId) {
      this.inactivateDeleteMatch(_matchId, false)
    },

    getTableInactiveMatch () {
      this.inactiveMatchObject = []

      this.$axios.get(`${_URLMatch}/${_TenantId}/inactive`)
        .then((res) => {
          if (res.status === 200) {
            for (let index = 0; index < res.data.length; index++) {
              let _numberOfParticipants = 0
              this.$axios.get(`${_URLParticipant}/${_TenantId}/${res.data[index].matchId}`)
                .then((res2) => {
                  if (res2.status === 200) {
                    _numberOfParticipants = res2.data.length
                    this.setInactiveMatchObject(res.data[index].matchId, res.data[index].homeTeam, res.data[index].awayTeam, res.data[index].name, res.data[index].doorOpeningTime.substring(0, 5), res.data[index].date, _numberOfParticipants)
                  } else {
                    console.log('Unexpected status code:', res.status)
                  }
                })
                .catch((err) => console.log(err))
            }
          } else {
            console.log('Unexpected status code:', res.status)
          }
        })
        .catch((err) => console.log(err))
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
