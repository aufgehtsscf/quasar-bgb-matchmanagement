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
            <q-item-label caption v-if="participantReaction[i] !== ''">{{ participantReaction[i] }}</q-item-label>
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
            <q-btn icon="delete" color="primary" @click="delParticipant = true" v-if="IsAdministrator && txtParticipantReaction === ''" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editParticipantSave(intParticipantPosition, txtParticipantParticipant, txtParticipantArrival, txtParticipantAnnotations, txtParticipantAction, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" :disable="txtParticipantParticipant === ''" v-close-popup />
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
            <q-btn flat label="Ja" color="primary" @click="deleteParticipant(intParticipantPosition, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" v-close-popup />
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
            <q-btn icon="save" label="Speichern" @click="editTicketAssignmentSave(intTicketAssignmentPosition, txtTicketParticipant, txtTicketArrival, txtTicketAnnotations, txtTicketAction, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" :disable="txtTicketParticipant === ''" v-close-popup />
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
            <q-btn flat label="Ja" color="primary" @click="deleteTicketAssignment(intTicketAssignmentPosition, txtMatchName, txtTime, txtAnnotationsMatchOriginal)" v-close-popup />
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
      IsAdministrator: ref(true),

      txtMatchName: ref(_constMatchName),
      txtTime: ref(_constTime),
      txtAnnotationsMatchOriginal: ref(_constAnnotationsMatchOriginal),
      txtAnnotationsMatch: ref(_constAnnotationsMatch),
      cbxArrivalOptions: ref(_constArrivalElements),

      addParticipant: ref(false),
      editParticipant: ref(false),
      delParticipant: ref(false),
      share: ref(false),

      addTicketAssignment: ref(false),
      editTicketAssignment: ref(false),
      editTicketAssigned: ref(false),
      delTicketAssignment: ref(false),
      delTicketAssigned: ref(false),

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
      URLMatch: 'https://script.google.com/macros/s/AKfycbyh43MSF1Vz9W3TZ0_9e273B81CtCEk4se3yHj9HCbIvBlfw9g6tHE3d5O8eXW3yIkyog/exec?ID=1znyBnIzqghCeRImZ8fSVGB_gR6TESuqep20YbUhkhSU&SH=BGB-Match',
      URLParticipant: 'https://script.google.com/macros/s/AKfycbwGqO4HvU8gFHlxV_5VhwRVwcmESTGLhD50O_wqgCOhDfik2FhUYLScUqxUuYaAiuIZjA/exec?ID=1HCZKuGO-dmNJwrEsFyN2acvnE-WMHabBW8jWdhO4ggI&SH=BGB-Participant',
      URLWhereIsMyCard: 'https://script.google.com/macros/s/AKfycbxvZGxE36y7SOsB3ebFVPDlz4C3HYROautgYqbLE5aO1eD7JVWNBqD-49JsP182OAV_/exec?ID=1AA2nnIb886xaBjpSaxwf2JNtujKnJc4xSVR-ChRGs2U&SH=BGB-WhereIsMyCard',

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
      participantListElement: [],
      participantArrival: [],
      participantAnnotations: [],
      participantAction: [],
      participantReaction: [],
      reservation: '',

      ticketIndex: [],
      ticketPosition: [],
      ticket: [],
      ticketParticipant: [],
      ticketListElement: [],
      ticketArrival: [],
      ticketAnnotations: [],
      ticketAction: [],
      ticketReaction: [],

      ticketGivenIndex: [],
      ticketGivenPosition: [],
      ticketGivenParticipant: [],

      ticketRequiredIndex: [],
      ticketRequiredPosition: [],
      ticketRequiredParticipant: [],

      ticketAssignedIndex: [],
      ticketAssignedPosition: [],
      ticketAssignedParticipant: [],

      whereIsMyCardCardHolder: [],
      whereIsMyCardDiscounted: [],
      whereIsMyCardWhoHasTheCard: []
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
      _constShare.value = _matchName + '\n\nAnwesend (Ankunft):\n' + _constParticipantList.value
      _constShare.value += '\nKarte weitergeben oder bedarf:\n' + _constTicketList.value
      _constShare.value += '\n' + _constAnnotationsMatch.value
      this.share = true
    },

    onParticipantClick (_participantPosition, _participant, _arrival, _annotations, _action, _reaction) {
      console.log('Clicked on Participant: ' + _participantPosition + ', ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _reaction)
      _constParticipantPosition.value = _participantPosition
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

      this.$axios(`${this.URLParticipant}&func=Add&match=${_matchName}&participant=${encodeURI(_participant.replace(',', ' '))}&arrival=${_arrival}&annotations=${encodeURI(_annotations.replace(',', ';'))}&action=${_action}&reaction=`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.loadReloadData(_matchName, _time, _annotationsMatch)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    editParticipantSave (_participantPosition, _participant, _arrival, _annotations, _action, _matchName, _time, _annotationsMatch) {
      console.log('editParticipantSave: ' + _participantPosition + ', ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

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
    },

    deleteParticipant (_participantPosition, _matchName, _time, _annotationsMatch) {
      console.log('deleteParticipant: ' + _participantPosition + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

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

      let _ticketAssignmentGivenPosition = 0
      for (let index = 1; index < this.ticketGivenParticipant.length; index++) {
        const element = this.ticketGivenParticipant[index]

        if (element === _ticketAssignmentGiven) {
          _ticketAssignmentGivenPosition = this.ticketGivenPosition[index]
          break
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
          break
        }
      }

      console.log(this.URLParticipant + '&func=UpdateTicketRequired&index=' + _ticketAssignmentRequiredPosition + '&action=bin dabei&reaction=' + _ticketAssignmentGiven)
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

    deleteTicketAssigned (_ticketAssignedGiven, _ticketAssignedRequired, _matchName, _time, _annotationsMatch) {
      console.log('deleteTicketAssigned: ' + _ticketAssignedGiven + ', ' + _ticketAssignedRequired + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      let _ticketAssignedGivenPosition = 0
      for (let index = 1; index < this.ticketAssignedParticipant.length; index++) {
        const element = this.ticketAssignedParticipant[index]

        if (element === _ticketAssignedGiven) {
          _ticketAssignedGivenPosition = this.ticketAssignedPosition[index]
          break
        }
      }
      this.$axios(`${this.URLParticipant}&func=UpdateTicketGiven&index=${_ticketAssignedGivenPosition}&reaction=`)
        .catch((err) => {
          console.log(err)
        })

      let _ticketAssignedRequiredPosition = 0
      for (let index = 1; index < this.ticketAssignedParticipant.length; index++) {
        const element = this.ticketAssignedParticipant[index]

        if (element === _ticketAssignedRequired) {
          _ticketAssignedRequiredPosition = this.ticketAssignedPosition[index]
          break
        }
      }
      this.$axios(`${this.URLParticipant}&func=UpdateTicketRequired&index=${_ticketAssignedRequiredPosition}&action=brauche Karte&reaction=`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.editTicketAssigned = false
            this.loadReloadData(_matchName, _time, _annotationsMatch)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    editTicketAssignmentSave (_ticketAssignmentPosition, _participant, _arrival, _annotations, _action, _matchName, _time, _annotationsMatch) {
      console.log('editTicketAssignmentSave: ' + _ticketAssignmentPosition + ', ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      if (_action !== 'bin dabei') _arrival = ''

      this.$axios(`${this.URLParticipant}&func=Update&index=${_ticketAssignmentPosition}&participant=${encodeURI(_participant.replace(',', ' '))}&arrival=${_arrival}&annotations=${encodeURI(_annotations.replace(',', ';'))}&action=${_action}`)
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

    deleteTicketAssignment (_ticketAssignmentPosition, _matchName, _time, _annotationsMatch) {
      console.log('deleteTicketAssignment: ' + _ticketAssignmentPosition + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      this.$axios(`${this.URLParticipant}&func=Delete&index=${_ticketAssignmentPosition}`)
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
      this.participantIndex = []
      this.participantPosition = []
      this.participantMatch = []
      this.participantParticipant = []
      this.participantListElement = []
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
                  this.participantListElement[index] = element[index2]
                  break
                case 4:
                  this.participantArrival[index + 1] = element[index2].substr(0, 5)
                  this.participantListElement[index] += ' (' + element[index2].substr(0, 5) + ')'
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
                  this.participantAnnotations[index + 1] = element[index2].replace(/§§§/g, '\n').trim()
                  if (this.participantAnnotations[index + 1] !== '') {
                    this.participantListElement[index] += ' (' + this.participantAnnotations[index + 1] + ')'
                  }
                  break
                case 6:
                  this.participantAction[index + 1] = element[index2]
                  break
                case 7:
                  this.participantReaction[index + 1] = ''
                  if (element[index2] !== '') {
                    this.participantReaction[index + 1] = 'habe Karte von ' + element[index2]

                    for (let index3 = 1; index3 < this.whereIsMyCardCardHolder.length; index3++) {
                      const element3 = this.whereIsMyCardCardHolder[index3]

                      if (element3 === element[index2]) {
                        this.participantReaction[index + 1] = this.participantReaction[index + 1].trim() + ' (Karte bei ' + this.whereIsMyCardWhoHasTheCard[index3] + ')'
                        break
                      }
                    }
                    this.participantListElement[index] += ', ' + this.participantReaction[index + 1]
                  }
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

          _constParticipantList.value = ''
          this.participantListElement.forEach(element => {
            _constParticipantList.value += element + '\n'
          })
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
      this.ticketListElement = []
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
                  this.ticketAnnotations[index + 1] = element[index2].replace(/§§§/g, '\n').trim()
                  break
                case 6:
                  this.ticketAction[index + 1] = element[index2]
                  if (this.ticketAction[index + 1] === 'brauche Karte') {
                    this.ticketListElement[index] = '??? an ' + this.ticketParticipant[index + 1] + ' (' + this.ticketAnnotations[index + 1] + ')'
                  }
                  break
                case 7:
                  this.ticketReaction[index + 1] = element[index2]
                  if (this.ticketAction[index + 1] === 'meine Karte ist frei') {
                    this.ticketListElement[index] = this.ticketParticipant[index + 1]
                    if (this.ticketReaction[index + 1] === '') {
                      this.ticketListElement[index] += ' an ???'
                    } else {
                      this.ticketListElement[index] += ' an ' + this.ticketReaction[index + 1]
                    }
                  }
                  if (this.ticketAnnotations[index + 1] !== '') {
                    this.ticketListElement[index] += ' (' + this.ticketAnnotations[index + 1] + ')'
                  }
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

          _constTicketList.value = ''
          this.ticketListElement.forEach(element => {
            _constTicketList.value += element + '\n'
          })
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
          _constTicketAssignmentGivenElements.length = 0
          for (let index = 1; index < this.ticketGivenParticipant.length; index++) {
            _constTicketAssignmentGivenElements[index - 1] = this.ticketGivenParticipant[index]
          }
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
          _constTicketAssignmentRequiredElements.length = 0
          for (let index = 1; index < this.ticketRequiredParticipant.length; index++) {
            _constTicketAssignmentRequiredElements[index - 1] = this.ticketRequiredParticipant[index]
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    getTableTicketAssigned (_matchName) {
      this.ticketAssignedIndex = []
      this.ticketAssignedPosition = []
      this.ticketAssignedParticipant = []

      console.log('URLParticipant: ' + this.URLParticipant + '&func=ReadTicketsAssigned&match=' + _matchName)
      this.$axios(`${this.URLParticipant}&func=ReadTicketsAssigned&match=${_matchName}`)
        .then((res) => {
          this.tableTicket = res.data.split('\n')
          for (let index = 0; index < this.tableTicket.length - 1; index++) {
            const element = this.tableTicket[index].split(',')
            for (let index2 = 0; index2 < element.length; index2++) {
              switch (index2) {
                case 0:
                  this.ticketAssignedIndex[index + 1] = index + 1
                  this.ticketAssignedPosition[index + 1] = element[index2]
                  break
                case 3:
                  this.ticketAssignedParticipant[index + 1] = element[index2]
                  break
                default:
                  break
              }
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    getTableWhereIsMyCard () {
      this.whereIsMyCardCardHolder = []
      this.whereIsMyCardDiscounted = []
      this.whereIsMyCardWhoHasTheCard = []

      console.log('URLWhereIsMyCard: ' + this.URLWhereIsMyCard + '&func=Read&cardholder=')
      this.$axios(`${this.URLWhereIsMyCard}&func=Read&cardholder=`)
        .then((res) => {
          this.tableWhereIsMyCard = res.data.split('\n')
          for (let index = 0; index < this.tableWhereIsMyCard.length - 1; index++) {
            const element = this.tableWhereIsMyCard[index].split(',')
            for (let index2 = 0; index2 < element.length; index2++) {
              switch (index2) {
                case 2:
                  this.whereIsMyCardCardHolder[index + 1] = element[index2]
                  break
                case 3:
                  this.whereIsMyCardDiscounted[index + 1] = element[index2]
                  break
                case 4:
                  this.whereIsMyCardWhoHasTheCard[index + 1] = element[index2]
                  break
                default:
                  break
              }
            }
          }
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

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 500px
</style>
