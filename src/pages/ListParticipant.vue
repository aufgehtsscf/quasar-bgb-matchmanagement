<template>
  <q-page>
    <div class="q-pa-md">
      <q-btn-dropdown
        split
        color="primary"
        push
        glossy
        no-caps
        icon="sports_volleyball"
        label="Spiel auswählen">

        <q-list v-for="(match, i) in activeMatchObject"
          :key="i"
          v-ripple>
          <q-item clickable v-close-popup @click="onMatchClick(match.matchId, match.homeTeam, match.awayTeam, match.matchName, match.doorOpeningtime, match.annotations, match.date)">
            <q-item-section>
              <q-item-label>{{ match.matchName }}</q-item-label>
              <q-item-label caption>{{ match.date }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <!-- Match Card -->
    <q-card class="my-card" style="max-width: 500px">
      <q-card-section horizontal v-if="txtHomeTeam !== '' && txtAwayTeam !==''">
        <q-img class="col-5" :src="getTeamImage(txtHomeTeam)"/>
        <q-card-section>
          <div class="absolute-center text-h6 text-center text-black">VS&nbsp;</div>
        </q-card-section>
        <q-img :src="getTeamImage(txtAwayTeam)"/>
      </q-card-section>

      <q-card-section horizontal v-if="txtHomeTeam === '' && txtAwayTeam ===''">
        <q-img :src="getEventImage(txtMatchName)"/>
      </q-card-section>

      <q-separator />

      <q-card-actions align="center">
        <q-btn flat class="text-h5 text-center text-black">
          {{ txtMatchName }}
        </q-btn>
      </q-card-actions>
    </q-card>

    <!-- Share -->
    <div class="q-pa-md" style="max-width: 500px" v-if="getCookie('isAdministrator')" >
      <q-btn class="bg-white text-primary" icon="share" label="Übersicht teilen" @click="setTextShareForWhatsApp(txtMatchName)" />
    </div>

    <!-- List of participants and tickets -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">

      <!-- Reservation area -->
      <div class="q-gutter-y-md column" style="max-width: 470px">
        <q-input dark outlined v-model="txtAnnotationsMatch" input-class="text-overline"
          type="textarea" :readonly="true">
        </q-input>
      </div>

      <!-- Participant area (Titel) -->
      <div class="q-pa-md" style="max-width: 470px">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title class="text-overline">Anwesend ({{ presentParticipantObject.length }})</q-toolbar-title>
          <q-btn class="bg-white text-primary" icon="add" label="Neu" @click="addParticipant = true" />
        </q-toolbar>
      </div>

      <!-- List of participants -->
      <q-list dark bordered separator style="max-width: 470px" v-for="(el, i) in presentParticipantObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onParticipantClick(el.presentParticipantParticipantId, el.presentParticipantParticipant, el.presentParticipantArrival, el.presentParticipantAnnotations, el.presentParticipantAction, el.presentParticipantReaction)">
          <q-item-section avatar>
            <q-avatar size="70px" color="deep-orange-14" text-color="white" v-if="el.presentParticipantParticipantAvatar === ''">
              {{ el.presentParticipantParticipant.substring(0, 1) }}
              <q-badge floating color="teal" v-if="isReservation(el.presentParticipantArrival, txtDoorOpeningTime)">reserviert</q-badge>
            </q-avatar>
            <q-avatar size="70px" v-if="el.presentParticipantParticipantAvatar !== ''">
              <img :src="getAvatar(getAdminCode(getCookie('applicationCode')), el.presentParticipantParticipantAvatar, el.presentParticipantParticipantAvatarIsCustomized === 'TRUE')">
              <q-badge floating color="teal" v-if="isReservation(el.presentParticipantArrival, txtDoorOpeningTime)">reserviert</q-badge>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label overline>{{ el.presentParticipantParticipant }}</q-item-label>
            <q-item-label caption>{{ el.presentParticipantArrival }}</q-item-label>
            <q-item-label caption>{{ el.presentParticipantAnnotations }}</q-item-label>
            <q-item-label caption v-if="el.presentParticipantReaction !== ''">{{ el.presentParticipantReaction }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Ticket assignment area (Titel) -->
      <div class="q-pa-md" style="max-width: 470px" v-if="txtHomeTeam === homeTeamFromTenant">
        <q-toolbar class="bg-primary text-white">
            <q-toolbar-title class="text-overline">Karte weitergeben ({{ ticketGivenObject.length }}) oder bedarf ({{ ticketRequiredObject.length }})</q-toolbar-title>
            <q-btn class="bg-white text-primary" icon="credit_card" label="Zuweisung" @click="addTicketAssignment = true" v-if="getCookie('isAdministrator')" />
        </q-toolbar>
      </div>

      <!-- List of ticket assignments -->
      <q-list dark bordered separator style="max-width: 470px" v-for="(ticket, i) in ticketObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onTicketAssignmentClick(ticket.ticketParticipantId, ticket.ticketParticipant, ticket.ticketArrival, ticket.ticketAnnotations, ticket.ticketAction, ticket.ticketReaction)">
          <q-item-section>
            <q-item-label overline v-if="ticket.ticketAction === 'brauche Karte'">??? an {{ ticket.ticketParticipant }}</q-item-label>
            <q-item-label overline v-if="ticket.ticketAction === 'meine Karte ist frei' && ticket.ticketReaction === ''">{{ ticket.ticketParticipant }} an ???</q-item-label>
            <q-item-label overline v-if="ticket.ticketAction === 'meine Karte ist frei' && ticket.ticketReaction !== ''">{{ ticket.ticketParticipant }} an {{ ticket.ticketReaction }}</q-item-label>
            <q-item-label caption>{{ ticket.ticketAnnotations }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="q-pa-md q-gutter-sm">
      <!-- Share -->
      <q-dialog v-model="share" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Übersicht teilen</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="q-pt-md" style="max-width: 350px">
              <q-input v-model="txtShare" filled type="textarea" rows="35" />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Start Dialogs participant -->
      <!-- Add participant -->
      <q-dialog v-model="addParticipant" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Teilnahme erfassen</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input filled dense v-model="txtParticipantNew" autofocus label="Name *" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
              filled dense
              v-model="txtActionNew"
              :options="cbxActionOptionsHome"
              label="Aktion *"
              options-selected-class="text-deep-orange"
              v-if="txtHomeTeam === homeTeamFromTenant"
            >
            </q-select>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
              filled dense
              v-model="txtActionNew"
              :options="cbxActionOptionsAway"
              label="Aktion *"
              options-selected-class="text-deep-orange"
              v-if="txtHomeTeam !== homeTeamFromTenant"
            >
            </q-select>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
              filled dense
              v-model="txtArrivalNew"
              :options="cbxArrivalOptions"
              label="Ankunft"
              options-selected-class="text-deep-orange"
              v-if="txtActionNew === 'bin dabei'"
            >
            </q-select>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input filled dense v-model="txtAnnotationsParticipantNew" type="textarea" label="Kommentar"/>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addParticipantSave(txtParticipantNew, txtArrivalNew, txtAnnotationsParticipantNew, txtActionNew, txtMatchName, txtMatchId, txtDoorOpeningTime, txtAnnotationsMatchOriginal)" :disable="txtParticipantNew === '' || txtActionNew === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit participant -->
      <q-dialog v-model="editParticipant" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Teilnahme ändern</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input filled dense v-model="txtParticipantParticipant" label="Name *" :readonly="false" v-if="txtParticipantReaction === ''" />
            <q-input filled dense v-model="txtParticipantParticipant" label="Name *" :readonly="true" v-if="txtParticipantReaction !== ''" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
              filled dense
              v-model="txtParticipantAction"
              :options="cbxActionOptionsHome"
              label="Aktion *"
              :readonly="false"
              options-selected-class="text-deep-orange"
              v-if="txtParticipantReaction === '' &&  txtHomeTeam === homeTeamFromTenant"
            >
            </q-select>

            <q-select
              filled dense
              v-model="txtParticipantAction"
              :options="cbxActionOptionsAway"
              label="Aktion *"
              :readonly="false"
              options-selected-class="text-deep-orange"
              v-if="txtParticipantReaction === '' &&  txtHomeTeam !== homeTeamFromTenant"
            >
            </q-select>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
              filled dense
              v-model="txtParticipantAction"
              :options="cbxActionOptionsHome"
              label="Aktion *"
              :readonly="true"
              options-selected-class="text-deep-orange"
              v-if="txtParticipantReaction !== '' &&  txtHomeTeam === homeTeamFromTenant"
            >
            </q-select>
            <q-select
              filled dense
              v-model="txtParticipantAction"
              :options="cbxActionOptionsAway"
              label="Aktion *"
              :readonly="true"
              options-selected-class="text-deep-orange"
              v-if="txtParticipantReaction !== '' &&  txtHomeTeam !== homeTeamFromTenant"
            >
            </q-select>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
              filled dense
              v-model="txtParticipantArrival"
              :options="cbxArrivalOptions"
              label="Ankunft"
              options-selected-class="text-deep-orange"
              v-if="txtParticipantAction === 'bin dabei'"
            >
            </q-select>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input class="text-italic" dense v-model="txtParticipantReaction" :readonly="true" v-if="txtParticipantReaction !== ''" />
            <div class="q-pt-md" style="max-width: 350px">
              <q-input filled dense v-model="txtParticipantAnnotations" type="textarea" label="Kommentar"/>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" color="primary" @click="delParticipant = true" v-if=" getCookie('isAdministrator') && txtParticipantReaction === ''" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editParticipantSave(txtParticipantId, txtParticipantParticipant, txtParticipantParticipantOld, txtParticipantArrival, txtParticipantAnnotations, txtParticipantAction, txtMatchId, txtDoorOpeningTime, txtAnnotationsMatchOriginal)" :disable="txtParticipantParticipant === '' || txtParticipantAction === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete participant -->
      <q-dialog v-model="delParticipant" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="primary" text-color="white" />
            <span class="q-ml-sm">Datensatz löschen?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Nein" color="primary" v-close-popup />
            <q-btn flat label="Ja" color="primary" @click="deleteParticipant(txtParticipantId, txtMatchId, txtDoorOpeningTime, txtAnnotationsMatchOriginal)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- End Dialogs participant -->

      <!-- Start Dialogs ticket assignment-->
      <!-- Add ticket assignment -->
      <q-dialog v-model="addTicketAssignment" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Karte zuweisen</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select v-model="txtTicketAssignmentGiven" :options="cbxTicketAssignmentGivenOptions" label="Karte von" />
            <q-select v-model="txtTicketAssignmentRequired" :options="cbxTicketAssignmentRequiredOptions" label="Karte an" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addTicketAssignmentSave(txtTicketAssignmentGiven, txtTicketAssignmentRequired, txtMatchId, txtDoorOpeningTime, txtAnnotationsMatchOriginal)" :disable="txtTicketAssignmentGiven === '' || txtTicketAssignmentRequired === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit ticket assignment -->
      <q-dialog v-model="editTicketAssignment" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Freigabe oder Bedarf ändern</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="txtTicketParticipant" label="Name" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
              filled
              v-model="txtTicketAction"
              :options="cbxActionOptionsHome"
              label="Aktion"
              options-selected-class="text-deep-orange"
              v-if="txtHomeTeam === homeTeamFromTenant"
            >
            </q-select>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
              filled
              v-model="txtTicketAction"
              :options="cbxActionOptionsAway"
              label="Aktion"
              options-selected-class="text-deep-orange"
              v-if="txtHomeTeam !== homeTeamFromTenant"
            >
            </q-select>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="q-pt-md" style="max-width: 350px">
              <q-input v-model="txtTicketAnnotations" filled type="textarea" label="Kommentar"/>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" color="primary" @click="delTicketAssignment = true" v-if="getCookie('isAdministrator')" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editTicketAssignmentSave(txtTicketParticipantId, txtTicketParticipant, txtTicketParticipantOld, txtTicketArrival, txtTicketAnnotations, txtTicketAction, txtMatchId, txtDoorOpeningTime, txtAnnotationsMatchOriginal)" :disable="txtTicketParticipant === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit ticket assigned -->
      <q-dialog v-model="editTicketAssigned" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Kartenzuweisung</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input v-model="txtTicketAssignmentGiven" label="Karte von" :readonly="true"  />
            <q-input v-model="txtTicketAssignmentRequired" label="Karte an" :readonly="true" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="swipe_left" label="Aufheben" color="primary" @click="delTicketAssigned = true" v-if="getCookie('isAdministrator')" />
            <q-btn flat label="Abbrechen" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete ticket assignment -->
      <q-dialog v-model="delTicketAssignment" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="primary" text-color="white" />
            <span class="q-ml-sm">Datensatz löschen?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Nein" color="primary" v-close-popup />
            <q-btn flat label="Ja" color="primary" @click="deleteTicketAssignment(txtTicketParticipantId, txtMatchId, txtDoorOpeningTime, txtAnnotationsMatchOriginal)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete ticket assigned -->
      <q-dialog v-model="delTicketAssigned" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="swipe_left" color="primary" text-color="white" />
            <span class="q-ml-sm">Kartenzuweisung aufheben?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Nein" color="primary" v-close-popup />
            <q-btn flat label="Ja" color="primary" @click="deleteTicketAssigned(txtTicketAssignedGiven, txtTicketAssignedRequired, txtMatchId, txtDoorOpeningTime, txtAnnotationsMatchOriginal)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- Start Dialogs ticket assignment-->
    </div>

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import useQuasar from 'quasar/src/composables/use-quasar.js'
import { getCookie, getAdminCode, getAvatar, teamImages, getTeamImage, getEventImage, URLMatchManagementAPI } from 'src/boot/utils.js'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const _constMatchId = ref('')
const _constHomeTeam = ref('')
const _constAwayTeam = ref('')
const _constMatchName = ref('')
const _constDoorOpeningTime = ref('')
const _constAnnotationsMatchOriginal = ref('')
const _constAnnotationsMatch = ref('')
const _constArrivalElements = []

const _constParticipantId = ref('')
const _constParticipantParticipant = ref('')
const _constParticipantParticipantOld = ref('')
const _constParticipantArrival = ref('')
const _constParticipantAnnotations = ref('')
const _constParticipantAction = ref('')
const _constParticipantReaction = ref('')

const _constTicketParticipantRow = ref(0)
const _constTicketParticipantId = ref('')
const _constTicketParticipant = ref('')
const _constTicketParticipantOld = ref('')
const _constTicketArrival = ref('')
const _constTicketAnnotations = ref('')
const _constTicketAction = ref('')

const _constTicketAssignmentGivenElements = []
const _constTicketAssignmentRequiredElements = []
const _constTicketAssignmentGiven = ref('')
const _constTicketAssignmentRequired = ref('')

const _constParticipantList = ref('')
const _constParticipantListFormattedForWhatsApp = ref('')
const _constTicketList = ref('')
const _constShare = ref('')

const _constAdminCode = ref('')
const _constHomeTeamFromTenant = ref('')
const _constStandardTextFromTenant = ref('')

let _TenantId
let _Season
let _URLTenant
let _URLMatch
let _URLParticipant
let _URLWhereIsMyCard
let _URLMember

export default {
  name: 'ListParticipant',

  setup () {
    const $q = useQuasar()

    return {
      txtMatchId: ref(_constMatchId),
      txtHomeTeam: ref(_constHomeTeam),
      txtAwayTeam: ref(_constAwayTeam),
      txtMatchName: ref(_constMatchName),
      txtDoorOpeningTime: ref(_constDoorOpeningTime),
      txtAnnotationsMatchOriginal: ref(_constAnnotationsMatchOriginal),
      txtAnnotationsMatch: ref(_constAnnotationsMatch),
      cbxArrivalOptions: ref(_constArrivalElements),

      homeTeamFromTenant: ref(_constHomeTeamFromTenant),

      onParticipantCreated () {
        $q.notify({
          type: 'positive',
          message: 'Teilnahme wurde erfolgreich erfasst!'
        })
      },

      onParticipantUpdated () {
        $q.notify({
          type: 'positive',
          message: 'Teilnahme wurde erfolgreich aktualisiert!'
        })
      },

      onParticipantDeleted () {
        $q.notify({
          message: 'Teilnahme wurde erfolgreich gelöscht!',
          color: 'orange'
        })
      },

      onAssignmentCreated () {
        $q.notify({
          type: 'positive',
          message: 'Zuweisung wurde erfolgreich erfasst!'
        })
      },

      OnTicketAssignedDeleted () {
        $q.notify({
          message: 'Zuweisung wurde erfolgreich aufgehoben!',
          color: 'orange'
        })
      },

      onTicketAssigmentUpdated () {
        $q.notify({
          type: 'positive',
          message: 'Freigabe/Bedarf wurde erfolgreich aktualisert!'
        })
      },

      onTicketAssigmentDeleted () {
        $q.notify({
          message: 'Fregabe/Bedarf wurde erfolgreich gelöscht!',
          color: 'orange'
        })
      },

      onParticipantAlreadyExists () {
        $q.notify({
          type: 'negative',
          message: 'Diese Teilnahme besteht bereits!'
        })
      },

      addParticipant: ref(false),
      editParticipant: ref(false),
      delParticipant: ref(false),
      share: ref(false),

      addTicketAssignment: ref(false),
      editTicketAssignment: ref(false),
      editTicketAssigned: ref(false),
      delTicketAssignment: ref(false),
      delTicketAssigned: ref(false),

      txtParticipantId: ref(_constParticipantId),
      txtParticipantParticipant: ref(_constParticipantParticipant),
      txtParticipantParticipantOld: ref(_constParticipantParticipantOld),
      txtParticipantArrival: ref(_constParticipantArrival),
      txtParticipantAnnotations: ref(_constParticipantAnnotations),
      txtParticipantAction: ref(_constParticipantAction),
      txtParticipantReaction: ref(_constParticipantReaction),

      cbxActionOptionsHome: ['bin dabei', 'brauche Karte', 'meine Karte ist frei'],
      cbxActionOptionsAway: ['bin dabei'],

      intTicketParticipantRow: ref(_constTicketParticipantRow),
      txtTicketParticipantId: ref(_constTicketParticipantId),
      txtTicketParticipant: ref(_constTicketParticipant),
      txtTicketParticipantOld: ref(_constTicketParticipantOld),
      txtTicketArrival: ref(_constTicketArrival),
      txtTicketAnnotations: ref(_constTicketAnnotations),
      txtTicketAction: ref(_constTicketAction),

      txtParticipantNew: ref(''),
      txtArrivalNew: ref(''),
      txtAnnotationsParticipantNew: ref(''),
      txtActionNew: ref('bin dabei'),

      cbxTicketAssignmentGivenOptions: ref(_constTicketAssignmentGivenElements),
      cbxTicketAssignmentRequiredOptions: ref(_constTicketAssignmentRequiredElements),
      txtTicketAssignmentGiven: ref(_constTicketAssignmentGiven),
      txtTicketAssignedGiven: ref(_constTicketAssignmentGiven),
      txtTicketAssignmentRequired: ref(_constTicketAssignmentRequired),
      txtTicketAssignedRequired: ref(_constTicketAssignmentRequired),

      txtShare: ref(_constShare)
    }
  },

  data () {
    return {

      bodyText: 'Um diese Applikation für deinen Fanclub freizuschalten, benötigen wir einige Eckdaten. Bitte sende eine E-Mail an aufgehtsscf@gmail.com mit einer Kontakt-E-Mail-Adresse und dem Namen deiner Fan-Community. Du erhältst schnellstmöglich von uns einen kostenlosen Aktivierungscode.',

      getCookie,
      getAdminCode,
      getAvatar,
      teamImages,
      getTeamImage,
      getEventImage,
      URLMatchManagementAPI,

      activeMatchObject: [
        {
          matchId: '',
          homeTeam: '',
          awayTeam: '',
          matchName: '',
          doorOpeningtime: '',
          annotations: '',
          date: ''
        }
      ],

      participantObject: [
        {
          participantId: '',
          timestamp: '',
          matchId: '',
          participant: '',
          participantAvatar: '',
          _participantAvatarIsCustomized: '',
          arrival: '',
          annotations: '',
          action: '',
          reaction: ''
        }
      ],
      reservation: '',

      presentParticipantObject: [
        {
          presentParticipantParticipantId: '',
          presentParticipantMatchName: '',
          presentParticipantParticipant: '',
          presentParticipantParticipantAvatar: '',
          presentParticipantParticipantAvatarIsCustomized: '',
          presentParticipantArrival: '',
          presentParticipantAnnotations: '',
          presentParticipantAction: '',
          presentParticipantReaction: ''
        }
      ],

      ticketObject: [
        {
          ticketParticipantId: '',
          ticketParticipant: '',
          ticketArrival: '',
          ticketAnnotations: '',
          ticketAction: '',
          ticketReaction: ''
        }
      ],

      ticketGivenObject: [
        {
          ticketGivenParticipantId: '',
          ticketGivenParticipant: ''
        }
      ],

      ticketRequiredObject: [
        {
          ticketRequiredParticipantId: '',
          ticketRequiredParticipant: ''
        }
      ],

      ticketAssignedObject: [
        {
          ticketAssignedParticipantId: '',
          ticketAssignedParticipant: ''
        }
      ],

      whereIsMyCardObject: [
        {
          cardHolder: '',
          discounted: '',
          whoHasTheCard: ''
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
          this.getTableWhereIsMyCard()
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
      _URLWhereIsMyCard = URLMatchManagementAPI + '/CardHolder'
      _URLMember = URLMatchManagementAPI + '/Member'

      this.activeMatchObject = []
      this.participantObject = []
      this.presentParticipantObject = []
      this.ticketObject = []
      this.ticketGivenObject = []
      this.ticketRequiredObject = []
      this.ticketAssignedObject = []

      return Promise.resolve()
    },

    isReservation (_participantArrival, _matchTime) {
      if (_participantArrival !== '') {
        if (parseInt(_participantArrival.substring(0, 2)) === parseInt(_matchTime.substring(0, 2)) &&
        _participantArrival.substring(3, 5) === _matchTime.substring(3, 5)) { return true } else { return false }
      }
      return false
    },

    getTenantId () {
      return new Promise((resolve, reject) => {
        this.$axios.get(`${_URLTenant}/code/${_constAdminCode.value}`)
          .then((res) => {
            if (res.status === 200) {
              _TenantId = res.data.id
              _Season = res.data.season
              _constHomeTeamFromTenant.value = res.data.homeTeam
              _constStandardTextFromTenant.value = res.data.standardText
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

    getTableActiveMatch () {
      this.activeMatchObject = []
      this.participantObject = []
      this.presentParticipantObject = []
      this.ticketObject = []
      this.ticketGivenObject = []
      this.ticketRequiredObject = []
      this.ticketAssignedObject = []

      this.$axios.get(`${_URLMatch}/${_TenantId}/${_Season}/active/true`)
        .then((res) => {
          for (let index = 0; index < res.data.length; index++) {
            this.setActiveMatchObject(res.data[index].id, res.data[index].homeTeam, res.data[index].awayTeam, res.data[index].name, res.data[index].doorOpeningTime, res.data[index].annotations, res.data[index].date)
          }

          if (res.data.length > 0) {
            this.onMatchClick(this.activeMatchObject[0].matchId, this.activeMatchObject[0].homeTeam, this.activeMatchObject[0].awayTeam, this.activeMatchObject[0].matchName, this.activeMatchObject[0].doorOpeningtime, this.activeMatchObject[0].annotations, this.activeMatchObject[0].date)
          }
        })
        .catch((err) => console.log(err))
    },

    setActiveMatchObject (_matchId, _homeTeam, _awayTeam, _matchName, _doorOpeningTime, _annotations, _date) {
      this.activeMatchObject.push({ matchId: _matchId, homeTeam: _homeTeam, awayTeam: _awayTeam, matchName: _matchName, doorOpeningtime: _doorOpeningTime, annotations: _annotations, date: _date })

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

    onMatchClick (_matchId, _homeTeam, _awayTeam, _matchName, _doorOpeningTime, _annotationsMatch, _date) {
      _constMatchId.value = _matchId
      _constHomeTeam.value = _homeTeam
      _constAwayTeam.value = _awayTeam
      _constMatchName.value = _matchName.trim() + ' ' + _date
      _constDoorOpeningTime.value = _doorOpeningTime

      this.loadReloadData(_matchId, _doorOpeningTime, _annotationsMatch)
    },

    loadReloadData (_matchId, _doorOpeningTime, _annotationsMatch) {
      this.setArrivalElements(_doorOpeningTime)
      this.getTableParticipant(_matchId, _doorOpeningTime, _annotationsMatch)
    },

    setTextShare (_matchName) {
      _constShare.value = _matchName + '\n\nAnwesend (' + this.presentParticipantObject.length + '):\n' + _constParticipantList.value
      if (_constHomeTeam.value === _constHomeTeamFromTenant.value) {
        _constShare.value += '\nKarte weitergeben (' + this.ticketGivenObject.length + ') oder bedarf (' + this.ticketRequiredObject.length + '):\n' + _constTicketList.value
      }
      _constShare.value += '\n' + _constAnnotationsMatch.value
      this.share = true
    },

    setTextShareForWhatsApp (_matchName) {
      _constShare.value = '*' + _matchName + '*\n\n*Anwesend (' + this.presentParticipantObject.length + '):*\n\n' + _constParticipantListFormattedForWhatsApp.value
      if (_constHomeTeam.value === _constHomeTeamFromTenant.value) {
        _constShare.value += '\n*Karte weitergeben (' + this.ticketGivenObject.length + ') oder bedarf (' + this.ticketRequiredObject.length + '):*\n\n' + _constTicketList.value
      }
      _constShare.value += '\n' + _constAnnotationsMatch.value
      this.share = true
    },

    onParticipantClick (_participantId, _participant, _arrival, _annotations, _action, _reaction) {
      _constParticipantId.value = _participantId
      _constParticipantParticipant.value = _participant
      _constParticipantParticipantOld.value = _participant
      _constParticipantArrival.value = _arrival
      _constParticipantAnnotations.value = _annotations
      _constParticipantAction.value = _action
      if (_reaction !== '') {
        _constParticipantReaction.value = _reaction
      } else {
        _constParticipantReaction.value = ''
      }

      this.editParticipant = true
    },

    addParticipantSave (_participant, _arrival, _annotations, _action, _matchName, _matchId, _time, _annotationsMatch) {
      if (_action !== 'bin dabei') _arrival = ''

      const _participants = this.participantObject.map(el => el.participant)
      const _participantExists = _participants.includes(_participant)

      if (_participantExists) {
        this.onParticipantAlreadyExists()
      } else {
        const _constNewGuid = uuidv4()
        const _constCreationTime = new Date()

        const newParticipant = {
          id: _constNewGuid,
          creationTime: _constCreationTime,
          lastModificationTime: null,
          tenantId: _TenantId,
          name: _participant,
          arrival: _arrival,
          annotations: _annotations,
          action: _action,
          reaction: '',
          matchId: _matchId
        }

        this.$axios.post(`${_URLParticipant}/${_TenantId}`, newParticipant)
          .then((res) => {
            if (res.status === 201) {
              this.onParticipantCreated()
              this.loadReloadData(_matchId, _time, _annotationsMatch)
            } else {
              console.log('Unexpected status code:', res.status)
            }
          })
          .catch((err) => console.log(err))
      }
    },

    editParticipantSave (_participantId, _participant, _participantOld, _arrival, _annotations, _action, _matchId, _time, _annotationsMatch) {
      if (_action !== 'bin dabei') _arrival = ''

      const _participants = this.participantObject.map(el => el.participant)
      const _participantExists = _participants.includes(_participant) && _participant !== _participantOld

      if (_participantExists) {
        this.onParticipantAlreadyExists()
      } else {
        const updParticipant = {
          id: _participantId,
          creationTime: null,
          lastModificationTime: null,
          tenantId: _TenantId,
          name: _participant,
          arrival: _arrival,
          annotations: _annotations,
          action: _action,
          reaction: '',
          matchId: _matchId
        }
        this.$axios.put(`${_URLParticipant}/${_TenantId}/${_participantId}`, updParticipant)
          .then((res) => {
            if (res.status === 200) {
              this.onParticipantUpdated()
              this.loadReloadData(_matchId, _time, _annotationsMatch)
            } else {
              console.log('Unexpected status code:', res.status)
            }
          })
          .catch((err) => console.log(err))
      }
    },

    deleteParticipant (_participantId, _matchId, _time, _annotationsMatch) {
      this.$axios.delete(`${_URLParticipant}/${_TenantId}/${_participantId}`)
        .then((res) => {
          if (res.status === 200) {
            this.onParticipantDeleted()
            this.loadReloadData(_matchId, _time, _annotationsMatch)
            this.editParticipant = false
          } else {
            console.log('Unexpected status code:', res.status)
          }
        })
        .catch((err) => console.log(err))
    },

    onTicketAssignmentClick (_ticketParticipantId, _participant, _arrival, _annotations, _action, _reaction) {
      _constTicketParticipantId.value = _ticketParticipantId
      _constTicketParticipant.value = _participant
      _constTicketParticipantOld.value = _participant
      _constTicketArrival.value = _arrival
      _constTicketAnnotations.value = _annotations
      _constTicketAction.value = _action

      if (_reaction !== '') {
        _constTicketAssignmentGiven.value = _participant
        _constTicketAssignmentRequired.value = _reaction
        this.editTicketAssignment = false
        this.editTicketAssigned = true
      } else {
        _constTicketAssignmentRequired.value = ''
        _constTicketAssignmentGiven.value = ''
        this.editTicketAssignment = true
        this.editTicketAssigned = false
      }
    },

    addTicketAssignmentSave (_ticketAssignmentGiven, _ticketAssignmentRequired, _matchId, _doorOpeningTime, _annotationsMatch) {
      const _ticketGivenParticipantId = this.ticketGivenObject.find(el => el.ticketGivenParticipant === _ticketAssignmentGiven)?.ticketGivenParticipantId
      if (typeof _ticketGivenParticipantId !== 'undefined') {
        this.$axios.put(`${_URLParticipant}/${_TenantId}/${_ticketGivenParticipantId}/${_ticketAssignmentRequired}`)
          .catch((err) => console.log(err))

        const _ticketRequiredParticipantId = this.ticketRequiredObject.find(el => el.ticketRequiredParticipant === _ticketAssignmentRequired)?.ticketRequiredParticipantId
        if (typeof _ticketRequiredParticipantId !== 'undefined') {
          const _participantAction = 'bin dabei'
          this.$axios.put(`${_URLParticipant}/${_TenantId}/${_ticketRequiredParticipantId}/${_participantAction}/${_ticketAssignmentGiven}`)
            .then((res) => {
              if (res.status === 200) {
                this.onAssignmentCreated()
                this.loadReloadData(_matchId, _doorOpeningTime, _annotationsMatch)
              }
            })
            .catch((err) => console.log(err))
        }
      }
    },

    deleteTicketAssigned (_ticketAssignedGiven, _ticketAssignedRequired, _matchId, _doorOpeningTime, _annotationsMatch) {
      const _ticketAssignedGivenParticipantId = this.ticketAssignedObject.find(el => el.ticketAssignedParticipant === _ticketAssignedGiven)?.ticketAssignedParticipantId
      if (typeof _ticketAssignedGivenParticipantId !== 'undefined') {
        this.$axios.put(`${_URLParticipant}/${_TenantId}/${_ticketAssignedGivenParticipantId}/""`)
          .catch((err) => console.log(err))

        const _ticketAssignedRequiredParticipantId = this.ticketAssignedObject.find(el => el.ticketAssignedParticipant === _ticketAssignedRequired)?.ticketAssignedParticipantId
        if (typeof _ticketAssignedRequiredParticipantId !== 'undefined') {
          this.$axios.put(`${_URLParticipant}/${_TenantId}/${_ticketAssignedRequiredParticipantId}/brauche Karte//`)
            .then((res) => {
              if (res.status === 200) {
                this.editTicketAssigned = false
                this.OnTicketAssignedDeleted()
                this.loadReloadData(_matchId, _doorOpeningTime, _annotationsMatch)
              }
            })
            .catch((err) => console.log(err))
        }
      }
    },

    editTicketAssignmentSave (_ticketParticipantId, _participant, _participantOld, _arrival, _annotations, _action, _matchId, _time, _annotationsMatch) {
      if (_action !== 'bin dabei') _arrival = ''

      const _participants = this.ticketObject.map(el => el.ticketParticipant)
      const _participantExists = _participants.includes(_participant) && _participant !== _participantOld
      if (_participantExists) {
        this.onParticipantAlreadyExists()
      } else {
        const updParticipant = {
          id: _ticketParticipantId,
          creationTime: null,
          lastModificationTime: null,
          tenantId: _TenantId,
          name: _participant,
          arrival: _arrival,
          annotations: _annotations,
          action: _action,
          reaction: '',
          matchId: _matchId
        }
        this.$axios.put(`${_URLParticipant}/${_TenantId}/${_ticketParticipantId}`, updParticipant)
          .then((res) => {
            if (res.status === 200) {
              this.editTicketAssignment = false
              this.onTicketAssigmentUpdated()
              this.loadReloadData(_matchId, _time, _annotationsMatch)
            }
          })
          .catch((err) => console.log(err))
      }
    },

    deleteTicketAssignment (_ticketParticipantId, _matchId, _time, _annotationsMatch) {
      this.$axios.delete(`${_URLParticipant}/${_TenantId}/${_ticketParticipantId}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.editTicketAssignment = false
            this.onTicketAssigmentDeleted()
            this.loadReloadData(_matchId, _time, _annotationsMatch)
          }
        })
        .catch((err) => console.log(err))
    },

    getTableParticipant (_matchId, _doorOpeningTime, _annotationsMatch) {
      this.participantObject = []
      this.presentParticipantObject = []
      this.ticketObject = []
      this.ticketGivenObject = []
      this.ticketRequiredObject = []
      this.ticketAssignedObject = []

      this.reservation = ''
      _constParticipantList.value = ''
      _constParticipantListFormattedForWhatsApp.value = ''
      _constAnnotationsMatch.value = ''
      _constTicketList.value = ''

      this.$axios.get(`${_URLParticipant}/${_TenantId}/${_matchId}`)
        .then((res) => {
          for (let index = 0; index < res.data.length; index++) {
            let _participantAvatar = this.memberObject.find(el => el.member === res.data[index].name)?.avatar
            if (typeof _participantAvatar === 'undefined') _participantAvatar = ''
            let _participantAvatarIsCustomized = this.memberObject.find(el => el.member === res.data[index].name)?.customized
            if (typeof _participantAvatarIsCustomized === 'undefined') _participantAvatarIsCustomized = false

            this.setParticipantObject(res.data[index].id, res.data[index].creationTime, res.data[index].matchId, res.data[index].name, _participantAvatar, _participantAvatarIsCustomized, res.data[index].arrival, res.data[index].annotations, res.data[index].action, res.data[index].reaction)
          }

          if (res.data.length > 0) {
            this.fillObjects(_matchId, _doorOpeningTime, _annotationsMatch)
          }
        })
        .catch((err) => console.log(err))
    },

    setParticipantObject (_participantId, _timestamp, _matchId, _participant, _participantAvatar, _participantAvatarIsCustomized, _arrival, _annotations, _action, _reaction) {
      this.participantObject.push({ participantId: _participantId, timestamp: _timestamp, matchId: _matchId, participant: _participant, participantAvatar: _participantAvatar, participantAvatarIsCustomized: _participantAvatarIsCustomized, arrival: _arrival, annotations: _annotations, action: _action, reaction: _reaction })

      // Sort array of objects
      this.participantObject.sort(function (a, b) {
        let arrivalA = a.arrival.toLowerCase()
        if (arrivalA === '') arrivalA = '24:00'

        let arrivalB = b.arrival.toLowerCase()
        if (arrivalB === '') arrivalB = '24:00'

        if (arrivalA > arrivalB) return 1
        if (arrivalA < arrivalB) return -1
        return 0
      })
    },

    fillObjects (_matchId, _doorOpeningTime, _annotationsMatch) {
      this.participantObject.forEach(el => {
        if (el.action === 'bin dabei') this.setPresentParticipantObject(el.participantId, el.matchId, el.participant, el.participantAvatar, el.participantAvatarIsCustomized, el.arrival, el.annotations, el.action, el.reaction)

        if (el.action === 'meine Karte ist frei' || (el.action === 'brauche Karte' && el.reaction === '')) this.setTicketObject(el.participantId, el.participant, el.arrival, el.annotations, el.action, el.reaction)

        if (el.action === 'meine Karte ist frei' && el.reaction === '') this.setTicketGivenObject(el.participantId, el.participant)

        if (el.action === 'brauche Karte' && el.reaction === '') this.setTicketRequiredObject(el.participantId, el.participant)

        if (el.reaction !== '') this.setTicketAssignedObject(el.participantId, el.participant)
      })

      this.presentParticipantObject.forEach(el => {
        _constParticipantList.value += el.presentParticipantParticipant.trim()
        if (el.presentParticipantArrival !== '') _constParticipantListFormattedForWhatsApp.value += '*'
        else _constParticipantListFormattedForWhatsApp.value += '_'
        _constParticipantListFormattedForWhatsApp.value += el.presentParticipantParticipant.trim()

        _constParticipantList.value += ' (' + el.presentParticipantArrival + ')'
        _constParticipantListFormattedForWhatsApp.value += ' (' + el.presentParticipantArrival + ')'

        if (el.presentParticipantArrival !== '') _constParticipantListFormattedForWhatsApp.value += '*'

        if (this.isReservation(el.presentParticipantArrival, _doorOpeningTime)) {
          if (this.reservation !== '') this.reservation += ', '
          this.reservation += el.presentParticipantParticipant.trim()
        }

        if (el.presentParticipantAnnotations !== '') {
          _constParticipantList.value += ' (' + el.presentParticipantAnnotations.trim() + ')'
          if (el.presentParticipantArrival !== '') { _constParticipantListFormattedForWhatsApp.value += ' _(' + el.presentParticipantAnnotations.trim() + ')' } else { _constParticipantListFormattedForWhatsApp.value += ' (' + el.presentParticipantAnnotations.trim() + ')' }
        }

        if (el.presentParticipantReaction !== '') {
          const _whoHasTheCard = this.whereIsMyCardObject.find(el2 => el2.cardHolder === el.presentParticipantReaction)?.whoHasTheCard
          let haveCardFrom = el.presentParticipantReaction.trim()
          if (typeof _whoHasTheCard !== 'undefined' &&
              !el.presentParticipantMatchName.includes('DFB Pokal') &&
              !el.presentParticipantMatchName.includes('Europapokal')) {
            haveCardFrom += ' (Karte bei ' + _whoHasTheCard + ')'
          }
          el.presentParticipantReaction = 'habe Karte von ' + haveCardFrom.trim()
          _constParticipantList.value += ', ' + el.presentParticipantReaction.trim()
          if (el.presentParticipantArrival !== '' && el.presentParticipantAnnotations === '') _constParticipantListFormattedForWhatsApp.value += '_'
          _constParticipantListFormattedForWhatsApp.value += ', ' + el.presentParticipantReaction.trim()
          if (el.presentParticipantArrival !== '' && el.presentParticipantAnnotations === '') _constParticipantListFormattedForWhatsApp.value += '_'
        } else {
          if (el.presentParticipantAnnotations !== '') _constParticipantListFormattedForWhatsApp.value += '_'
        }
        if (el.presentParticipantArrival !== '' && el.presentParticipantAnnotations !== '' && el.presentParticipantReaction !== '') _constParticipantListFormattedForWhatsApp.value += '_'

        _constParticipantList.value += '\n'
        if (el.presentParticipantArrival === '') _constParticipantListFormattedForWhatsApp.value += '_'
        _constParticipantListFormattedForWhatsApp.value += '\n'
      })

      if (this.reservation !== '') this.reservation += ','

      const _standardText = _constStandardTextFromTenant.value.replace('<HH>', parseInt(_doorOpeningTime.substring(0, 2))).replace('<MM>', _doorOpeningTime.substring(3, 5)).replace('<WHO_RESERVES_PLACES>', this.reservation)

      _constAnnotationsMatchOriginal.value = _annotationsMatch
      _constAnnotationsMatch.value = _annotationsMatch.replace('<STANDARDTEXT>', _standardText).replace(',,', ',')
      _constAnnotationsMatch.value = _annotationsMatch.replace('<STANDARDTEXT>', _standardText).replace(',.', '.')
      if (_constAnnotationsMatch.value.substring(_constAnnotationsMatch.value.length - 1, _constAnnotationsMatch.value.length) === ',') {
        _constAnnotationsMatch.value = _constAnnotationsMatch.value.substring(0, _constAnnotationsMatch.value.length - 1) + '.'
      }

      this.ticketObject.forEach(el => {
        if (el.ticketAction === 'brauche Karte') _constTicketList.value += '??? an ' + el.ticketParticipant.trim()

        if (el.ticketAction === 'meine Karte ist frei') {
          _constTicketList.value += el.ticketParticipant.trim()

          if (el.ticketReaction === '') _constTicketList.value += ' an ???'
          else _constTicketList.value += ' an ' + el.ticketReaction.trim()
        }

        if (el.ticketAnnotations !== '') _constTicketList.value += ' (' + el.ticketAnnotations.trim() + ')'

        _constTicketList.value += '\n'
      })

      _constTicketAssignmentGivenElements.length = 0
      let i = 0
      this.ticketGivenObject.forEach(ticketGiven => {
        _constTicketAssignmentGivenElements[i] = ticketGiven.ticketGivenParticipant
        i++
      })

      _constTicketAssignmentRequiredElements.length = 0
      let j = 0
      this.ticketRequiredObject.forEach(ticketRequired => {
        _constTicketAssignmentRequiredElements[j] = ticketRequired.ticketRequiredParticipant
        j++
      })
    },

    setPresentParticipantObject (_participantId, _matchName, _participant, _participantAvatar, _participantAvatarIsCustomized, _arrival, _annotations, _action, _reaction) {
      this.presentParticipantObject.push({ presentParticipantParticipantId: _participantId, presentParticipantMatchName: _matchName, presentParticipantParticipant: _participant, presentParticipantParticipantAvatar: _participantAvatar, presentParticipantParticipantAvatarIsCustomized: _participantAvatarIsCustomized, presentParticipantArrival: _arrival, presentParticipantAnnotations: _annotations, presentParticipantAction: _action, presentParticipantReaction: _reaction })
    },

    setTicketObject (_participantId, _participant, _arrival, _annotations, _action, _reaction) {
      this.ticketObject.push({ ticketParticipantId: _participantId, ticketParticipant: _participant, ticketArrival: _arrival, ticketAnnotations: _annotations, ticketAction: _action, ticketReaction: _reaction })
    },

    setTicketGivenObject (_participantId, _participant) {
      this.ticketGivenObject.push({ ticketGivenParticipantId: _participantId, ticketGivenParticipant: _participant })
    },

    setTicketRequiredObject (_participantId, _participant) {
      this.ticketRequiredObject.push({ ticketRequiredParticipantId: _participantId, ticketRequiredParticipant: _participant })
    },

    setTicketAssignedObject (_participantId, _participant) {
      this.ticketAssignedObject.push({ ticketAssignedParticipantId: _participantId, ticketAssignedParticipant: _participant })
    },

    getTableWhereIsMyCard () {
      this.whereIsMyCardObject = []
      this.$axios.get(`${_URLWhereIsMyCard}/${_TenantId}`)
        .then((res) => {
          if (res.status === 200) {
            for (let index = 0; index < res.data.length; index++) {
              this.setWhereIsMyCardObject(res.data[index].name, res.data[index].isDiscounted, res.data[index].whoHasTheCard)
            }
          } else {
            console.log('Unexpected status code:', res.status)
          }
        })
        .catch((err) => console.log(err))
    },

    setWhereIsMyCardObject (_cardHolder, _discounted, _whoHasTheCard) {
      this.whereIsMyCardObject.push({ cardHolder: _cardHolder, discounted: _discounted, whoHasTheCard: _whoHasTheCard })
    },

    setArrivalElements (_doorOpeningTime) {
      const hour = _doorOpeningTime.substring(0, 2)
      const minute = _doorOpeningTime.substring(3, 5)
      const minuteInterval = 15
      _constArrivalElements[1] = ''

      for (let index = 0; index <= 8; index++) {
        const _minutes = parseInt(minuteInterval * index)
        switch (minute) {
          case '00':
            if (_minutes === 0) _constArrivalElements[index + 2] = parseInt(hour) + ':00'
            if (_minutes === 15) _constArrivalElements[index + 2] = parseInt(hour) + ':15'
            if (_minutes === 30) _constArrivalElements[index + 2] = parseInt(hour) + ':30'
            if (_minutes === 45) _constArrivalElements[index + 2] = parseInt(hour) + ':45'
            if (_minutes === 60) _constArrivalElements[index + 2] = parseInt(hour) + 1 + ':00'
            if (_minutes === 75) _constArrivalElements[index + 2] = parseInt(hour) + 1 + ':15'
            if (_minutes === 90) _constArrivalElements[index + 2] = parseInt(hour) + 1 + ':30'
            if (_minutes === 105) _constArrivalElements[index + 2] = parseInt(hour) + 1 + ':45'
            if (_minutes === 120) _constArrivalElements[index + 2] = parseInt(hour) + 2 + ':00'
            break
          case '15':
            if (_minutes === 0) _constArrivalElements[index + 2] = parseInt(hour) + ':15'
            if (_minutes === 15) _constArrivalElements[index + 2] = parseInt(hour) + ':30'
            if (_minutes === 30) _constArrivalElements[index + 2] = parseInt(hour) + ':45'
            if (_minutes === 45) _constArrivalElements[index + 2] = parseInt(hour) + 1 + ':00'
            if (_minutes === 60) _constArrivalElements[index + 2] = parseInt(hour) + 1 + ':15'
            if (_minutes === 75) _constArrivalElements[index + 2] = parseInt(hour) + 1 + ':30'
            if (_minutes === 90) _constArrivalElements[index + 2] = parseInt(hour) + 1 + ':45'
            if (_minutes === 105) _constArrivalElements[index + 2] = parseInt(hour) + 2 + ':00'
            if (_minutes === 120) _constArrivalElements[index + 2] = parseInt(hour) + 2 + ':15'
            break
          case '30':
            if (_minutes === 0) _constArrivalElements[index + 2] = parseInt(hour) + ':30'
            if (_minutes === 15) _constArrivalElements[index + 2] = parseInt(hour) + ':45'
            if (_minutes === 30) _constArrivalElements[index + 2] = parseInt(hour) + 1 + ':00'
            if (_minutes === 45) _constArrivalElements[index + 2] = parseInt(hour) + 1 + ':15'
            if (_minutes === 60) _constArrivalElements[index + 2] = parseInt(hour) + 1 + ':30'
            if (_minutes === 75) _constArrivalElements[index + 2] = parseInt(hour) + 1 + ':45'
            if (_minutes === 90) _constArrivalElements[index + 2] = parseInt(hour) + 2 + ':00'
            if (_minutes === 105) _constArrivalElements[index + 2] = parseInt(hour) + 2 + ':15'
            if (_minutes === 120) _constArrivalElements[index + 2] = parseInt(hour) + 2 + ':30'
            break
          case '45':
            if (_minutes === 0) _constArrivalElements[index + 2] = parseInt(hour) + ':45'
            if (_minutes === 15) _constArrivalElements[index + 2] = parseInt(hour) + 1 + ':00'
            if (_minutes === 30) _constArrivalElements[index + 2] = parseInt(hour) + 1 + ':15'
            if (_minutes === 45) _constArrivalElements[index + 2] = parseInt(hour) + 1 + ':30'
            if (_minutes === 60) _constArrivalElements[index + 2] = parseInt(hour) + 1 + ':45'
            if (_minutes === 75) _constArrivalElements[index + 2] = parseInt(hour) + 2 + ':00'
            if (_minutes === 90) _constArrivalElements[index + 2] = parseInt(hour) + 2 + ':15'
            if (_minutes === 105) _constArrivalElements[index + 2] = parseInt(hour) + 2 + ':30'
            if (_minutes === 120) _constArrivalElements[index + 2] = parseInt(hour) + 2 + ':45'
            break
          default:
            break
        }
      }
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

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 500px
</style>
