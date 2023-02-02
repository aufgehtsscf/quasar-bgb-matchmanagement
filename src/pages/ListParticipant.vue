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
        @click="onPositionMatchMainClick"
      >
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

  <div class="q-pa-md" style="max-width: 500px">
    <q-toolbar class="bg-primary text-white">
        {{ txtMatchName }}
    </q-toolbar>
  </div>

  <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">

    <div class="q-gutter-y-md column" style="max-width: 470px">
      <q-input dark outlined v-model="txtAnnotationsMatch" input-class="text-overline"
        type="textarea" :readonly="true">
      </q-input>
    </div>

    <div class="q-pa-md" style="max-width: 470px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title class="text-overline">Anwesend (Ankunft)</q-toolbar-title>
        <q-btn class="bg-white text-primary" icon="add" label="Neu" @click="addParticipant = true" />
      </q-toolbar>
    </div>

    <q-list dark bordered separator style="max-width: 470px" v-for="i in participantIndex"
      :key="i"
      v-ripple>
      <q-item clickable v-ripple @click="onParticipantClick(participantPosition[i], participantParticipant[i], participantArrival[i], participantAnnotations[i], participantAction[i], participantReaction[i])" v-if="i > 0">
        <q-item-section>
          <q-item-label overline>{{ participantParticipant[i] }}</q-item-label>
          <q-item-label caption>{{ participantArrival[i] }}</q-item-label>
          <q-item-label caption v-if="participantReaction[i]">habe Karte von {{ participantReaction[i] }}</q-item-label>
          <q-item-label caption>{{ participantAnnotations[i] }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <div class="q-pa-md" style="max-width: 470px">
    <q-toolbar class="bg-primary text-white">
        <q-toolbar-title class="text-overline">Karte weitergegeben oder bedarf</q-toolbar-title>
    </q-toolbar>
  </div>

    <q-list dark bordered separator style="max-width: 470px" v-for="i in ticketIndex"
      :key="i"
      v-ripple>
      <q-item clickable v-ripple @click="onTicketClick()" v-if="i > 0">
        <q-item-section>
          <q-item-label overline>{{ ticket[i] }}</q-item-label>
          <q-item-label caption>{{ ticketAnnotations[i] }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="addParticipant" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Teilnahme ändern</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="txtParticipantNew" autofocus label="Name" />
            <q-select v-model="txtActionNew" :options="cbxActionOptions" label="Aktion" />
            <q-select v-model="txtArrivalNew" :options="cbxArrivalOptions" label="Ankunft" />
            <q-input dense v-model="txtAnnotationsParticipantNew"  label="Kommentar"/>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addParticipantSave(txtParticipantNew, txtArrivalNew, txtAnnotationsParticipantNew, txtActionNew, txtMatchName, txtTime, txtAnnotationsMatchOriginal)"  v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="editParticipant" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Teilnahme ändern</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="txtParticipant" autofocus label="Name" />
            <q-select v-model="txtAction" :options="cbxActionOptions" label="Aktion" />
            <q-select v-model="txtArrival" :options="cbxArrivalOptions" label="Ankunft" />
            <q-input class="text-italic" dense v-model="txtReaction" :readonly="true" />
            <q-input dense v-model="txtAnnotationsParticipant"  label="Kommentar"/>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editParticipantSave(intParticipantPosition, txtParticipant, txtArrival, txtAnnotationsParticipant, txtAction, txtMatchName, txtTime, txtAnnotationsMatchOriginal)"  v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
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

const _constPosition = ref('')
const _constParticipant = ref('')
const _constArrival = ref('')
const _constAnnotationsParticipant = ref('')
const _constAction = ref('')
const _constReaction = ref('')

export default {
  name: 'ListParticipant',

  setup () {
    return {
      txtMatchName: ref(_constMatchName),
      txtTime: ref(_constTime),
      txtAnnotationsMatchOriginal: ref(_constAnnotationsMatchOriginal),
      txtAnnotationsMatch: ref(_constAnnotationsMatch),
      cbxArrivalOptions: ref(_constArrivalElements),

      addParticipant: ref(false),
      editParticipant: ref(false),

      intParticipantPosition: ref(_constPosition),
      txtParticipant: ref(_constParticipant),
      txtArrival: ref(_constArrival),
      txtAnnotationsParticipant: ref(_constAnnotationsParticipant),
      txtAction: ref(_constAction),
      cbxActionOptions: ['bin dabei', 'brauche Karte', 'meine Karte ist frei'],
      txtReaction: ref(_constReaction),

      txtParticipantNew: ref(''),
      txtArrivalNew: ref(''),
      txtAnnotationsParticipantNew: ref(''),
      txtActionNew: ref('bin dabei')
    }
  },

  data () {
    return {
      URLMatch: 'https://script.google.com/macros/s/AKfycbxnei8jcKTw_SBb0Qr5k5Z4KgEzxDGQERJD4YDoOND0CRw9cOCIU5Xv7ciyG_EBkO8uXA/exec?ID=1znyBnIzqghCeRImZ8fSVGB_gR6TESuqep20YbUhkhSU&SH=BGB-Match',
      URLParticipant: 'https://script.google.com/macros/s/AKfycbyGo9ysE4UNyuwgQNgW_IbNEUwQzoEDfDfk1lXG37pCqIriOWbKKqpOB3AgC8PdA1JAFA/exec?ID=1HCZKuGO-dmNJwrEsFyN2acvnE-WMHabBW8jWdhO4ggI&SH=BGB-Participant',
      URLParticipantNew: 'https://docs.google.com/forms/d/e/1FAIpQLSdMIFLm68GqFVDdW-s9EiescjDx7AfkTSzOE28IgG65Gx5myQ/formResponse',

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
      ticketAnnotations: [],
      ticketAction: [],
      ticketReaction: []
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
    },

    onParticipantClick (_position, _participant, _arrival, _annotations, _action, _reaction) {
      console.log('Clicked on an Participant: ' + _position + ', ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _reaction)
      _constPosition.value = _position
      _constParticipant.value = _participant
      _constArrival.value = _arrival
      _constAnnotationsParticipant.value = _annotations
      _constAction.value = _action
      if (_reaction !== '') {
        _constReaction.value = 'habe Karte von ' + _reaction
      } else {
        _constReaction.value = _reaction
      }

      this.editParticipant = true
    },

    addParticipantSave (_participant, _arrival, _annotations, _action, _matchName, _time, _annotationsMatch) {
      console.log('addParticipantSave: ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      if (_participant !== '') {
        this.$axios(`${this.URLParticipantNew}?entry.1340026337=${encodeURI(_matchName)}&entry.1408155791=${encodeURI(_participant.replace(',', ' '))}&entry.2086717190=${_arrival}&entry.641659827=${encodeURI(_annotations.replace(',', ';'))}&entry.442709721=${_action}`)
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

    editParticipantSave (_position, _participant, _arrival, _annotations, _action, _matchName, _time, _annotationsMatch) {
      console.log('editParticipantSave: ' + _position + ', ' + _participant + ', ' + _arrival + ', ' + _annotations + ', ' + _action + ', ' + _matchName + ', ' + _time + ', ' + _annotationsMatch)

      if (_participant !== '') {
        this.$axios(`${this.URLParticipant}&func=Update&index=${_position}&participant=${encodeURI(_participant.replace(',', ' '))}&arrival=${_arrival}&annotations=${encodeURI(_annotations.replace(',', ';'))}&action=${_action}`)
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

      console.log('URLParticipant: ' + this.URLParticipant + '&func=Read&match=' + _matchName)
      this.$axios(`${this.URLParticipant}&func=Read&match=${_matchName}`)
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
