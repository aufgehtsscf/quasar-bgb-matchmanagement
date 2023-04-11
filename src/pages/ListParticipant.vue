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

        <q-list v-for="(match, i) in matchObject"
          :key="i"
          v-ripple>
          <q-item clickable v-close-popup @click="onMatchClick(match.match, match.time, match.annotations, match.date)">
            <q-item-section>
              <q-item-label>{{ match.match }}</q-item-label>
              <q-item-label caption>{{ match.date }} - {{ match.time }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <q-card class="my-card2" style="max-width: 500px">
      <q-card-section horizontal>
        <q-img
          class="col-5"
          src="statics/Freiburg.png"
        />
        <q-card-section>
          <div class="absolute-center text-h6 text-center text-black">
            VS.&nbsp;
        </div>
        </q-card-section>
        <q-img
          src="statics/Test.png"
        />
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn flat round icon="event" />
        <q-btn flat>
          23.04.2023
        </q-btn>
        <q-btn flat>
          {{ txtTime }}
        </q-btn>
        <q-btn flat color="primary">
          {{ txtMatchName }}
        </q-btn>
      </q-card-actions>
    </q-card>

    <!-- Match Card -->
    <q-card class="my-card">
      <q-img src="statics/SCF-Hoffenheim.jpg" v-if="txtMatchName.indexOf('H....') >= 0">
        <div class="absolute-bottom text-h5 text-center text-black">
          {{ txtMatchName }}
        </div>
      </q-img>
      <q-img src="statics/SCF-Juventus.jpg" v-if="txtMatchName.indexOf('Juventus') >= 0">
        <div class="absolute-bottom text-h5 text-center text-black">
          {{ txtMatchName }}
        </div>
      </q-img>
      <q-img src="statics/Test_Spieltag.jpg" v-if="txtMatchName.indexOf('Test') >= 0">
        <div class="absolute-bottom text-h5 text-center text-black">
          {{ txtMatchName }}
        </div>
      </q-img>
      <q-img src="statics/SCF-Hertha.jpg" v-if="txtMatchName.indexOf('Hertha') >= 0">
        <div class="absolute-bottom text-h5 text-center text-black">
          {{ txtMatchName }}
        </div>
      </q-img>
      <q-img src="statics/SCF-Bayern.jpg" v-if="txtMatchName.indexOf('Bayern') >= 0">
        <div class="absolute-bottom text-h5 text-center text-black">
          {{ txtMatchName }}
        </div>
      </q-img>
      <q-img src="statics/SCF-Schalke.jpg" v-if="txtMatchName.indexOf('Schalke') >= 0">
        <div class="absolute-bottom text-h5 text-center text-black">
          {{ txtMatchName }}
        </div>
      </q-img>
      <q-img src="statics/SCF-Leipzig.jpg" v-if="txtMatchName.indexOf('Leipzig') >= 0">
        <div class="absolute-bottom text-h5 text-center text-black">
          {{ txtMatchName }}
        </div>
      </q-img>
      <q-img src="statics/SCF-Wolfsburg.jpg" v-if="txtMatchName.indexOf('Wolfsburg') >= 0">
        <div class="absolute-bottom text-h5 text-center text-black">
          {{ txtMatchName }}
        </div>
      </q-img>
      <q-img src="statics/SCF-.jpg" v-if="txtMatchName.indexOf('H....') < 0 && txtMatchName.indexOf('Juventus') < 0 && txtMatchName.indexOf('Hertha') < 0 && txtMatchName.indexOf('Bayern') < 0 && txtMatchName.indexOf('Schalke') < 0 && txtMatchName.indexOf('Leipzig') < 0 && txtMatchName.indexOf('Wolfsburg') < 0 && txtMatchName.indexOf('Test') < 0">
        <div class="absolute-bottom text-h5 text-center text-black">
          {{ txtMatchName }}
        </div>
      </q-img>
    </q-card>

    <!-- Share -->
    <div class="q-pa-md" style="max-width: 500px" v-if="IsAdministrator" >
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
          <q-toolbar-title class="text-overline">Anwesend ({{ txtNumberOfParticipants }} Personen)</q-toolbar-title>
          <q-btn class="bg-white text-primary" icon="add" label="Neu" @click="addParticipant = true" />
        </q-toolbar>
      </div>

      <!-- List of participants -->
      <q-list dark bordered separator style="max-width: 470px" v-for="(participant, i) in participantObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onParticipantClick(participant.participantId, participant.participant, participant.arrival, participant.annotations, participant.action, participant.reaction)">
          <q-item-section>
            <q-item-label overline>{{ participant.participant }}</q-item-label>
            <q-item-label caption>{{ participant.arrival }}</q-item-label>
            <q-item-label caption>{{ participant.annotations }}</q-item-label>
            <q-item-label caption v-if="participant.reaction !== ''">{{ participant.reaction }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Ticket assignment area (Titel) -->
      <div class="q-pa-md" style="max-width: 470px">
        <q-toolbar class="bg-primary text-white">
            <q-toolbar-title class="text-overline">Karte weitergegeben oder bedarf</q-toolbar-title>
            <q-btn class="bg-white text-primary" icon="credit_card" label="Zuweisung" @click="addTicketAssignment = true" v-if="IsAdministrator" />
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
            <q-btn icon="save" label="Speichern" @click="addParticipantSave(txtParticipantNew, txtArrivalNew, txtAnnotationsParticipantNew, txtActionNew, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" :disable="txtParticipantNew === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Show participant exists -->
      <q-dialog v-model="showParticipantExists" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="pan_tool" color="primary" text-color="white" />
            <span class="q-ml-sm">Diese Teilnahme besteht bereits!</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Schliessen" color="primary" v-close-popup />
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
            <q-input dense v-model="txtParticipantParticipant" autofocus label="Name" :readonly="true" />
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
            <q-btn icon="delete" color="primary" @click="delParticipant = true" v-if="IsAdministrator && txtParticipantReaction === ''" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editParticipantSave(txtParticipantId, txtParticipantParticipant, txtParticipantArrival, txtParticipantAnnotations, txtParticipantAction, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" :disable="txtParticipantParticipant === ''" v-close-popup />
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
            <q-btn flat label="Ja" color="primary" @click="deleteParticipant(txtParticipantId, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" v-close-popup />
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
            <q-btn icon="save" label="Speichern" @click="addTicketAssignmentSave(txtTicketAssignmentGiven, txtTicketAssignmentRequired, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" :disable="txtTicketAssignmentGiven === '' || txtTicketAssignmentRequired === ''" v-close-popup />
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
            <q-btn icon="delete" color="primary" @click="delTicketAssignment = true" v-if="IsAdministrator" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editTicketAssignmentSave(txtTicketParticipantId, txtTicketParticipant, txtTicketArrival, txtTicketAnnotations, txtTicketAction, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" :disable="txtTicketParticipant === ''" v-close-popup />
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
            <q-btn icon="swipe_left" label="Aufheben" color="primary" @click="delTicketAssigned = true" v-if="IsAdministrator" />
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
            <q-btn flat label="Ja" color="primary" @click="deleteTicketAssignment(txtTicketParticipantId, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" v-close-popup />
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
            <q-btn flat label="Ja" color="primary" @click="deleteTicketAssigned(txtTicketAssignedGiven, txtTicketAssignedRequired, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- Start Dialogs ticket assignment-->
    </div>

    <q-img src="statics/BGB.jpg" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import { ref } from 'vue'

const _constMatch = ref('')
const _constTime = ref('')
const _constAnnotationsMatchOriginal = ref('')
const _constAnnotationsMatch = ref('')
const _constDate = ref('')
const _constMatchName = ref('')
const _constArrivalElements = []
const _constNumberOfParticipants = ref('')

const _constParticipantId = ref('')
const _constParticipantParticipant = ref('')
const _constParticipantArrival = ref('')
const _constParticipantAnnotations = ref('')
const _constParticipantAction = ref('')
const _constParticipantReaction = ref('')

const _constTicketParticipantId = ref('')
const _constTicketParticipant = ref('')
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

export default {
  name: 'ListParticipant',

  setup () {
    return {
      IsAdministrator: ref(false),

      txtMatchName: ref(_constMatchName),
      txtTime: ref(_constTime),
      txtAnnotationsMatchOriginal: ref(_constAnnotationsMatchOriginal),
      txtAnnotationsMatch: ref(_constAnnotationsMatch),
      cbxArrivalOptions: ref(_constArrivalElements),
      txtNumberOfParticipants: ref(_constNumberOfParticipants),

      addParticipant: ref(false),
      showParticipantExists: ref(false),
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
      txtParticipantArrival: ref(_constParticipantArrival),
      txtParticipantAnnotations: ref(_constParticipantAnnotations),
      txtParticipantAction: ref(_constParticipantAction),
      txtParticipantReaction: ref(_constParticipantReaction),

      cbxActionOptions: ['bin dabei', 'brauche Karte', 'meine Karte ist frei'],

      txtTicketParticipantId: ref(_constTicketParticipantId),
      txtTicketParticipant: ref(_constTicketParticipant),
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
      URLMatch: 'https://script.google.com/macros/s/AKfycbysBv-GIg2N_vpj7n1L3pWiK1WC0EC1bUfJCmv7kBXHfdPKxtbJg8bQyNJKFDkekGEDeA/exec?ID=1znyBnIzqghCeRImZ8fSVGB_gR6TESuqep20YbUhkhSU&SH=BGB-Match',
      URLParticipant: 'https://script.google.com/macros/s/AKfycbz2PqyRf6et-Ju8JREOQJle1uxlABUhso--yKwIvGtJWt0AscZOSLfstyOSVX1fV3rvSw/exec?ID=1HCZKuGO-dmNJwrEsFyN2acvnE-WMHabBW8jWdhO4ggI&SH=BGB-Participant',
      URLWhereIsMyCard: 'https://script.google.com/macros/s/AKfycbzlc-2httq6jMOsqbGIQmE6oAXNcWpLRZmGckDWQ6DqFoGQgHD-C1BkennQGntzAkJj/exec?ID=1AA2nnIb886xaBjpSaxwf2JNtujKnJc4xSVR-ChRGs2U&SH=BGB-WhereIsMyCard',

      matchObject: [
        {
          match: '',
          time: '',
          annotations: '',
          date: '',
          matchId: ''
        }
      ],

      participantObject: [
        {
          match: '',
          participant: '',
          arrival: '',
          annotations: '',
          action: '',
          reaction: '',
          participantId: ''
        }
      ],
      reservation: '',

      ticketObject: [
        {
          ticketParticipant: '',
          ticketArrival: '',
          ticketAnnotations: '',
          ticketAction: '',
          ticketReaction: '',
          ticketParticipantId: ''
        }
      ],

      ticketGivenObject: [
        {
          ticketGivenParticipant: '',
          ticketGivenParticipantId: ''
        }
      ],

      ticketRequiredObject: [
        {
          ticketRequiredParticipant: '',
          ticketRequiredParticipantId: ''
        }
      ],

      ticketAssignedObject: [
        {
          ticketAssignedParticipant: '',
          ticketAssignedParticipantId: ''
        }
      ],

      whereIsMyCardObject: [
        {
          cardHolder: '',
          discounted: '',
          whoHasTheCard: ''
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
    getTableMatch () {
      this.matchObject = []

      let nextMatch = ''
      let nextTime = ''
      let nextAnnotations = ''
      let nextDate = ''

      console.log('URLMatch: ' + this.URLMatch + '&func=Read&published=TRUE')
      this.$axios(`${this.URLMatch}&func=Read&published=TRUE`)
        .then((res) => {
          this.tableMatch = res.data.split('\n')
          for (let index = 0; index < this.tableMatch.length - 1; index++) {
            const element = this.tableMatch[index].split(',')
            this.setMatchObject(element[2], element[4].substr(0, 5), element[5].replace(/<br>/g, '\n'), element[6], element[7])
            if (index === 0) {
              nextMatch = element[2]
              nextTime = element[4].substr(0, 5)
              nextAnnotations = element[5].replace(/<br>/g, '\n')
              nextDate = element[6]
            }
          }
          this.onMatchClick(nextMatch, nextTime, nextAnnotations, nextDate)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setMatchObject (_match, _time, _annotations, _date, _matchId) {
      this.matchObject.push({ match: _match, time: _time, annotations: _annotations, date: _date, matchId: _matchId })
    },

    onMatchClick (_match, _time, _annotationsMatch, _date) {
      console.log('onMatchClick: ' + _match + ', ' + _time + ', ' + _annotationsMatch + ', ' + _date)
      _constMatch.value = _match
      _constTime.value = _time
      _constDate.value = _date
      _constMatchName.value = _match.trim() + ' ' + _date.substr(0, 6) + _date.substr(8, 2) + ' - ' + _time.substr(0, 5)

      this.loadReloadData(_constMatchName.value, _time, _annotationsMatch)
    },

    async loadReloadData (_matchName, _time, _annotationsMatch) {
      console.log('loadReloadData: ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      this.setArrivalElements(_time)
      this.getTableWhereIsMyCard()
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      await sleep(500)
      this.getTableParticipant(_matchName, _time, _annotationsMatch)
      this.getTableTicket(_matchName)
      this.getTableTicketGiven(_matchName)
      this.getTableTicketRequired(_matchName)
      this.getTableTicketAssigned(_matchName)
    },

    setTextShare (_matchName) {
      _constShare.value = _matchName + '\n\nAnwesend (' + _constNumberOfParticipants.value + ' Personen):\n' + _constParticipantList.value
      _constShare.value += '\nKarte weitergeben oder bedarf:\n' + _constTicketList.value
      _constShare.value += '\n' + _constAnnotationsMatch.value
      this.share = true
    },

    onParticipantClick (_participantId, _participant, _arrival, _annotations, _action, _reaction) {
      console.log('Clicked on Participant: ' + _participantId + ', ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _reaction)
      _constParticipantId.value = _participantId
      _constParticipantParticipant.value = _participant
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

    addParticipantSave (_participant, _arrival, _annotations, _action, _matchName, _time, _annotationsMatch) {
      console.log('addParticipantSave: ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      if (_action !== 'bin dabei') _arrival = ''

      const _participants = this.participantObject.map(el => el.participant)
      const _participantExists = _participants.includes(_participant)
      if (_participantExists) {
        this.showParticipantExists = true
      } else {
        this.$axios(`${this.URLParticipant}&func=Add&match=${_matchName}&participant=${encodeURI(_participant.replace(',', ' '))}&arrival=${_arrival}&annotations=${encodeURI(_annotations.replace(',', ';').replace(/(?:\r\n|\r|\n)/g, '<br>'))}&action=${_action}&reaction=`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.loadReloadData(_matchName, _time, _annotationsMatch)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    editParticipantSave (_participantId, _participant, _arrival, _annotations, _action, _matchName, _time, _annotationsMatch) {
      console.log('editParticipantSave: ' + _participantId + ', ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      if (_action !== 'bin dabei') _arrival = ''

      this.$axios(`${this.URLParticipant}&func=Update&participantId=${_participantId}&participant=${encodeURI(_participant.replace(',', ' '))}&arrival=${_arrival}&annotations=${encodeURI(_annotations.replace(',', ';').replace(/(?:\r\n|\r|\n)/g, '<br>'))}&action=${_action}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.loadReloadData(_matchName, _time, _annotationsMatch)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    deleteParticipant (_participantId, _matchName, _time, _annotationsMatch) {
      console.log('deleteParticipant: ' + _participantId + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      this.$axios(`${this.URLParticipant}&func=Delete&participantId=${_participantId}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.editParticipant = false
            this.loadReloadData(_matchName, _time, _annotationsMatch)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    onTicketAssignmentClick (_ticketParticipantId, _participant, _arrival, _annotations, _action, _reaction) {
      console.log('Clicked on ticket assignment: ' + _ticketParticipantId + ', ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _reaction)
      _constTicketParticipantId.value = _ticketParticipantId
      _constTicketParticipant.value = _participant
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

    addTicketAssignmentSave (_ticketAssignmentGiven, _ticketAssignmentRequired, _matchName, _time, _annotationsMatch) {
      console.log('addTicketAssignmentSave: ' + _ticketAssignmentGiven + ', ' + _ticketAssignmentRequired + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      const _ticketGivenParticipantId = this.ticketGivenObject.find(el => el.ticketGivenParticipant === _ticketAssignmentGiven)?.ticketGivenParticipantId
      if (typeof _ticketGivenParticipantId !== 'undefined') {
        console.log(this.URLParticipant + '&func=UpdateTicketGiven&participantId=' + _ticketGivenParticipantId + '&reaction=' + _ticketAssignmentGiven)
        this.$axios(`${this.URLParticipant}&func=UpdateTicketGiven&participantId=${_ticketGivenParticipantId}&reaction=${_ticketAssignmentRequired}`)
          .catch((err) => {
            console.log(err)
          })

        const _ticketRequiredParticipantId = this.ticketRequiredObject.find(el => el.ticketRequiredParticipant === _ticketAssignmentRequired)?.ticketRequiredParticipantId
        if (typeof _ticketRequiredParticipantId !== 'undefined') {
          console.log(this.URLParticipant + '&func=UpdateTicketRequired&participantId=' + _ticketRequiredParticipantId + '&action=bin dabei&reaction=' + _ticketAssignmentGiven)
          this.$axios(`${this.URLParticipant}&func=UpdateTicketRequired&participantId=${_ticketRequiredParticipantId}&action=bin dabei&reaction=${_ticketAssignmentGiven}`)
            .then((res) => {
              if (res.data === 'Success, requested action completed') {
                this.loadReloadData(_matchName, _time, _annotationsMatch)
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }
      }
    },

    deleteTicketAssigned (_ticketAssignedGiven, _ticketAssignedRequired, _matchName, _time, _annotationsMatch) {
      console.log('deleteTicketAssigned: ' + _ticketAssignedGiven + ', ' + _ticketAssignedRequired + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      const _ticketAssignedGivenParticipantId = this.ticketAssignedObject.find(el => el.ticketAssignedParticipant === _ticketAssignedGiven)?.ticketAssignedParticipantId
      if (typeof _ticketAssignedGivenParticipantId !== 'undefined') {
        console.log(this.URLParticipant + '&func=UpdateTicketGiven&participantId=' + _ticketAssignedGivenParticipantId + '&reaction=')
        this.$axios(`${this.URLParticipant}&func=UpdateTicketGiven&participantId=${_ticketAssignedGivenParticipantId}&reaction=`)
          .catch((err) => {
            console.log(err)
          })

        const _ticketAssignedRequiredParticipantId = this.ticketAssignedObject.find(el => el.ticketAssignedParticipant === _ticketAssignedRequired)?.ticketAssignedParticipantId
        if (typeof _ticketAssignedRequiredParticipantId !== 'undefined') {
          console.log(this.URLParticipant + '&func=UpdateTicketRequired&participantId=' + _ticketAssignedRequiredParticipantId + '&action=brauche Karte&reaction=')
          this.$axios(`${this.URLParticipant}&func=UpdateTicketRequired&participantId=${_ticketAssignedRequiredParticipantId}&action=brauche Karte&reaction=`)
            .then((res) => {
              if (res.data === 'Success, requested action completed') {
                this.editTicketAssigned = false
                this.loadReloadData(_matchName, _time, _annotationsMatch)
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }
      }
    },

    editTicketAssignmentSave (_ticketParticipantId, _participant, _arrival, _annotations, _action, _matchName, _time, _annotationsMatch) {
      console.log('editTicketAssignmentSave: ' + _ticketParticipantId + ', ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      if (_action !== 'bin dabei') _arrival = ''

      this.$axios(`${this.URLParticipant}&func=Update&participantId=${_ticketParticipantId}&participant=${encodeURI(_participant.replace(',', ' '))}&arrival=${_arrival}&annotations=${encodeURI(_annotations.replace(',', ';').replace(/(?:\r\n|\r|\n)/g, '<br>'))}&action=${_action}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.editTicketAssignment = false
            this.loadReloadData(_matchName, _time, _annotationsMatch)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    deleteTicketAssignment (_ticketParticipantId, _matchName, _time, _annotationsMatch) {
      console.log('deleteTicketAssignment: ' + _ticketParticipantId + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      this.$axios(`${this.URLParticipant}&func=Delete&participantId=${_ticketParticipantId}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.editTicketAssignment = false
            this.loadReloadData(_matchName, _time, _annotationsMatch)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    getTableParticipant (_matchName, _time, _annotationsMatch) {
      this.participantObject = []
      this.reservation = ''

      let readFunction = 'Read'
      if (this.IsAdministrator) {
        readFunction = 'ReadAdmin'
      }

      console.log('URLParticipant: ' + this.URLParticipant + '&func=ReadAdmin&match=' + _matchName)
      this.$axios(`${this.URLParticipant}&func=${readFunction}&match=${_matchName}`)
        .then((res) => {
          this.tableParticipant = res.data.split('\n')
          _constNumberOfParticipants.value = this.tableParticipant.length - 1
          for (let index = 0; index < _constNumberOfParticipants.value; index++) {
            const element = this.tableParticipant[index].split(',')
            this.setParticipantObject(element[2], element[3], element[4].substr(0, 5), element[5].replace(/<br>/g, '\n'), element[6], element[7], element[8])
          }

          _constParticipantList.value = ''
          this.participantObject.forEach(participant => {
            _constParticipantList.value += participant.participant.trim()

            _constParticipantList.value += ' (' + participant.arrival + ')'
            if (participant.arrival !== '') {
              if (parseInt(participant.arrival.substr(0, 2)) === parseInt(_time.substr(0, 2) - 2) &&
                  participant.arrival.substr(3, 2) === _time.substr(3, 2)) {
                if (this.reservation !== '') {
                  this.reservation += ', '
                }
                this.reservation += participant.participant.trim()
              }
            }

            if (participant.annotations !== '') {
              _constParticipantList.value += ' (' + participant.annotations.trim().replace(/\n/g, ' / ') + ')'
            }

            if (participant.reaction !== '') {
              const _whoHasTheCard = this.whereIsMyCardObject.find(el => el.cardHolder === participant.reaction)?.whoHasTheCard
              if (typeof _whoHasTheCard !== 'undefined') {
                participant.reaction = participant.reaction.trim() + ' (Karte bei ' + _whoHasTheCard + ')'
              }
              participant.reaction = 'habe Karte von ' + participant.reaction.trim()
              _constParticipantList.value += ', ' + participant.reaction.trim()
            }

            _constParticipantList.value += '\n'
          })

          if (this.reservation !== '') {
            this.reservation += ','
          }

          _constAnnotationsMatchOriginal.value = _annotationsMatch
          _constAnnotationsMatch.value = _annotationsMatch.replace(/<br>/g, '\n').replace('<STANDARDTEXT>', 'Wer reserviert Plätze (' + parseInt(_time.substr(0, 2) - 2) + ':' + _time.substr(3, 2) + '): ' + this.reservation + ' die Fahne und die Socken')
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setParticipantObject (_match, _participant, _arrival, _annotations, _action, _reaction, _participantId) {
      // console.log('setParticipantObject: ' + _match + ',' + _participant + ',' + _arrival + ',' + _annotations + ',' + _action + ',' + _reaction + ',' + _participantId)
      this.participantObject.push({ match: _match, participant: _participant, arrival: _arrival, annotations: _annotations, action: _action, reaction: _reaction, participantId: _participantId })
    },

    getTableTicket (_matchName) {
      this.ticketObject = []

      console.log('URLParticipant: ' + this.URLParticipant + '&func=ReadTickets&match=' + _matchName)
      this.$axios(`${this.URLParticipant}&func=ReadTickets&match=${_matchName}`)
        .then((res) => {
          this.tableTicket = res.data.split('\n')
          for (let index = 0; index < this.tableTicket.length - 1; index++) {
            const element = this.tableTicket[index].split(',')
            this.setTicketObject(element[3], element[4].substr(0, 5), element[5].replace(/<br>/g, '\n'), element[6], element[7], element[8])
          }

          _constTicketList.value = ''
          this.ticketObject.forEach(ticket => {
            if (ticket.ticketAction === 'brauche Karte') {
              _constTicketList.value += '??? an ' + ticket.ticketParticipant.trim()
            }

            if (ticket.ticketAction === 'meine Karte ist frei') {
              _constTicketList.value += ticket.ticketParticipant.trim()

              if (ticket.ticketReaction === '') {
                _constTicketList.value += ' an ???'
              } else {
                _constTicketList.value += ' an ' + ticket.ticketReaction.trim()
              }
            }

            if (ticket.ticketAnnotations !== '') {
              _constTicketList.value += ' (' + ticket.ticketAnnotations.trim() + ')'
            }

            _constTicketList.value += '\n'
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setTicketObject (_participant, _arrival, _annotations, _action, _reaction, _participantId) {
      // console.log('setTicketObject: ' + _participant + ',' + _arrival + ',' + _annotations + ',' + _action + ',' + _reaction + ',' + _participantId)
      this.ticketObject.push({ ticketParticipant: _participant, ticketArrival: _arrival, ticketAnnotations: _annotations, ticketAction: _action, ticketReaction: _reaction, ticketParticipantId: _participantId })
    },

    getTableTicketGiven (_matchName) {
      this.ticketGivenObject = []

      console.log('URLParticipant: ' + this.URLParticipant + '&func=ReadTicketsGiven&match=' + _matchName)
      this.$axios(`${this.URLParticipant}&func=ReadTicketsGiven&match=${_matchName}`)
        .then((res) => {
          this.tableTicket = res.data.split('\n')
          for (let index = 0; index < this.tableTicket.length - 1; index++) {
            const element = this.tableTicket[index].split(',')
            this.setTicketGivenObject(element[3], element[8])
          }

          _constTicketAssignmentGivenElements.length = 0
          let i = 0
          this.ticketGivenObject.forEach(ticketGiven => {
            _constTicketAssignmentGivenElements[i] = ticketGiven.ticketGivenParticipant
            i++
          })
          // console.log('_constTicketAssignmentGivenElements: ' + _constTicketAssignmentGivenElements)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setTicketGivenObject (_participant, _participantId) {
      this.ticketGivenObject.push({ ticketGivenParticipant: _participant, ticketGivenParticipantId: _participantId })
    },

    getTableTicketRequired (_matchName) {
      this.ticketRequiredObject = []

      console.log('URLParticipant: ' + this.URLParticipant + '&func=ReadTicketsRequired&match=' + _matchName)
      this.$axios(`${this.URLParticipant}&func=ReadTicketsRequired&match=${_matchName}`)
        .then((res) => {
          this.tableTicket = res.data.split('\n')
          for (let index = 0; index < this.tableTicket.length - 1; index++) {
            const element = this.tableTicket[index].split(',')
            this.setTicketRequiredObject(element[3], element[8])
          }

          _constTicketAssignmentRequiredElements.length = 0
          let i = 0
          this.ticketRequiredObject.forEach(ticketRequired => {
            _constTicketAssignmentRequiredElements[i] = ticketRequired.ticketRequiredParticipant
            i++
          })
          // console.log('_constTicketAssignmentRequiredElements: ' + _constTicketAssignmentRequiredElements)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setTicketRequiredObject (_participant, _participantId) {
      this.ticketRequiredObject.push({ ticketRequiredParticipant: _participant, ticketRequiredParticipantId: _participantId })
    },

    getTableTicketAssigned (_matchName) {
      this.ticketAssignedObject = []

      console.log('URLParticipant: ' + this.URLParticipant + '&func=ReadTicketsAssigned&match=' + _matchName)
      this.$axios(`${this.URLParticipant}&func=ReadTicketsAssigned&match=${_matchName}`)
        .then((res) => {
          this.tableTicket = res.data.split('\n')
          for (let index = 0; index < this.tableTicket.length - 1; index++) {
            const element = this.tableTicket[index].split(',')
            this.setTicketAssignedObject(element[3], element[8])
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setTicketAssignedObject (_participant, _participantId) {
      this.ticketAssignedObject.push({ ticketAssignedParticipant: _participant, ticketAssignedParticipantId: _participantId })
    },

    getTableWhereIsMyCard () {
      this.whereIsMyCardObject = []

      console.log('URLWhereIsMyCard: ' + this.URLWhereIsMyCard + '&func=Read&cardholder=')
      this.$axios(`${this.URLWhereIsMyCard}&func=Read&cardholder=`)
        .then((res) => {
          this.tableWhereIsMyCard = res.data.split('\n')
          for (let index = 0; index < this.tableWhereIsMyCard.length - 1; index++) {
            const element = this.tableWhereIsMyCard[index].split(',')
            this.setWhereIsMyCardObject(element[2], element[3], element[4])
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
      const hour = _time.substr(0, 2)
      const minute = _time.substr(3, 2)
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
