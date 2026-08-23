  <template>
  <q-page>

    <!-- Active matchs area (Titel) -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title class="text-overline">Aktuelle Spiele ({{ activeMatchObject.length }})</q-toolbar-title>
        <q-btn class="bg-white text-primary" icon="add" label="Neu" @click="addMatch = true" v-if="getCookie('isAdministrator')" />
      </q-toolbar>
    </div>

    <q-toggle
      v-if="getCookie('isAdministrator')"
      v-model="showPublishedOnly"
      color="red"
      label="Nur publizierte"
      @update:model-value="getTableActiveMatch"
    />

    <!-- List of active matches -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="(match, i) in activeMatchObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onMatchClick(match.matchId, match.homeTeam, match.awayTeam, match.matchName, match.isPublished, match.publishOnTime, match.matchDate, match.doorOpeningTime, match.annotations, match.season)">
            <q-avatar size="50px" v-if="match.homeTeam !== '' && match.awayTeam !== ''">
              <img :src="getTeamImage(match.homeTeam, teamImages)">
            </q-avatar>
            <q-item-label v-if="match.homeTeam !== '' && match.awayTeam !== ''">&ThickSpace;</q-item-label>
            <q-avatar size="50px" v-if="match.homeTeam !== '' && match.awayTeam !== ''">
              <img :src="getTeamImage(match.awayTeam, teamImages)">
            </q-avatar>

            <q-avatar size="50px" v-if="match.homeTeam === '' && match.awayTeam === ''">
              <img :src="getEventImage(match.matchName)">
            </q-avatar>

            <q-item-label>&ThickSpace;&ThickSpace;&ThickSpace;</q-item-label>

            <q-item-section>
              <q-item-label overline>{{ match.homeTeam === '' && match.awayTeam === '' ? 'Veranstaltung' : 'Spiel' }}: {{ match.matchName }}</q-item-label>
              <q-item-label caption>Wann: {{ match.matchDate }}</q-item-label>
              <q-item-label caption>Türöffnungszeit: {{ match.doorOpeningTime }}</q-item-label>
              <q-item-label caption>Publiziert: {{ match.isPublished ? 'Ja' : 'Nein' }}</q-item-label>
              <q-item-label v-if="!match.isPublished" caption>Veröffentlichen am: {{ match.publishOnTime }}</q-item-label>
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

    <div class="q-pa-md q-gutter-y-md column items-start">
      <q-btn-group push>
        <q-btn color="primary" glossy text-color="white" push label="2026-27" @click="getTableInactiveMatch('2026-27')"/>
        <q-btn color="deep-orange" glossy text-color="white" push label="2025-26" @click="getTableInactiveMatch('2025-26')"/>
        <q-btn color="amber" glossy text-color="white" push label="2024-25" @click="getTableInactiveMatch('2024-25')"/>
        <q-btn color="green-10" glossy text-color="white" push label="2023-24" @click="getTableInactiveMatch('2023-24')"/>
        <q-btn color="indigo" glossy text-color="white" push label="2022-23" @click="getTableInactiveMatch('2022-23')"/>
      </q-btn-group>
    </div>

    <!-- List of inactive matches -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="(match, i) in inactiveMatchObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onInactiveMatchClick(match.matchId, match.matchName, match.matchDate + ' ' + match.time, match.numberOfParticipants)">
            <q-avatar size="50px" v-if="match.homeTeam !== '' && match.awayTeam !== ''">
              <img :src="getTeamImage(match.homeTeam, teamImages)">
            </q-avatar>
            <q-item-label v-if="match.homeTeam !== '' && match.awayTeam !== ''">&ThickSpace;</q-item-label>
            <q-avatar size="50px" v-if="match.homeTeam !== '' && match.awayTeam !== ''">
              <img :src="getTeamImage(match.awayTeam, teamImages)">
            </q-avatar>

            <q-avatar size="50px" v-if="match.homeTeam === '' && match.awayTeam === ''">
              <img :src="getEventImage(match.matchName)">
            </q-avatar>

            <q-item-label>&ThickSpace;&ThickSpace;&ThickSpace;</q-item-label>

            <q-item-section>
              <q-item-label overline>{{ match.homeTeam === '' && match.awayTeam === '' ? 'Veranstaltung' : 'Spiel' }}: {{ match.matchName }}</q-item-label>
              <q-item-label caption>{{ match.matchDate }}</q-item-label>
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
                left-label />
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
                v-model="tglIsPublishedNew"
                color="red"
                label="Publizieren"
                left-label />
            </div>

            <div class="q-pt-md" style="max-width: 350px" v-if="!tglIsPublishedNew">
              <q-input
                filled dense
                v-model="txtPublishOnTimeNew" label="Veröffentlichen am">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="txtPublishOnTimeNew" mask="DD.MM.YYYY - HH:mm">
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
                      <q-time v-model="txtPublishOnTimeNew" mask="DD.MM.YYYY - HH:mm" format24h>
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
                v-model="txtDoorOpeningTimeNew" label="Türöffnungszeit">
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
            <q-btn icon="save" label="Speichern" @click="addMatchSave(txtHomeTeamNew.value, txtAwayTeamNew.value, txtMatchNameNew, tglIsEventNew, tglIsPublishedNew, txtPublishOnTimeNew, txtMatchDateNew, txtDoorOpeningTimeNew, txtAnnotationsNew, txtSeasonNew)" :disable="((txtHomeTeamNew === '' || txtAwayTeamNew === '' || txtMatchNameNew === '') && !tglIsEventNew) || (txtMatchNameNew === '' && tglIsEventNew)" v-close-popup />
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
                v-model="tglIsPublished"
                color="red"
                label="Publizieren"
                left-label/>
            </div>

            <div class="q-pt-md" style="max-width: 350px" v-if="!tglIsPublished && isFutureMatch(txtMatchDate)">
              <q-input
                filled dense
                v-model="txtPublishOnTime" label="Veröffentlichen am">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="txtPublishOnTime" mask="DD.MM.YYYY - HH:mm">
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
                      <q-time v-model="txtPublishOnTime" mask="DD.MM.YYYY - HH:mm" format24h>
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
                v-model="txtDoorOpeningTime" label="Türöffnungszeit">
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
            <q-btn icon="save" label="Speichern" @click="editMatchSave(txtMatchId, txtHomeTeam.value, txtAwayTeam.value, txtMatchName, txtMatchNameOld, tglIsEvent, tglIsPublished, txtPublishOnTime, txtMatchDate, txtDoorOpeningTime, txtAnnotations, txtSeason)" :disable="((txtHomeTeam ==='' || txtAwayTeam === '' || txtMatchName === '') && !tglIsEvent) || (txtMatchName === '' && tglIsEvent)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Show inactive match -->
      <q-dialog v-model="showInactiveMatch" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Anzahl der Teilnehmer: {{ intInactiveNumberOfParticipants }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="q-pt-md" style="max-width: 350px">
              <q-input filled dense v-model="txtInactiveMatch" label="Spiel" :readonly="true" />
            </div>

            <div class="q-pt-md" style="max-width: 350px">
              <q-input filled dense v-model="txtInactiveDatetime" label="Wann" :readonly="true" />
            </div>

            <div class="q-pa-md q-gutter-sm" style="max-width: 350px; height: 80px">
              <q-avatar
                v-for="(el, n) in participantInactiveMatchObject"
                :key="n"
                size="40px"
                class="overlapping"
                :style="`left: ${n * 32}px`"
                >
                <img :src="getAvatar(el.participantAvatar)" v-if="n <= 9">
              </q-avatar>
            </div>

            <div class="q-pa-md q-gutter-sm" style="max-width: 350px; height: 80px">
              <q-avatar
                v-for="(el, n) in participantInactiveMatchObject"
                :key="n"
                size="40px"
                class="overlapping"
                :style="`left: ${(n - 10) * 32}px`"
                >
                <img :src="getAvatar(el.participantAvatar)" v-if="n > 9 && n <= 19">
              </q-avatar>
            </div>

            <div class="q-pa-md q-gutter-sm" style="max-width: 350px; height: 80px">
              <q-avatar
                v-for="(el, n) in participantInactiveMatchObject"
                :key="n"
                size="40px"
                class="overlapping"
                :style="`left: ${(n - 20) * 32}px`"
                >
                <img :src="getAvatar(el.participantAvatar)" v-if="n > 19 && n <= 29">
              </q-avatar>
            </div>

            <div class="q-pa-md q-gutter-sm" style="max-width: 350px; height: 80px">
              <q-avatar
                v-for="(el, n) in participantInactiveMatchObject"
                :key="n"
                size="40px"
                class="overlapping"
                :style="`left: ${(n - 30) * 32}px`"
                >
                <img :src="getAvatar(el.participantAvatar)" v-if="n > 29 && n <= 39">
              </q-avatar>
            </div>

            <div class="q-pa-md q-gutter-sm" style="max-width: 350px; height: 80px">
              <q-avatar
                v-for="(el, n) in participantInactiveMatchObject"
                :key="n"
                size="40px"
                class="overlapping"
                :style="`left: ${(n - 40) * 32}px`"
                >
                <img :src="getAvatar(el.participantAvatar)" v-if="n > 39">
              </q-avatar>
            </div>
          </q-card-section>

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
import { useQuasar } from 'quasar'
import { getCookie, getAdminCode, getAvatar, getTeamImage, getEventImage, URLMatchManagementAPI } from 'src/boot/utils.js'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const _constMatchId = ref('')
const _constIsEvent = ref(false)
const _constHomeTeam = ref('')
const _constAwayTeam = ref('')
const _constMatchName = ref('')
const _constMatchNameOld = ref('')
const _constPublished = ref(false)
const _constPublishOnTime = ref(false)
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
const _constHomeTeamFromTenant = ref('')
const _constHomeTeamAliasFromTenant = ref('')

const showPublishedOnly = ref(false)

let _TenantId
let _Season
let _URLTenant
let _URLMatch
let _URLParticipant
let _URLMember
let _URLTeam

export default {
  name: 'ListMatch',

  setup () {
    const $q = useQuasar()

    return {
      varAdminCode: ref(_constAdminCode),

      txtMatchId: ref(_constMatchId),
      tglIsEvent: ref(_constIsEvent),
      txtHomeTeam: ref(_constHomeTeam),
      txtAwayTeam: ref(_constAwayTeam),
      txtMatchName: ref(_constMatchName),
      txtMatchNameOld: ref(_constMatchNameOld),
      tglIsPublished: ref(_constPublished),
      txtPublishOnTime: ref(_constPublishOnTime),
      txtMatchDate: ref(_constMatchDate),
      txtDoorOpeningTime: ref(_constDoorOpeningTime),
      txtAnnotations: ref(_constAnnotations),
      txtSeason: ref(_constSeason),

      txtInactiveMatch: ref(_constInactiveMatch),
      txtInactiveDatetime: ref(_constInactiveDatetime),
      intInactiveNumberOfParticipants: ref(_constInactiveNumberOfParticipants),

      tglIsEventNew: ref(false),
      txtHomeTeamNew: ref(_constHomeTeamFromTenant),
      txtAwayTeamNew: ref(''),
      txtMatchNameNew: ref(_constMatchNameNew),
      tglIsPublishedNew: ref(false),
      txtPublishOnTimeNew: ref(''),
      txtMatchDateNew: ref(''),
      txtDoorOpeningTimeNew: ref(_constDoorOpeningTimeNew),
      txtAnnotationsNew: ref('<STANDARDTEXT>'),
      txtSeasonNew: ref(_constSeasonNew),

      homeTeamFromTenant: ref(_constHomeTeamFromTenant),

      showPublishedOnly,

      onMatchCreated () {
        $q.notify({
          type: 'positive',
          message: 'Spiel/Veranstaltung wurde erfolgreich erfasst!'
        })
      },

      onMatchUpdated () {
        $q.notify({
          type: 'positive',
          message: 'Spiel/Veranstaltung wurde erfolgreich aktualisiert!'
        })
      },

      onMatchArchived () {
        $q.notify({
          type: 'positive',
          message: 'Spiel/Veranstaltung wurde erfolgreich archiviert!'
        })
      },

      onMatchDeleted () {
        $q.notify({
          message: 'Spiel/Veranstaltung wurde erfolgreich gelöscht!',
          color: 'orange'
        })
      },

      onMatchAlreadyExists () {
        $q.notify({
          type: 'negative',
          message: 'Dieses/e Spiel/Veranstaltung besteht bereits!'
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
      teamImages: [],
      URLMatchManagementAPI,

      activeMatchObject: [
        {
          matchId: '',
          homeTeam: '',
          awayTeam: '',
          matchName: '',
          isPublished: '',
          matchDate: '',
          doorOpeningTime: '',
          annotations: '',
          season: '',
          publishOnTime: ''
        }
      ],

      inactiveMatchObject: [
        {
          matchId: '',
          homeTeam: '',
          awayTeam: '',
          matchName: '',
          matchDate: '',
          numberOfParticipants: ''
        }
      ],

      participantInactiveMatchObject: [
        {
          participant: '',
          participantAvatar: '',
          participantAvatarIsCustomized: '',
          participantImageURL: '',
          arrival: ''
        }
      ],

      memberObject: [
        {
          member: '',
          avatar: '',
          customized: '',
          ImageURL: ''
        }
      ]

    }
  },

  computed: {
  },

  mounted () {
    this.setVariables().then(() => {
      this.getTenantId().then(() => {
        this.getTableTeam().then(() => {
          this.getTableMember().then(() => {
            this.getTableActiveMatch()
            this.getTableInactiveMatch()
          })
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
      _URLTeam = URLMatchManagementAPI + '/Team'

      this.activeMatchObject = []
      this.inactiveMatchObject = []
      this.teamImages = []

      return Promise.resolve()
    },

    getTenantId () {
      return new Promise((resolve, reject) => {
        this.$axios.get(`${_URLTenant}/code/${_constAdminCode.value}`)
          .then((res) => {
            if (res.status === 200) {
              _TenantId = res.data.id
              _constSeasonNew.value = res.data.season
              _Season = res.data.season
              _constHomeTeamFromTenant.value = res.data.homeTeam
              _constHomeTeamAliasFromTenant.value = res.data.homeTeamAlias
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

      const publishedParam = !getCookie('isAdministrator')
        ? true
        : this.showPublishedOnly

      this.$axios.get(`${_URLMatch}/${_TenantId}/${_Season}/active/${publishedParam}`)
        .then((res) => {
          if (res.status === 200) {
            for (let index = 0; index < res.data.length; index++) {
              this.setActiveMatchObject(res.data[index].id, res.data[index].homeTeam, res.data[index].awayTeam, res.data[index].name.trim(), res.data[index].isPublished, res.data[index].date, res.data[index].doorOpeningTime, res.data[index].annotations.trim(), res.data[index].season, res.data[index].publishOnTime)
            }
          } else {
            console.log('Unexpected status code:', res.status)
          }
        })
        .catch((err) => console.log(err))
    },

    setActiveMatchObject (_matchId, _homeTeam, _awayTeam, _matchName, _isPublished, _matchDate, _doorOpeningTime, _annotations, _season, _publishOnTime) {
      let publishOnTimeFormatted = ''
      if (_publishOnTime !== null) {
        publishOnTimeFormatted = this.formatDateToDDMMYYYYHHmm(_publishOnTime)
      }
      this.activeMatchObject.push({ matchId: _matchId, homeTeam: _homeTeam, awayTeam: _awayTeam, matchName: _matchName, isPublished: _isPublished, matchDate: _matchDate, doorOpeningTime: _doorOpeningTime, annotations: _annotations, season: _season, publishOnTime: publishOnTimeFormatted })

      // Sort array of objects
      this.activeMatchObject.sort((a, b) => {
        // Convert date strings to ISO format for accurate comparison
        const dateA = a.matchDate.slice(6, 10) + '-' + a.matchDate.slice(3, 5) + '-' + a.matchDate.slice(0, 2) + 'T' + a.matchDate.slice(13)
        const dateB = b.matchDate.slice(6, 10) + '-' + b.matchDate.slice(3, 5) + '-' + b.matchDate.slice(0, 2) + 'T' + b.matchDate.slice(13)

        // Parse strings as Date objects
        return new Date(dateA) - new Date(dateB)
      })
    },

    onInactiveMatchClick (_matchId, _matchName, _datetime, _numberOfParticipants) {
      _constInactiveMatch.value = _matchName
      _constInactiveDatetime.value = _datetime
      _constInactiveNumberOfParticipants.value = _numberOfParticipants

      this.participantInactiveMatchObject = []
      this.$axios.get(`${_URLParticipant}/${_TenantId}/${_matchId}/present`)
        .then((res) => {
          if (res.status === 200) {
            for (let index = 0; index < res.data.length; index++) {
              const _memberEntry = this.memberObject.find(el => el.member === res.data[index].name.trim())
              let _participantAvatar = _memberEntry?.avatar
              if (typeof _participantAvatar === 'undefined') {
                _participantAvatar = ''
              }

              let _participantAvatarIsCustomized = _memberEntry?.customized
              if (typeof _participantAvatarIsCustomized === 'undefined') {
                _participantAvatarIsCustomized = false
              }

              let _participantImageURL = _memberEntry?.ImageURL
              if (typeof _participantImageURL === 'undefined') {
                _participantImageURL = ''
              }

              this.setParticipantInactiveMatchObject(res.data[index].name.trim(), _participantAvatar, _participantAvatarIsCustomized, _participantImageURL, res.data[index].arrival)
            }
          } else {
            console.log('Unexpected status code:', res.status)
          }
        })
        .catch((err) => console.log(err))

      this.showInactiveMatch = true
    },

    setParticipantInactiveMatchObject (_participant, _participantAvatar, _participantAvatarIsCustomized, _participantImageURL, _arrival) {
      this.participantInactiveMatchObject.push({ participant: _participant, participantAvatar: _participantAvatar, participantAvatarIsCustomized: _participantAvatarIsCustomized, participantImageURL: _participantImageURL, arrival: _arrival })

      // Sort array of objects
      this.participantInactiveMatchObject.sort((a, b) => {
        // Normalize empty arrival values to '24:00'
        const arrivalA = a.arrival === '' ? '24:00' : a.arrival
        const arrivalB = b.arrival === '' ? '24:00' : b.arrival

        // Parse arrival times into comparable numbers (hours and minutes)
        const timeA = arrivalA.split(':').map(Number)
        const timeB = arrivalB.split(':').map(Number)

        // Compare hours first, then minutes
        return timeA[0] - timeB[0] || timeA[1] - timeB[1]
      })
    },

    getTableTeam () {
      return new Promise((resolve, reject) => {
        this.teamImages = []

        this.$axios.get(`${_URLTeam}/${_TenantId}`)
          .then((res) => {
            if (res.status === 200) {
              for (let index = 0; index < res.data.length; index++) {
                const teamName = res.data[index].name.trim()
                const imageURL = res.data[index].imageURL || ''
                this.teamImages.push({
                  label: teamName,
                  value: teamName.replaceAll(' ', '_'),
                  image: imageURL ? URLMatchManagementAPI + imageURL : URLMatchManagementAPI + '/images/teams/QuestionMark.svg'
                })
              }
              this.teamImages.sort((a, b) => a.label.localeCompare(b.label))
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

    getTableMember () {
      return new Promise((resolve, reject) => {
        this.memberObject = []

        this.$axios.get(`${_URLMember}/${_TenantId}`)
          .then((res) => {
            if (res.status === 200) {
              for (let index = 0; index < res.data.length; index++) {
                const _imageURL = res.data[index].ImageURL || res.data[index].imageURL || res.data[index].imageUrl || res.data[index].ImageUrl || ''
                this.setMemberObject(res.data[index].name.trim(), res.data[index].avatar.trim(), res.data[index].isCustomized, _imageURL)
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

    setMemberObject (_member, _avatar, _customized, _imageURL) {
      this.memberObject.push({ member: _member, avatar: _avatar, customized: _customized, ImageURL: _imageURL })
    },

    onMatchClick (_matchId, _homeTeam, _awayTeam, _matchName, _isPublished, _publishOnTime, _matchDate, _doorOpeningTime, _annotations, _season) {
      _constMatchId.value = _matchId
      _constIsEvent.value = _homeTeam === '' && _awayTeam === ''
      _constHomeTeam.value = _homeTeam
      _constAwayTeam.value = _awayTeam
      _constMatchName.value = _matchName
      _constMatchNameOld.value = _matchName
      _constPublished.value = _isPublished
      _constPublishOnTime.value = _publishOnTime
      _constMatchDate.value = _matchDate
      _constDoorOpeningTime.value = _doorOpeningTime
      _constAnnotations.value = _annotations
      _constSeason.value = _season

      if (getCookie('isAdministrator')) this.editMatch = true
    },

    setValueForMatchNameNew (_homeTeam, _awayTeam) {
      if (typeof _homeTeam === 'undefined') _homeTeam = _constHomeTeamFromTenant.value

      if (typeof _homeTeam !== 'undefined' && typeof _awayTeam !== 'undefined') {
        let _labelHomeTeam = ''
        if (_homeTeam === _constHomeTeamFromTenant.value) {
          _labelHomeTeam = _constHomeTeamAliasFromTenant.value
        } else {
          _labelHomeTeam = this.teamImages.find(el => el.value === _homeTeam)?.label
        }
        let _labelAwayTeam = ''
        if (_awayTeam === _constHomeTeamFromTenant.value) {
          _labelAwayTeam = _constHomeTeamAliasFromTenant.value
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
        if (_homeTeam === _constHomeTeamFromTenant.value) {
          _labelHomeTeam = _constHomeTeamAliasFromTenant.value
        } else {
          _labelHomeTeam = this.teamImages.find(el => el.value === _homeTeam)?.label
        }
        let _labelAwayTeam = ''
        if (_awayTeam === _constHomeTeamFromTenant.value) {
          _labelAwayTeam = _constHomeTeamAliasFromTenant.value
        } else {
          _labelAwayTeam = this.teamImages.find(el => el.value === _awayTeam)?.label
        }
        _constMatchName.value = _labelHomeTeam + ' vs. ' + _labelAwayTeam
      }
    },

    addMatchSave (_homeTeam, _awayTeam, _matchName, _isEvent, _isPublished, _publishOnTime, _matchDate, _doorOpeningTime, _annotations, _season) {
      if (_isEvent) {
        _homeTeam = ''
        _awayTeam = ''
      } else {
        if (typeof _homeTeam === 'undefined') _homeTeam = _constHomeTeamFromTenant.value
      }

      const _matches = this.activeMatchObject.map(el => el.matchName)
      const _matchExists = _matches.includes(_matchName)
      const _publishOnTimeUtc = this.toUtcIso(_publishOnTime)

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
          name: _matchName.trim(),
          isPublished: _isPublished,
          date: _matchDate,
          doorOpeningTime: _doorOpeningTime,
          annotations: _annotations.trim(),
          isDeactivated: false,
          season: _season,
          publishOnTime: _publishOnTimeUtc
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

    editMatchSave (_matchId, _homeTeam, _awayTeam, _matchName, _matchNameOld, _isEvent, _isPublished, _publishOnTime, _matchDate, _doorOpeningTime, _annotations, _season) {
      if (_isEvent) {
        _homeTeam = ''
        _awayTeam = ''
      } else {
        if (typeof _homeTeam === 'undefined') _homeTeam = _constHomeTeam.value
        if (typeof _awayTeam === 'undefined') _awayTeam = _constAwayTeam.value
      }

      const _matches = this.activeMatchObject.map(el => el.matchName)
      const _matchExists = _matches.includes(_matchName) && _matchName !== _matchNameOld
      const _publishOnTimeUtc = this.toUtcIso(_publishOnTime)

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
          name: _matchName.trim(),
          isPublished: _isPublished,
          date: _matchDate,
          doorOpeningTime: _doorOpeningTime,
          annotations: _annotations.trim(),
          isDeactivated: false,
          season: _season,
          publishOnTime: _publishOnTimeUtc
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
      this.deactivateDeleteMatch(_matchId, true)
    },

    deactivateDeleteMatch (_matchId, _deactivate) {
      if (_deactivate) {
        this.$axios.put(`${_URLMatch}/${_TenantId}/${_matchId}/deactivate`)
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
        this.$axios.delete(`${_URLParticipant}/${_TenantId}/match/${_matchId}`)
          .then((res) => {
            if (res.status === 200) {
              this.$axios.delete(`${_URLMatch}/${_TenantId}/${_matchId}`)
                .then((res2) => {
                  if (res2.status === 200) {
                    this.onMatchDeleted()
                    this.getTableActiveMatch()
                    this.editMatch = false
                  } else {
                    console.log('Unexpected status code:', res2.status)
                  }
                })
                .catch((err2) => console.log(err2))
            } else {
              console.log('Unexpected status code:', res.status)
            }
          })
          .catch((err) => console.log(err))
      }
    },

    deleteMatch (_matchId) {
      this.deactivateDeleteMatch(_matchId, false)
    },

    getTableInactiveMatch (_seasonParam) {
      this.inactiveMatchObject = []

      if (typeof _seasonParam !== 'undefined') {
        _Season = _seasonParam
      }

      this.$axios.get(`${_URLMatch}/${_TenantId}/${_Season}/inactive`)
        .then((res) => {
          if (res.status === 200) {
            for (let index = 0; index < res.data.length; index++) {
              let _numberOfParticipants = 0
              this.$axios.get(`${_URLParticipant}/${_TenantId}/${res.data[index].id}/present`)
                .then((res2) => {
                  if (res2.status === 200) {
                    _numberOfParticipants = res2.data.length
                    this.setInactiveMatchObject(res.data[index].id, res.data[index].homeTeam, res.data[index].awayTeam, res.data[index].name.trim(), res.data[index].doorOpeningTime, res.data[index].date, _numberOfParticipants)
                  } else {
                    console.log('Unexpected status code:', res2.status)
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

    setInactiveMatchObject (_matchId, _homeTeam, _awayTeam, _matchName, _time, _matchDate, _numberOfParticipants) {
      this.inactiveMatchObject.push({ matchId: _matchId, homeTeam: _homeTeam, awayTeam: _awayTeam, matchName: _matchName, time: _time, matchDate: _matchDate, numberOfParticipants: _numberOfParticipants })

      // Sort array of objects
      this.inactiveMatchObject.sort((a, b) => {
        // Convert date strings to ISO format for accurate comparison
        const dateA = a.matchDate.slice(6, 10) + '-' + a.matchDate.slice(3, 5) + '-' + a.matchDate.slice(0, 2) + 'T' + a.matchDate.slice(13)
        const dateB = b.matchDate.slice(6, 10) + '-' + b.matchDate.slice(3, 5) + '-' + b.matchDate.slice(0, 2) + 'T' + b.matchDate.slice(13)

        // Parse strings as Date objects
        return new Date(dateB) - new Date(dateA)
      })
    },

    toUtcIso (localDateTime) {
      if (!localDateTime) return null

      // localDateTime = "DD-MM-YYYY - HH:mm"
      const [date, time] = localDateTime.split(' - ')
      const [d, m, y] = date.split('.')
      const [hh, mm] = time.split(':')

      const localDate = new Date(
        Number(y),
        Number(m) - 1, // JS months are 0-based
        Number(d),
        Number(hh),
        Number(mm)
      )

      return localDate.toISOString()
    },

    formatDateToDDMMYYYYHHmm (isoString) {
      if (!isoString) return ''

      const date = new Date(
        isoString.endsWith('Z') ? isoString : isoString + 'Z'
      )

      const dd = String(date.getDate()).padStart(2, '0')
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const yyyy = date.getFullYear()
      const hh = String(date.getHours()).padStart(2, '0')
      const min = String(date.getMinutes()).padStart(2, '0')

      return `${dd}.${mm}.${yyyy} - ${hh}:${min}`
    },

    isFutureMatch (matchDate) {
      if (!matchDate) return false

      // expected format: "dd.MM.yyyy - HH:mm"
      const [datePart, timePart] = matchDate.split(' - ')
      if (!datePart || !timePart) return false

      const [day, month, year] = datePart.split('.')
      const [hour, minute] = timePart.split(':')

      const matchDateTime = new Date(
        year,
        month - 1, // JS months are 0-based
        day,
        hour,
        minute
      )

      return matchDateTime > new Date()
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
