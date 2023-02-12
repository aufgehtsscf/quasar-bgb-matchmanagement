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
        label="Spiel auswählen"
        @click="onPositionMatchMainClick">

        <q-list v-for="i in matchIndex"
          :key="i"
          v-ripple>
          <q-item clickable v-close-popup @click="onMatchClick(matchMatch[i], matchTime[i], matchAnnotations[i], matchDate[i])" v-if="i > 0">
            <q-item-section>
              <q-item-label>{{ matchMatch[i] }}</q-item-label>
              <q-item-label caption>{{ matchDate[i] }} - {{ matchTime[i] }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <!-- Match aame -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
          {{ txtMatchName }}
      </q-toolbar>
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
          <q-toolbar-title class="text-overline">Anwesend (Ankunft)</q-toolbar-title>
          <q-btn class="bg-white text-primary" icon="add" label="Neu" @click="addParticipant = true" />
        </q-toolbar>
      </div>

      <!-- List of participants -->
      <q-list dark bordered separator style="max-width: 470px" v-for="i in participantIndex"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onParticipantClick(participantPosition[i], participantParticipant[i], participantArrival[i], participantAnnotations[i], participantAction[i], participantReaction[i])" v-if="i > 0">
          <q-item-section>
            <q-item-label overline>{{ participantParticipant[i] }}</q-item-label>
            <q-item-label caption>{{ participantArrival[i] }}</q-item-label>
            <q-item-label caption>{{ participantAnnotations[i] }}</q-item-label>
            <q-item-label caption v-if="participantReaction[i] !== ''">habe Karte von {{ participantReaction[i] }}</q-item-label>
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
      <q-list dark bordered separator style="max-width: 470px" v-for="i in ticketIndex"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onTicketAssignmentClick(ticketPosition[i], ticketParticipant[i], ticketArrival[i], ticketAnnotations[i], ticketAction[i], ticketReaction[i])" v-if="i > 0">
          <q-item-section>
            <q-item-label overline>{{ ticket[i] }}</q-item-label>
            <q-item-label caption>{{ ticketAnnotations[i] }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Dialogs -->
    <div class="q-pa-md q-gutter-sm">

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
            <q-input dense v-model="txtAnnotationsParticipantNew"  label="Kommentar"/>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addParticipantSave(txtParticipantNew, txtArrivalNew, txtAnnotationsParticipantNew, txtActionNew, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" v-close-popup />
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
            <q-input dense v-model="txtParticipantParticipant" autofocus label="Name" />
            <q-select v-model="txtParticipantAction" :options="cbxActionOptions" label="Aktion" :readonly="false" v-if="txtParticipantReaction === ''" />
            <q-select v-model="txtParticipantAction" :options="cbxActionOptions" label="Aktion" :readonly="true" v-if="txtParticipantReaction !== ''" />
            <q-select v-model="txtParticipantArrival" :options="cbxArrivalOptions" label="Ankunft" v-if="txtParticipantAction === 'bin dabei'" />
            <q-input dense v-model="txtParticipantAnnotations"  label="Kommentar"/>
            <q-input class="text-italic" dense v-model="txtParticipantReaction" :readonly="true" v-if="txtParticipantReaction !== ''" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" label="Löschen" color="primary" @click="delParticipant = true" v-if="IsAdministrator && txtParticipantReaction === ''" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editParticipantSave(intParticipantPosition, txtParticipantParticipant, txtParticipantArrival, txtParticipantAnnotations, txtParticipantAction, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" v-close-popup />
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
            <q-btn flat label="Ja" color="primary" @click="deleteParticipant(intParticipantPosition, txtParticipantReaction, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" v-close-popup />
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
            <q-btn icon="save" label="Speichern" @click="addTicketAssignmentSave(txtTicketAssignmentGiven, txtTicketAssignmentRequired, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit ticket assignment -->
      <q-dialog v-model="editTicketAssignment" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Teilnahme ändern</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="txtTicketParticipant" autofocus label="Name" />
            <q-select v-model="txtTicketAction" :options="cbxActionOptions" label="Aktion" />
            <q-select v-model="txtTicketArrival" :options="cbxArrivalOptions" label="Ankunft" v-if="txtTicketAction === 'bin dabei'" />
            <q-input dense v-model="txtTicketAnnotations" label="Kommentar" />
            <q-input class="text-italic" dense v-model="txtTicketReaction" :readonly="true" v-if="txtTicketReaction !== ''" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" label="Löschen" color="primary" @click="delTicketAssignment = true" v-if="IsAdministrator" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editTicketAssigmentSave(intTicketAssignmentPosition, txtTicketParticipant, txtTicketArrival, txtTicketAnnotations, txtTicketAction, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit ticket assignment Done -->
      <q-dialog v-model="editTicketAssignmentDone" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Kartenzuweisung</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select v-model="txtTicketAssignmentGiven" :options="cbxTicketAssignmentGivenOptions" label="Karte von" :readonly="false" v-if="IsAdministrator" />
            <q-select v-model="txtTicketAssignmentGiven" :options="cbxTicketAssignmentGivenOptions" label="Karte von" :readonly="true" v-if="!IsAdministrator" />
            <q-select v-model="txtTicketAssignmentRequired" :options="cbxTicketAssignmentRequiredOptions" label="Karte an" :readonly="false" v-if="IsAdministrator" />
            <q-select v-model="txtTicketAssignmentRequired" :options="cbxTicketAssignmentRequiredOptions" label="Karte an" :readonly="true" v-if="!IsAdministrator" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" label="Löschen" color="primary" @click="delTicketAssignmentDone = true" v-if="IsAdministrator" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editTicketAssigmentDone(txtTicketAssignmentGiven, txtTicketAssignmentRequired, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" v-close-popup  v-if="IsAdministrator" />
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
            <q-btn flat label="Ja" color="primary" @click="deleteTicketAssignment(intTicketAssignmentPosition, txtTicketReaction, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete ticket assignment Done -->
      <q-dialog v-model="delTicketAssignmentDone" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="primary" text-color="white" />
            <span class="q-ml-sm">Datensatz löschen?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Nein" color="primary" v-close-popup />
            <q-btn flat label="Ja" color="primary" @click="deleteTicketAssigmentDone(txtTicketAssignmentGiven, txtTicketAssignmentRequired, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" v-close-popup />
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

const _constParticipantPosition = ref('')
const _constParticipantParticipant = ref('')
const _constParticipantArrival = ref('')
const _constParticipantAnnotations = ref('')
const _constParticipantAction = ref('')
const _constParticipantReaction = ref('')

const _constTicketPosition = ref('')
const _constTicketParticipant = ref('')
const _constTicketArrival = ref('')
const _constTicketAnnotations = ref('')
const _constTicketAction = ref('')
const _constTicketReaction = ref('')

const _constTicketGivenPosition = ref('')
const _constTicketRequiredPosition = ref('')
const _constTicketAssignmentGivenElements = []
const _constTicketAssignmentRequiredElements = []
const _constTicketAssignmentGiven = ref('')
const _constTicketAssignmentRequired = ref('')

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

      addParticipant: ref(false),
      editParticipant: ref(false),
      delParticipant: ref(false),

      addTicketAssignment: ref(false),
      editTicketAssignment: ref(false),
      editTicketAssignmentDone: ref(false),
      delTicketAssignment: ref(false),
      delTicketAssignmentDone: ref(false),

      intParticipantPosition: ref(_constParticipantPosition),
      txtParticipantParticipant: ref(_constParticipantParticipant),
      txtParticipantArrival: ref(_constParticipantArrival),
      txtParticipantAnnotations: ref(_constParticipantAnnotations),
      txtParticipantAction: ref(_constParticipantAction),
      txtParticipantReaction: ref(_constParticipantReaction),

      cbxActionOptions: ['bin dabei', 'brauche Karte', 'meine Karte ist frei'],

      intTicketAssignmentPosition: ref(_constTicketPosition),
      txtTicketParticipant: ref(_constTicketParticipant),
      txtTicketArrival: ref(_constTicketArrival),
      txtTicketAnnotations: ref(_constTicketAnnotations),
      txtTicketAction: ref(_constTicketAction),
      txtTicketReaction: ref(_constTicketReaction),

      txtParticipantNew: ref(''),
      txtArrivalNew: ref(''),
      txtAnnotationsParticipantNew: ref(''),
      txtActionNew: ref('bin dabei'),

      intTicketAssignmentGivenPosition: ref(_constTicketGivenPosition),
      intTicketAssignmentRequiredPosition: ref(_constTicketRequiredPosition),
      cbxTicketAssignmentGivenOptions: ref(_constTicketAssignmentGivenElements),
      cbxTicketAssignmentRequiredOptions: ref(_constTicketAssignmentRequiredElements),
      txtTicketAssignmentGiven: ref(_constTicketAssignmentGiven),
      txtTicketAssignmentGivenDone: ref(_constTicketAssignmentGiven),
      txtTicketAssignmentRequired: ref(_constTicketAssignmentRequired),
      txtTicketAssignmentRequiredDone: ref(_constTicketAssignmentRequired)
    }
  },

  data () {
    return {
      URLMatch: 'https://script.google.com/macros/s/AKfycbyh43MSF1Vz9W3TZ0_9e273B81CtCEk4se3yHj9HCbIvBlfw9g6tHE3d5O8eXW3yIkyog/exec?ID=1znyBnIzqghCeRImZ8fSVGB_gR6TESuqep20YbUhkhSU&SH=BGB-Match',
      URLParticipant: 'https://script.google.com/macros/s/AKfycbzsIFP8MNp6ks3LWGVIZj6rV0eETzGsAqHJ8yl-43qVrwESQ_cmyGtIeh189DQHBUN_-w/exec?ID=1HCZKuGO-dmNJwrEsFyN2acvnE-WMHabBW8jWdhO4ggI&SH=BGB-Participant',

      matchIndex: [],
      matchPosition: [],
      matchMatch: [],
      matchTime: [],
      matchAnnotations: [],
      matchDate: [],

      participantIndex: [],
      participantPosition: [],
      participantMatch: [],
      participantParticipant: [],
      participantArrival: [],
      participantAnnotations: [],
      participantAction: [],
      participantReaction: [],
      reservation: '',

      ticketIndex: [],
      ticketPosition: [],
      ticket: [],
      ticketParticipant: [],
      ticketArrival: [],
      ticketAnnotations: [],
      ticketAction: [],
      ticketReaction: [],

      ticketRequiredIndex: [],
      ticketRequiredPosition: [],
      ticketRequiredParticipant: [],

      ticketGivenIndex: [],
      ticketGivenPosition: [],
      ticketGivenParticipant: []
    }
  },

  computed: {
  },

  mounted () {
    this.getTableMatch()
  },

  methods: {
    getTableMatch () {
      this.matchIndex = []
      this.matchPosition = []
      this.matchMatch = []
      this.matchTime = []
      this.matchAnnotations = []
      this.matchDate = []

      console.log('URLMatch: ' + this.URLMatch + '&func=Read&published=TRUE')
      this.$axios(`${this.URLMatch}&func=Read&published=TRUE`)
        .then((res) => {
          this.tableMatch = res.data.split('\n')
          for (let index = 0; index < this.tableMatch.length - 1; index++) {
            const element = this.tableMatch[index].split(',')
            for (let index2 = 0; index2 < element.length; index2++) {
              switch (index2) {
                case 0:
                  this.matchIndex[index + 1] = index + 1
                  this.matchPosition[index + 1] = element[index2]
                  break
                case 2:
                  this.matchMatch[index + 1] = element[index2]
                  break
                case 4:
                  this.matchTime[index + 1] = element[index2].substr(0, 5)
                  break
                case 5:
                  this.matchAnnotations[index + 1] = element[index2]
                  break
                case 6:
                  this.matchDate[index + 1] = element[index2]
                  break
                default:
                  break
              }
            }
          }
          this.onMatchClick(this.matchMatch[1], this.matchTime[1], this.matchAnnotations[1], this.matchDate[1])
        })
        .catch((err) => {
          console.log(err)
        })
    },

    onPositionMatchMainClick () {
      console.log('Clicked on main button')
    },

    onMatchClick (_match, _time, _annotationsMatch, _date) {
      console.log('onMatchClick: ' + _match + ', ' + _time + ', ' + _annotationsMatch + ', ' + _date)
      _constMatch.value = _match
      _constTime.value = _time
      _constDate.value = _date
      _constMatchName.value = _match.trim() + ' ' + _date.substr(0, 6) + _date.substr(8, 2) + ' - ' + _time

      this.loadReloadData(_constMatchName.value, _time, _annotationsMatch)
    },

    loadReloadData (_matchName, _time, _annotationsMatch) {
      console.log('loadReloadData: ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      this.setArrivalElements(_time)
      this.getTableParticipant(_constMatchName.value, _time, _annotationsMatch)
      this.getTableTicket(_constMatchName.value)
      this.getTableTicketRequired(_constMatchName.value)
      this.getTableTicketGiven(_constMatchName.value)
    },

    onParticipantClick (_participantPosition, _participant, _arrival, _annotations, _action, _reaction) {
      console.log('Clicked on Participant: ' + _participantPosition + ', ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _reaction)
      _constParticipantPosition.value = _participantPosition
      _constParticipantParticipant.value = _participant
      _constParticipantArrival.value = _arrival
      _constParticipantAnnotations.value = _annotations
      _constParticipantAction.value = _action
      if (_reaction !== '') {
        _constParticipantReaction.value = 'habe Karte von ' + _reaction
      } else {
        _constParticipantReaction.value = _reaction
      }

      this.editParticipant = true
    },

    addParticipantSave (_participant, _arrival, _annotations, _action, _matchName, _time, _annotationsMatch) {
      console.log('addParticipantSave: ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      if (_participant !== '') {
        if (_action !== 'bin dabei') _arrival = ''

        this.$axios(`${this.URLParticipant}&func=Add&match=${_matchName}&participant=${encodeURI(_participant.replace(',', ' '))}&arrival=${_arrival}&annotations=${encodeURI(_annotations.replace(',', ';'))}&action=${_action}&reaction=`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.loadReloadData(_matchName, _time, _annotationsMatch)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        alert('Name ist erforderlich')
      }
    },

    editParticipantSave (_participantPosition, _participant, _arrival, _annotations, _action, _matchName, _time, _annotationsMatch) {
      console.log('editParticipantSave: ' + _participantPosition + ', ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      if (_participant !== '') {
        if (_action !== 'bin dabei') _arrival = ''

        this.$axios(`${this.URLParticipant}&func=Update&index=${_participantPosition}&participant=${encodeURI(_participant.replace(',', ' '))}&arrival=${_arrival}&annotations=${encodeURI(_annotations.replace(',', ';'))}&action=${_action}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.loadReloadData(_matchName, _time, _annotationsMatch)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        alert('Name ist erforderlich')
      }
    },

    deleteParticipant (_participantPosition, _reaction, _matchName, _time, _annotationsMatch) {
      console.log('deleteParticipant: ' + _participantPosition + ', ' + _reaction + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      this.$axios(`${this.URLParticipant}&func=Delete&index=${_participantPosition}`)
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

    onTicketAssignmentClick (_ticketPosition, _participant, _arrival, _annotations, _action, _reaction) {
      console.log('Clicked on ticket assignment: ' + _ticketPosition + ', ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _reaction)
      _constTicketPosition.value = _ticketPosition
      _constTicketParticipant.value = _participant
      _constTicketArrival.value = _arrival
      _constTicketAnnotations.value = _annotations
      _constTicketAction.value = _action
      if (_reaction !== '') {
        _constTicketReaction.value = 'habe Karte von ' + _participant
        _constTicketAssignmentGiven.value = _participant
        _constTicketAssignmentRequired.value = _reaction
        this.editTicketAssignment = false
        this.editTicketAssignmentDone = true
      } else {
        _constTicketReaction.value = ''
        _constTicketAssignmentRequired.value = ''
        _constTicketAssignmentGiven.value = ''
        this.editTicketAssignment = true
        this.editTicketAssignmentDone = false
      }
    },

    addTicketAssignmentSave (_ticketAssignmentGiven, _ticketAssignmentRequired, _matchName, _time, _annotationsMatch) {
      console.log('addTicketAssignmentSave: ' + _ticketAssignmentGiven + ', ' + _ticketAssignmentRequired + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      let _ticketAssignmentGivenPosition = 0
      for (let index = 1; index < this.ticketGivenParticipant.length; index++) {
        const element = this.ticketGivenParticipant[index]

        if (element === _ticketAssignmentGiven) {
          _ticketAssignmentGivenPosition = this.ticketGivenPosition[index]
        }
      }
      this.$axios(`${this.URLParticipant}&func=UpdateTicketGiven&index=${_ticketAssignmentGivenPosition}&reaction=${_ticketAssignmentRequired}`)
        .catch((err) => {
          console.log(err)
        })

      let _ticketAssignmentRequiredPosition = 0
      for (let index = 1; index < this.ticketRequiredParticipant.length; index++) {
        const element = this.ticketRequiredParticipant[index]

        if (element === _ticketAssignmentRequired) {
          _ticketAssignmentRequiredPosition = this.ticketRequiredPosition[index]
        }
      }
      this.$axios(`${this.URLParticipant}&func=UpdateTicketRequired&index=${_ticketAssignmentRequiredPosition}&action=bin dabei&reaction=${_ticketAssignmentGiven}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.loadReloadData(_matchName, _time, _annotationsMatch)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    editTicketAssigmentSave (_ticketAssignmentPosition, _participant, _arrival, _annotations, _action, _matchName, _time, _annotationsMatch) {
      console.log('editTicketAssigmentSave: ' + _ticketAssignmentPosition + ', ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      if (_participant !== '') {
        if (_action !== 'bin dabei') _arrival = ''

        this.$axios(`${this.URLParticipant}&func=Update&index=${_ticketAssignmentPosition}&participant=${encodeURI(_participant.replace(',', ' '))}&arrival=${_arrival}&annotations=${encodeURI(_annotations.replace(',', ';'))}&action=${_action}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.loadReloadData(_matchName, _time, _annotationsMatch)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        alert('Name ist erforderlich')
      }
    },

    deleteTicketAssignment (_ticketAssignmentPosition, _reaction, _matchName, _time, _annotationsMatch) {
      console.log('deleteTicketAssignment: ' + _ticketAssignmentPosition + ', ' + _reaction + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      this.$axios(`${this.URLParticipant}&func=Delete&index=${_ticketAssignmentPosition}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.editTicketAssigment = false
            this.loadReloadData(_matchName, _time, _annotationsMatch)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    getTableParticipant (_matchName, _time, _annotationsMatch) {
      this.participantIndex = []
      this.participantPosition = []
      this.participantMatch = []
      this.participantParticipant = []
      this.participantArrival = []
      this.participantAnnotations = []
      this.participantAction = []
      this.participantReaction = []
      this.reservation = ''

      let readFunction = 'Read'
      if (this.IsAdministrator) {
        readFunction = 'ReadAdmin'
      }

      console.log('URLParticipant: ' + this.URLParticipant + '&func=ReadAdmin&match=' + _matchName)
      this.$axios(`${this.URLParticipant}&func=${readFunction}&match=${_matchName}`)
        .then((res) => {
          this.tableParticipant = res.data.split('\n')
          for (let index = 0; index < this.tableParticipant.length - 1; index++) {
            const element = this.tableParticipant[index].split(',')
            for (let index2 = 0; index2 < element.length; index2++) {
              switch (index2) {
                case 0:
                  this.participantIndex[index + 1] = index + 1
                  this.participantPosition[index + 1] = element[index2]
                  break
                case 2:
                  this.participantMatch[index + 1] = element[index2]
                  break
                case 3:
                  this.participantParticipant[index + 1] = element[index2]
                  break
                case 4:
                  this.participantArrival[index + 1] = element[index2].substr(0, 5)
                  if (parseInt(this.participantArrival[index + 1].substr(0, 2)) === parseInt(_time.substr(0, 2) - 2) &&
                  this.participantArrival[index + 1].substr(3, 2) === _time.substr(3, 2)) {
                    if (this.reservation !== '') {
                      this.reservation += ', '
                    }
                    this.reservation += this.participantParticipant[index + 1].trim()
                  } else {
                    this.reservation += ''
                  }
                  break
                case 5:
                  this.participantAnnotations[index + 1] = element[index2].replace(/§§§/g, ' / ')
                  break
                case 6:
                  this.participantAction[index + 1] = element[index2]
                  break
                case 7:
                  this.participantReaction[index + 1] = element[index2]
                  break
                default:
                  break
              }
            }
          }

          if (this.reservation !== '') {
            this.reservation += ','
          }
          _constAnnotationsMatchOriginal.value = _annotationsMatch
          _constAnnotationsMatch.value = _annotationsMatch.replace(/§§§/g, '\n').replace('<STANDARDTEXT>', 'Wer reserviert Plätze (' + parseInt(_time.substr(0, 2) - 2) + ':' + _time.substr(3, 2) + '): ' + this.reservation + ' die Fahne und die Socken')
        })
        .catch((err) => {
          console.log(err)
        })
    },

    getTableTicket (_matchName) {
      this.ticketIndex = []
      this.ticketPosition = []
      this.ticket = []
      this.ticketParticipant = []
      this.ticketArrival = []
      this.ticketAnnotations = []
      this.ticketAction = []
      this.ticketReaction = []

      console.log('URLParticipant: ' + this.URLParticipant + '&func=ReadTickets&match=' + _matchName)
      this.$axios(`${this.URLParticipant}&func=ReadTickets&match=${_matchName}`)
        .then((res) => {
          this.tableTicket = res.data.split('\n')
          for (let index = 0; index < this.tableTicket.length - 1; index++) {
            const element = this.tableTicket[index].split(',')
            for (let index2 = 0; index2 < element.length; index2++) {
              switch (index2) {
                case 0:
                  this.ticketIndex[index + 1] = index + 1
                  this.ticketPosition[index + 1] = element[index2]
                  break
                case 3:
                  this.ticketParticipant[index + 1] = element[index2]
                  break
                case 4:
                  this.ticketArrival[index + 1] = element[index2]
                  break
                case 5:
                  this.ticketAnnotations[index + 1] = element[index2]
                  break
                case 6:
                  this.ticketAction[index + 1] = element[index2]
                  break
                case 7:
                  this.ticketReaction[index + 1] = element[index2]
                  break
                default:
                  break
              }

              if (this.ticketAction[index + 1] === 'brauche Karte') {
                this.ticket[index + 1] = '??? an ' + this.ticketParticipant[index + 1]
              } else {
                if (this.ticketAction[index + 1] === 'meine Karte ist frei') {
                  if (this.ticketReaction[index + 1] !== '') {
                    this.ticket[index + 1] = this.ticketParticipant[index + 1] + ' an ' + this.ticketReaction[index + 1]
                  } else { this.ticket[index + 1] = this.ticketParticipant[index + 1] + ' an ???' }
                }
              }
            }
          }
          console.log('ticketIndex: ' + this.ticketIndex)
          console.log('ticketPosition: ' + this.ticketPosition)
          console.log('ticketParticipant: ' + this.ticketParticipant)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    getTableTicketRequired (_matchName) {
      this.ticketRequiredIndex = []
      this.ticketRequiredPosition = []
      this.ticketRequiredParticipant = []

      console.log('URLParticipant: ' + this.URLParticipant + '&func=ReadTicketsRequired&match=' + _matchName)
      this.$axios(`${this.URLParticipant}&func=ReadTicketsRequired&match=${_matchName}`)
        .then((res) => {
          this.tableTicket = res.data.split('\n')
          for (let index = 0; index < this.tableTicket.length - 1; index++) {
            const element = this.tableTicket[index].split(',')
            for (let index2 = 0; index2 < element.length; index2++) {
              switch (index2) {
                case 0:
                  this.ticketRequiredIndex[index + 1] = index + 1
                  this.ticketRequiredPosition[index + 1] = element[index2]
                  break
                case 3:
                  this.ticketRequiredParticipant[index + 1] = element[index2]
                  break
                default:
                  break
              }
            }
          }
          console.log('ticketRequiredIndex: ' + this.ticketRequiredIndex)
          console.log('ticketRequiredPosition: ' + this.ticketRequiredPosition)
          console.log('ticketRequiredParticipant: ' + this.ticketRequiredParticipant)

          _constTicketAssignmentRequiredElements.length = 0
          for (let index = 1; index < this.ticketRequiredParticipant.length; index++) {
            _constTicketAssignmentRequiredElements[index - 1] = this.ticketRequiredParticipant[index]
          }
          console.log('_constTicketAssignmentRequiredElements: ' + _constTicketAssignmentRequiredElements)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    getTableTicketGiven (_matchName) {
      this.ticketGivenIndex = []
      this.ticketGivenPosition = []
      this.ticketGivenParticipant = []

      console.log('URLParticipant: ' + this.URLParticipant + '&func=ReadTicketsGiven&match=' + _matchName)
      this.$axios(`${this.URLParticipant}&func=ReadTicketsGiven&match=${_matchName}`)
        .then((res) => {
          this.tableTicket = res.data.split('\n')
          for (let index = 0; index < this.tableTicket.length - 1; index++) {
            const element = this.tableTicket[index].split(',')
            for (let index2 = 0; index2 < element.length; index2++) {
              switch (index2) {
                case 0:
                  this.ticketGivenIndex[index + 1] = index + 1
                  this.ticketGivenPosition[index + 1] = element[index2]
                  break
                case 3:
                  this.ticketGivenParticipant[index + 1] = element[index2]
                  break
                default:
                  break
              }
            }
          }
          console.log('ticketGivenIndex: ' + this.ticketGivenIndex)
          console.log('ticketGivenPosition: ' + this.ticketGivenPosition)
          console.log('ticketGivenParticipant: ' + this.ticketGivenParticipant)

          _constTicketAssignmentGivenElements.length = 0
          for (let index = 1; index < this.ticketGivenParticipant.length; index++) {
            _constTicketAssignmentGivenElements[index - 1] = this.ticketGivenParticipant[index]
          }
          console.log('_constTicketAssignmentGivenElements: ' + _constTicketAssignmentGivenElements)
        })
        .catch((err) => {
          console.log(err)
        })
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
