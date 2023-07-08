<template>
  <q-page>
    <div class="q-pa-md">
      <q-btn-dropdown
        split
        color="primary"
        push
        glossy
        no-caps
        icon="star"
        label="Spiel auswählen">

        <q-list v-for="(match, i) in activeMatchObject"
          :key="i"
          v-ripple>
          <q-item clickable v-close-popup @click="onMatchClick(match.matchId, match.homeTeam, match.awayTeam, match.matchName, match.time, match.annotations, match.date)">
            <q-item-section>
              <q-item-label>{{ match.matchName }}</q-item-label>
              <q-item-label caption>{{ match.date }} - {{ match.time }}</q-item-label>
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
    <div class="q-pa-md" style="max-width: 500px" v-if="getCookie('isAdministrator') === 'true'" >
      <q-btn class="bg-white text-primary" icon="share" label="Übersicht teilen" @click="setTextShare(txtMatchName)" />
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
        <q-item clickable v-ripple @click="onParticipantClick(el.presentParticipantRow, el.presentParticipantParticipantId, el.presentParticipantParticipant, el.presentParticipantArrival, el.presentParticipantAnnotations, el.presentParticipantAction, el.presentParticipantReaction)">
          <q-item-section avatar>
            <q-avatar size="70px" color="deep-orange-14" text-color="white" v-if="el.presentParticipantParticipantAvatar === ''">
              {{ el.presentParticipantParticipant.substring(0, 1) }}
              <q-badge floating color="teal" v-if="isReservation(el.presentParticipantArrival, txtTime)">reserviert</q-badge>
            </q-avatar>
            <q-avatar size="70px" v-if="el.presentParticipantParticipantAvatar !== ''">
              <img :src="getAvatar(el.presentParticipantParticipantAvatar, el.presentParticipantParticipantAvatarIsCustomized === 'TRUE')">
              <q-badge floating color="teal" v-if="isReservation(el.presentParticipantArrival, txtTime)">reserviert</q-badge>
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
      <div class="q-pa-md" style="max-width: 470px">
        <q-toolbar class="bg-primary text-white">
            <q-toolbar-title class="text-overline">Karte weitergeben ({{ ticketGivenObject.length }}) oder bedarf ({{ ticketRequiredObject.length }})</q-toolbar-title>
            <q-btn class="bg-white text-primary" icon="credit_card" label="Zuweisung" @click="addTicketAssignment = true" v-if="getCookie('isAdministrator') === 'true'" />
        </q-toolbar>
      </div>

      <!-- List of ticket assignments -->
      <q-list dark bordered separator style="max-width: 470px" v-for="(ticket, i) in ticketObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onTicketAssignmentClick(ticket.ticketRow, ticket.ticketParticipantId, ticket.ticketParticipant, ticket.ticketArrival, ticket.ticketAnnotations, ticket.ticketAction, ticket.ticketReaction)">
          <q-item-section>
            <q-item-label overline v-if="ticket.ticketAction === 'brauche Karte'">??? an {{ ticket.ticketParticipant }}</q-item-label>
            <q-item-label overline v-if="ticket.ticketAction === 'meine Karte ist frei' && ticket.ticketReaction === ''">{{ ticket.ticketParticipant }} an ???</q-item-label>
            <q-item-label overline v-if="ticket.ticketAction === 'meine Karte ist frei' && ticket.ticketReaction !== ''">{{ ticket.ticketParticipant }} an {{ ticket.ticketReaction }}</q-item-label>
            <q-item-label caption>{{ ticket.ticketAnnotations }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Dialogs -->
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
            <q-input dense v-model="txtParticipantNew" autofocus label="Name" />
            <q-select v-model="txtActionNew" :options="cbxActionOptions" label="Aktion" />
            <q-select v-model="txtArrivalNew" :options="cbxArrivalOptions" label="Ankunft" v-if="txtActionNew === 'bin dabei'" />
            <div class="q-pt-md" style="max-width: 350px">
              <q-input v-model="txtAnnotationsParticipantNew" filled type="textarea" label="Kommentar"/>
            </div>

          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addParticipantSave(txtParticipantNew, txtArrivalNew, txtAnnotationsParticipantNew, txtActionNew, txtMatchName, txtMatchId, txtTime, txtAnnotationsMatchOriginal)" :disable="txtParticipantNew === ''" v-close-popup />
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
            <q-input dense v-model="txtParticipantParticipant" autofocus label="Name" :readonly="false" v-if="txtParticipantReaction === ''" />
            <q-input dense v-model="txtParticipantParticipant" autofocus label="Name" :readonly="true" v-if="txtParticipantReaction !== ''" />
            <q-select v-model="txtParticipantAction" :options="cbxActionOptions" label="Aktion" :readonly="false" v-if="txtParticipantReaction === ''" />
            <q-select v-model="txtParticipantAction" :options="cbxActionOptions" label="Aktion" :readonly="true" v-if="txtParticipantReaction !== ''" />
            <q-select v-model="txtParticipantArrival" :options="cbxArrivalOptions" label="Ankunft" v-if="txtParticipantAction === 'bin dabei'" />
            <q-input class="text-italic" dense v-model="txtParticipantReaction" :readonly="true" v-if="txtParticipantReaction !== ''" />
            <div class="q-pt-md" style="max-width: 350px">
              <q-input v-model="txtParticipantAnnotations" filled type="textarea" label="Kommentar"/>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" color="primary" @click="delParticipant = true" v-if="getCookie('isAdministrator') === 'true' && txtParticipantReaction === ''" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editParticipantSave(intParticipantRow, txtParticipantId, txtParticipantParticipant, txtParticipantParticipantOld, txtParticipantArrival, txtParticipantAnnotations, txtParticipantAction, txtMatchId, txtTime, txtAnnotationsMatchOriginal)" :disable="txtParticipantParticipant === ''" v-close-popup />
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
            <q-btn flat label="Ja" color="primary" @click="deleteParticipant(intParticipantRow, txtParticipantId, txtMatchId, txtTime, txtAnnotationsMatchOriginal)" v-close-popup />
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
            <q-btn icon="save" label="Speichern" @click="addTicketAssignmentSave(txtTicketAssignmentGiven, txtTicketAssignmentRequired, txtMatchId, txtTime, txtAnnotationsMatchOriginal)" :disable="txtTicketAssignmentGiven === '' || txtTicketAssignmentRequired === ''" v-close-popup />
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
            <q-input dense v-model="txtTicketParticipant" autofocus label="Name" />
            <q-select v-model="txtTicketAction" :options="cbxActionOptions" label="Aktion" />
            <div class="q-pt-md" style="max-width: 350px">
              <q-input v-model="txtTicketAnnotations" filled type="textarea" label="Kommentar"/>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" color="primary" @click="delTicketAssignment = true" v-if="getCookie('isAdministrator') === 'true'" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editTicketAssignmentSave(intTicketParticipantRow, txtTicketParticipantId, txtTicketParticipant, txtTicketParticipantOld, txtTicketArrival, txtTicketAnnotations, txtTicketAction, txtMatchId, txtTime, txtAnnotationsMatchOriginal)" :disable="txtTicketParticipant === ''" v-close-popup />
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
            <q-btn icon="swipe_left" label="Aufheben" color="primary" @click="delTicketAssigned = true" v-if="getCookie('isAdministrator') === 'true'" />
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
            <q-btn flat label="Ja" color="primary" @click="deleteTicketAssignment(intTicketParticipantRow, txtTicketParticipantId, txtMatchId, txtTime, txtAnnotationsMatchOriginal)" v-close-popup />
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
            <q-btn flat label="Ja" color="primary" @click="deleteTicketAssigned(txtTicketAssignedGiven, txtTicketAssignedRequired, txtMatchId, txtTime, txtAnnotationsMatchOriginal)" v-close-popup />
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
import { getCookie, getAvatar, teamImages, getTeamImage, getEventImage, URLMatchBasis, URLParticipantBasis, URLWhereIsMyCardBasis, URLMemberBasis } from 'src/boot/utils.js'
import { ref } from 'vue'

const _constMatchId = ref('')
const _constHomeTeam = ref('')
const _constAwayTeam = ref('')
const _constMatchName = ref('')
const _constTime = ref('')
const _constAnnotationsMatchOriginal = ref('')
const _constAnnotationsMatch = ref('')
const _constArrivalElements = []

const _constParticipantRow = ref(0)
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
const _constTicketList = ref('')
const _constShare = ref('')

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
      txtTime: ref(_constTime),
      txtAnnotationsMatchOriginal: ref(_constAnnotationsMatchOriginal),
      txtAnnotationsMatch: ref(_constAnnotationsMatch),
      cbxArrivalOptions: ref(_constArrivalElements),

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

      intParticipantRow: ref(_constParticipantRow),
      txtParticipantId: ref(_constParticipantId),
      txtParticipantParticipant: ref(_constParticipantParticipant),
      txtParticipantParticipantOld: ref(_constParticipantParticipantOld),
      txtParticipantArrival: ref(_constParticipantArrival),
      txtParticipantAnnotations: ref(_constParticipantAnnotations),
      txtParticipantAction: ref(_constParticipantAction),
      txtParticipantReaction: ref(_constParticipantReaction),

      cbxActionOptions: ['bin dabei', 'brauche Karte', 'meine Karte ist frei'],

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
      getCookie,
      getAvatar,
      teamImages,
      getTeamImage,
      getEventImage,
      URLMatchBasis,
      URLParticipantBasis,
      URLWhereIsMyCardBasis,
      URLMemberBasis,

      activeMatchObject: [
        {
          matchId: '',
          homeTeam: '',
          awayTeam: '',
          matchName: '',
          time: '',
          annotations: '',
          date: ''
        }
      ],

      participantObject: [
        {
          row: '',
          participantId: '',
          timestamp: '',
          matchName: '',
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
          presentParticipantRow: '',
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
          ticketRow: '',
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
          ticketGivenRow: '',
          ticketGivenParticipantId: '',
          ticketGivenParticipant: ''
        }
      ],

      ticketRequiredObject: [
        {
          ticketRequiredRow: '',
          ticketRequiredParticipantId: '',
          ticketRequiredParticipant: ''
        }
      ],

      ticketAssignedObject: [
        {
          ticketAssignedRow: '',
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
    this.setVariables()
    this.getTableMember()
    this.getTableActiveMatch()
    this.getTableWhereIsMyCard()
  },

  methods: {
    setVariables () {
      _URLMatch = URLMatchBasis + '?sh=' + getCookie('client')
      _URLParticipant = URLParticipantBasis + '?sh=' + getCookie('client')
      _URLWhereIsMyCard = URLWhereIsMyCardBasis + '?sh=' + getCookie('client')
      _URLMember = URLMemberBasis + '?sh=' + getCookie('client')
    },

    isReservation (_participantArrival, _matchTime) {
      if (_participantArrival !== '') {
        if (parseInt(_participantArrival.substring(0, 2)) === parseInt(_matchTime.substring(0, 2) - 2) &&
        _participantArrival.substring(3, 5) === _matchTime.substring(3, 5)) { return true } else { return false }
      }
      return false
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

    getTableActiveMatch () {
      this.activeMatchObject = []

      // console.log('URLMatch: ' + _URLMatch + '&func=ReadActive&published=TRUE')
      this.$axios(`${_URLMatch}&func=ReadActive&published=TRUE`)
        .then((res) => {
          this.tableMatch = res.data.split('\n')
          for (let index = 0; index < this.tableMatch.length - 1; index++) {
            const element = this.tableMatch[index].split(',')
            this.setActiveMatchObject(element[1], element[3].trim(), element[4].trim(), element[5].trim(), element[7].substring(0, 5), element[8].trim().replace(/<br>/g, '\n'), element[9])
          }

          this.onMatchClick(this.activeMatchObject[0].matchId, this.activeMatchObject[0].homeTeam, this.activeMatchObject[0].awayTeam, this.activeMatchObject[0].matchName, this.activeMatchObject[0].time, this.activeMatchObject[0].annotations, this.activeMatchObject[0].date)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setActiveMatchObject (_matchId, _homeTeam, _awayTeam, _matchName, _time, _annotations, _date) {
      this.activeMatchObject.push({ matchId: _matchId, homeTeam: _homeTeam, awayTeam: _awayTeam, matchName: _matchName, time: _time, annotations: _annotations, date: _date })

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

    onMatchClick (_matchId, _homeTeam, _awayTeam, _matchName, _time, _annotationsMatch, _date) {
      // console.log('onMatchClick: ' + _matchId + ', ' + _homeTeam + ', ' + _awayTeam + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch + ', ' + _date)
      _constMatchId.value = _matchId
      _constHomeTeam.value = _homeTeam
      _constAwayTeam.value = _awayTeam
      _constMatchName.value = _matchName.trim() + ' ' + _date.substring(0, 6) + _date.substring(8, 10) + ' - ' + _time.substring(0, 5)
      _constTime.value = _time

      this.loadReloadData(_matchId, _time, _annotationsMatch)
    },

    loadReloadData (_matchId, _time, _annotationsMatch) {
      // console.log('loadReloadData: ' + _matchId + ', ' + _time + ', ' + _annotationsMatch)
      this.setArrivalElements(_time)
      this.getTableParticipant(_matchId, _time, _annotationsMatch)
    },

    setTextShare (_matchName) {
      _constShare.value = _matchName + '\n\nAnwesend (' + this.presentParticipantObject.length + '):\n' + _constParticipantList.value
      _constShare.value += '\nKarte weitergeben (' + this.ticketGivenObject.length + ') oder bedarf (' + this.ticketRequiredObject.length + '):\n' + _constTicketList.value
      _constShare.value += '\n' + _constAnnotationsMatch.value
      this.share = true
    },

    onParticipantClick (_row, _participantId, _participant, _arrival, _annotations, _action, _reaction) {
      // console.log('Clicked on Participant: ' + _participantId + ', ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _reaction)
      _constParticipantRow.value = _row
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
      // console.log('addParticipantSave: ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _matchName + ', ' + _matchId + ', ' + _time + ', ' + _annotationsMatch)

      if (_action !== 'bin dabei') _arrival = ''

      const _participants = this.participantObject.map(el => el.participant)
      const _participantExists = _participants.includes(_participant)
      if (_participantExists) {
        this.onParticipantAlreadyExists()
      } else {
        this.$axios(`${_URLParticipant}&func=Add&match=${_matchName}&participant=${encodeURI(_participant.replace(',', ' '))}&arrival=${_arrival}&annotations=${encodeURI(_annotations.replace(',', ';').replace(/(?:\r\n|\r|\n)/g, '<br>'))}&action=${_action}&reaction=&matchId=${_matchId}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.onParticipantCreated()
              this.loadReloadData(_matchId, _time, _annotationsMatch)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    editParticipantSave (_row, _participantId, _participant, _participantOld, _arrival, _annotations, _action, _matchId, _time, _annotationsMatch) {
      // console.log('editParticipantSave: ' + _row + ', ' + _participantId + ', ' + _participant + ', ' + _participantOld + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _matchId + ', ' + _time + ', ' + _annotationsMatch)

      if (_action !== 'bin dabei') _arrival = ''

      const _participants = this.participantObject.map(el => el.participant)
      const _participantExists = _participants.includes(_participant) && _participant !== _participantOld
      if (_participantExists) {
        this.onParticipantAlreadyExists()
      } else {
        this.$axios(`${_URLParticipant}&func=Update&row=${_row}&participantId=${_participantId}&participant=${encodeURI(_participant.replace(',', ' '))}&arrival=${_arrival}&annotations=${encodeURI(_annotations.replace(',', ';').replace(/(?:\r\n|\r|\n)/g, '<br>'))}&action=${_action}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.onParticipantUpdated()
              this.loadReloadData(_matchId, _time, _annotationsMatch)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    deleteParticipant (_row, _participantId, _matchId, _time, _annotationsMatch) {
      // console.log('deleteParticipant: ' + _row + ', ' + _participantId + ', ' + _matchId + ', ' + _time + ', ' + _annotationsMatch)

      this.$axios(`${_URLParticipant}&func=Delete&row=${_row}&participantId=${_participantId}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.editParticipant = false
            this.onParticipantDeleted()
            this.loadReloadData(_matchId, _time, _annotationsMatch)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    onTicketAssignmentClick (_ticketRow, _ticketParticipantId, _participant, _arrival, _annotations, _action, _reaction) {
      // console.log('Clicked on ticket assignment: ' + _ticketRow + ', ' + _ticketParticipantId + ', ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _reaction)
      _constTicketParticipantRow.value = _ticketRow
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

    addTicketAssignmentSave (_ticketAssignmentGiven, _ticketAssignmentRequired, _matchId, _time, _annotationsMatch) {
      // console.log('addTicketAssignmentSave: ' + _ticketAssignmentGiven + ', ' + _ticketAssignmentRequired + ', ' + _matchId + ', ' + _time + ', ' + _annotationsMatch)

      const _ticketGivenRow = this.ticketGivenObject.find(el => el.ticketGivenParticipant === _ticketAssignmentGiven)?.ticketGivenRow
      const _ticketGivenParticipantId = this.ticketGivenObject.find(el => el.ticketGivenParticipant === _ticketAssignmentGiven)?.ticketGivenParticipantId
      if (typeof _ticketGivenParticipantId !== 'undefined') {
        this.$axios(`${_URLParticipant}&func=UpdateTicketGiven&row=${_ticketGivenRow}&participantId=${_ticketGivenParticipantId}&reaction=${_ticketAssignmentRequired}`)
          .catch((err) => {
            console.log(err)
          })

        const _ticketRequiredRow = this.ticketRequiredObject.find(el => el.ticketRequiredParticipant === _ticketAssignmentRequired)?.ticketRequiredRow
        const _ticketRequiredParticipantId = this.ticketRequiredObject.find(el => el.ticketRequiredParticipant === _ticketAssignmentRequired)?.ticketRequiredParticipantId
        if (typeof _ticketRequiredParticipantId !== 'undefined') {
          this.$axios(`${_URLParticipant}&func=UpdateTicketRequired&row=${_ticketRequiredRow}&participantId=${_ticketRequiredParticipantId}&action=bin dabei&reaction=${_ticketAssignmentGiven}`)
            .then((res) => {
              if (res.data === 'Success, requested action completed') {
                this.onAssignmentCreated()
                this.loadReloadData(_matchId, _time, _annotationsMatch)
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }
      }
    },

    deleteTicketAssigned (_ticketAssignedGiven, _ticketAssignedRequired, _matchId, _time, _annotationsMatch) {
      // console.log('deleteTicketAssigned: ' + _ticketAssignedGiven + ', ' + _ticketAssignedRequired + ', ' + _matchId + ', ' + _time + ', ' + _annotationsMatch)

      const _ticketGivenRow = this.ticketAssignedObject.find(el => el.ticketAssignedParticipant === _ticketAssignedGiven)?.ticketAssignedRow
      const _ticketAssignedGivenParticipantId = this.ticketAssignedObject.find(el => el.ticketAssignedParticipant === _ticketAssignedGiven)?.ticketAssignedParticipantId
      if (typeof _ticketAssignedGivenParticipantId !== 'undefined') {
        this.$axios(`${_URLParticipant}&func=UpdateTicketGiven&row=${_ticketGivenRow}&participantId=${_ticketAssignedGivenParticipantId}&reaction=`)
          .catch((err) => {
            console.log(err)
          })

        const _ticketRequiredRow = this.ticketAssignedObject.find(el => el.ticketAssignedParticipant === _ticketAssignedRequired)?.ticketAssignedRow
        const _ticketAssignedRequiredParticipantId = this.ticketAssignedObject.find(el => el.ticketAssignedParticipant === _ticketAssignedRequired)?.ticketAssignedParticipantId
        if (typeof _ticketAssignedRequiredParticipantId !== 'undefined') {
          this.$axios(`${_URLParticipant}&func=UpdateTicketRequired&row=${_ticketRequiredRow}&participantId=${_ticketAssignedRequiredParticipantId}&action=brauche Karte&reaction=`)
            .then((res) => {
              if (res.data === 'Success, requested action completed') {
                this.editTicketAssigned = false
                this.OnTicketAssignedDeleted()
                this.loadReloadData(_matchId, _time, _annotationsMatch)
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }
      }
    },

    editTicketAssignmentSave (_ticketRow, _ticketParticipantId, _participant, _participantOld, _arrival, _annotations, _action, _matchId, _time, _annotationsMatch) {
      // console.log('editTicketAssignmentSave: ' + _ticketRow + ', ' + _ticketParticipantId + ', ' + _participant + ', ' + _participantOld + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _matchId + ', ' + _time + ', ' + _annotationsMatch)

      if (_action !== 'bin dabei') _arrival = ''

      const _participants = this.ticketObject.map(el => el.ticketParticipant)
      const _participantExists = _participants.includes(_participant) && _participant !== _participantOld
      if (_participantExists) {
        this.onParticipantAlreadyExists()
      } else {
        this.$axios(`${_URLParticipant}&func=Update&row=${_ticketRow}&participantId=${_ticketParticipantId}&participant=${encodeURI(_participant.replace(',', ' '))}&arrival=${_arrival}&annotations=${encodeURI(_annotations.replace(',', ';').replace(/(?:\r\n|\r|\n)/g, '<br>'))}&action=${_action}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.editTicketAssignment = false
              this.onTicketAssigmentUpdated()
              this.loadReloadData(_matchId, _time, _annotationsMatch)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    deleteTicketAssignment (_ticketRow, _ticketParticipantId, _matchId, _time, _annotationsMatch) {
      // console.log('deleteTicketAssignment: ' + _ticketRow + ', ' + _ticketParticipantId + ', ' + _matchId + ', ' + _time + ', ' + _annotationsMatch)
      this.$axios(`${_URLParticipant}&func=Delete&row=${_ticketRow}&participantId=${_ticketParticipantId}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.editTicketAssignment = false
            this.onTicketAssigmentDeleted()
            this.loadReloadData(_matchId, _time, _annotationsMatch)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    getTableParticipant (_matchId, _time, _annotationsMatch) {
      this.participantObject = []

      // console.log('URLParticipant: ' + _URLParticipant + '&func=Read&matchId=' + _matchId)
      this.$axios(`${_URLParticipant}&func=Read&matchId=${_matchId}`)
        .then((res) => {
          this.tableParticipant = res.data.split('\n')
          for (let index = 0; index < this.tableParticipant.length - 1; index++) {
            const element = this.tableParticipant[index].split(',')

            let _participantAvatar = this.memberObject.find(el => el.member === element[5].trim())?.avatar
            if (typeof _participantAvatar === 'undefined') _participantAvatar = ''
            let _participantAvatarIsCustomized = this.memberObject.find(el => el.member === element[5].trim())?.customized
            if (typeof _participantAvatarIsCustomized === 'undefined') _participantAvatarIsCustomized = 'FALSE'

            this.setParticipantObject(element[0], element[1], element[3], element[4], element[5].trim(), _participantAvatar, _participantAvatarIsCustomized, element[6].substring(0, 5), element[7].replace(/<br>/g, '\n'), element[8], element[9])
          }

          this.fillObjects(_matchId, _time, _annotationsMatch)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setParticipantObject (_row, _participantId, _timestamp, _matchName, _participant, _participantAvatar, _participantAvatarIsCustomized, _arrival, _annotations, _action, _reaction) {
      this.participantObject.push({ row: parseInt(_row), participantId: _participantId, timestamp: _timestamp, matchName: _matchName, participant: _participant, participantAvatar: _participantAvatar, participantAvatarIsCustomized: _participantAvatarIsCustomized, arrival: _arrival, annotations: _annotations, action: _action, reaction: _reaction })

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

    fillObjects (_matchId, _time, _annotationsMatch) {
      this.presentParticipantObject = []
      this.ticketObject = []
      this.ticketGivenObject = []
      this.ticketRequiredObject = []
      this.ticketAssignedObject = []

      this.reservation = ''

      this.participantObject.forEach(el => {
        if (el.action === 'bin dabei') this.setPresentParticipantObject(el.row, el.participantId, el.matchName, el.participant, el.participantAvatar, el.participantAvatarIsCustomized, el.arrival, el.annotations, el.action, el.reaction)

        if (el.action === 'meine Karte ist frei' || (el.action === 'brauche Karte' && el.reaction === '')) this.setTicketObject(el.row, el.participantId, el.participant, el.arrival, el.annotations, el.action, el.reaction)

        if (el.action === 'meine Karte ist frei' && el.reaction === '') this.setTicketGivenObject(el.row, el.participantId, el.participant)

        if (el.action === 'brauche Karte' && el.reaction === '') this.setTicketRequiredObject(el.row, el.participantId, el.participant)

        if (el.reaction !== '') this.setTicketAssignedObject(el.row, el.participantId, el.participant)
      })

      _constParticipantList.value = ''
      this.presentParticipantObject.forEach(el => {
        _constParticipantList.value += el.presentParticipantParticipant.trim()

        _constParticipantList.value += ' (' + el.presentParticipantArrival + ')'
        if (this.isReservation(el.presentParticipantArrival, _time)) {
          if (this.reservation !== '') this.reservation += ', '
          this.reservation += el.presentParticipantParticipant.trim()
        }

        if (el.presentParticipantAnnotations !== '') _constParticipantList.value += ' (' + el.presentParticipantAnnotations.trim().replace(/\n/g, ' / ') + ')'

        if (el.presentParticipantReaction !== '') {
          const _whoHasTheCard = this.whereIsMyCardObject.find(el2 => el2.cardHolder === el.presentParticipantReaction)?.whoHasTheCard
          if (typeof _whoHasTheCard !== 'undefined') {
            el.presentParticipantReaction = el.presentParticipantReaction.trim() + ' (Karte bei ' + _whoHasTheCard + ')'
          }
          el.presentParticipantReaction = 'habe Karte von ' + el.presentParticipantReaction.trim()
          _constParticipantList.value += ', ' + el.presentParticipantReaction.trim()
        }

        _constParticipantList.value += '\n'
      })

      if (this.reservation !== '') this.reservation += ','

      const _standardText = getCookie('standardText').replace('<HH>', parseInt(_time.substring(0, 2) - 2)).replace('<MM>', _time.substring(3, 5)).replace('<WHO_RESERVES_PLACES>', this.reservation)

      _constAnnotationsMatchOriginal.value = _annotationsMatch
      _constAnnotationsMatch.value = _annotationsMatch.replace(/<br>/g, '\n').replace('<STANDARDTEXT>', _standardText)

      _constTicketList.value = ''
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

    setPresentParticipantObject (_row, _participantId, _matchName, _participant, _participantAvatar, _participantAvatarIsCustomized, _arrival, _annotations, _action, _reaction) {
      this.presentParticipantObject.push({ presentParticipantRow: _row, presentParticipantParticipantId: _participantId, presentParticipantMatchName: _matchName, presentParticipantParticipant: _participant, presentParticipantParticipantAvatar: _participantAvatar, presentParticipantParticipantAvatarIsCustomized: _participantAvatarIsCustomized, presentParticipantArrival: _arrival, presentParticipantAnnotations: _annotations, presentParticipantAction: _action, presentParticipantReaction: _reaction })
    },

    setTicketObject (_row, _participantId, _participant, _arrival, _annotations, _action, _reaction) {
      this.ticketObject.push({ ticketRow: _row, ticketParticipantId: _participantId, ticketParticipant: _participant, ticketArrival: _arrival, ticketAnnotations: _annotations, ticketAction: _action, ticketReaction: _reaction })
    },

    setTicketGivenObject (_row, _participantId, _participant) {
      this.ticketGivenObject.push({ ticketGivenRow: _row, ticketGivenParticipantId: _participantId, ticketGivenParticipant: _participant })
    },

    setTicketRequiredObject (_row, _participantId, _participant) {
      this.ticketRequiredObject.push({ ticketRequiredRow: _row, ticketRequiredParticipantId: _participantId, ticketRequiredParticipant: _participant })
    },

    setTicketAssignedObject (_row, _participantId, _participant) {
      this.ticketAssignedObject.push({ ticketAssignedRow: _row, ticketAssignedParticipantId: _participantId, ticketAssignedParticipant: _participant })
    },

    getTableWhereIsMyCard () {
      this.whereIsMyCardObject = []

      // console.log('URLWhereIsMyCard: ' + _URLWhereIsMyCard + '&func=Read')
      this.$axios(`${_URLWhereIsMyCard}&func=Read`)
        .then((res) => {
          this.tableWhereIsMyCard = res.data.split('\n')
          for (let index = 0; index < this.tableWhereIsMyCard.length - 1; index++) {
            const element = this.tableWhereIsMyCard[index].split(',')
            this.setWhereIsMyCardObject(element[3], element[4], element[5])
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setWhereIsMyCardObject (_cardHolder, _discounted, _whoHasTheCard) {
      this.whereIsMyCardObject.push({ cardHolder: _cardHolder, discounted: _discounted, whoHasTheCard: _whoHasTheCard })
    },

    setArrivalElements (_time) {
      const hour = _time.substring(0, 2)
      const minute = _time.substring(3, 5)
      const minuteInterval = 15
      _constArrivalElements[1] = ''

      for (let index = 0; index <= 8; index++) {
        const _minutes = parseInt(minuteInterval * index)
        switch (minute) {
          case '00':
            if (_minutes === 0) _constArrivalElements[index + 2] = parseInt(hour) - 2 + ':00'
            if (_minutes === 15) _constArrivalElements[index + 2] = parseInt(hour) - 2 + ':15'
            if (_minutes === 30) _constArrivalElements[index + 2] = parseInt(hour) - 2 + ':30'
            if (_minutes === 45) _constArrivalElements[index + 2] = parseInt(hour) - 2 + ':45'
            if (_minutes === 60) _constArrivalElements[index + 2] = parseInt(hour) - 1 + ':00'
            if (_minutes === 75) _constArrivalElements[index + 2] = parseInt(hour) - 1 + ':15'
            if (_minutes === 90) _constArrivalElements[index + 2] = parseInt(hour) - 1 + ':30'
            if (_minutes === 105) _constArrivalElements[index + 2] = parseInt(hour) - 1 + ':45'
            if (_minutes === 120) _constArrivalElements[index + 2] = parseInt(hour) - 0 + ':00'
            break
          case '15':
            if (_minutes === 0) _constArrivalElements[index + 2] = parseInt(hour) - 2 + ':15'
            if (_minutes === 15) _constArrivalElements[index + 2] = parseInt(hour) - 2 + ':30'
            if (_minutes === 30) _constArrivalElements[index + 2] = parseInt(hour) - 2 + ':45'
            if (_minutes === 45) _constArrivalElements[index + 2] = parseInt(hour) - 1 + ':00'
            if (_minutes === 60) _constArrivalElements[index + 2] = parseInt(hour) - 1 + ':15'
            if (_minutes === 75) _constArrivalElements[index + 2] = parseInt(hour) - 1 + ':30'
            if (_minutes === 90) _constArrivalElements[index + 2] = parseInt(hour) - 1 + ':45'
            if (_minutes === 105) _constArrivalElements[index + 2] = parseInt(hour) - 0 + ':00'
            if (_minutes === 120) _constArrivalElements[index + 2] = parseInt(hour) - 0 + ':15'
            break
          case '30':
            if (_minutes === 0) _constArrivalElements[index + 2] = parseInt(hour) - 2 + ':30'
            if (_minutes === 15) _constArrivalElements[index + 2] = parseInt(hour) - 2 + ':45'
            if (_minutes === 30) _constArrivalElements[index + 2] = parseInt(hour) - 1 + ':00'
            if (_minutes === 45) _constArrivalElements[index + 2] = parseInt(hour) - 1 + ':15'
            if (_minutes === 60) _constArrivalElements[index + 2] = parseInt(hour) - 1 + ':30'
            if (_minutes === 75) _constArrivalElements[index + 2] = parseInt(hour) - 1 + ':45'
            if (_minutes === 90) _constArrivalElements[index + 2] = parseInt(hour) - 0 + ':00'
            if (_minutes === 105) _constArrivalElements[index + 2] = parseInt(hour) - 0 + ':15'
            if (_minutes === 120) _constArrivalElements[index + 2] = parseInt(hour) - 0 + ':30'
            break
          case '45':
            if (_minutes === 0) _constArrivalElements[index + 2] = parseInt(hour) - 2 + ':45'
            if (_minutes === 15) _constArrivalElements[index + 2] = parseInt(hour) - 1 + ':00'
            if (_minutes === 30) _constArrivalElements[index + 2] = parseInt(hour) - 1 + ':15'
            if (_minutes === 45) _constArrivalElements[index + 2] = parseInt(hour) - 1 + ':30'
            if (_minutes === 60) _constArrivalElements[index + 2] = parseInt(hour) - 1 + ':45'
            if (_minutes === 75) _constArrivalElements[index + 2] = parseInt(hour) - 0 + ':00'
            if (_minutes === 90) _constArrivalElements[index + 2] = parseInt(hour) - 0 + ':15'
            if (_minutes === 105) _constArrivalElements[index + 2] = parseInt(hour) - 0 + ':30'
            if (_minutes === 120) _constArrivalElements[index + 2] = parseInt(hour) - 0 + ':45'
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
