<template>
  <q-page>

    <!-- Member area (Titel) -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>Mitglieder</q-toolbar-title>
        <q-btn class="bg-white text-primary" icon="add" label="Neu" @click="addMember = true" />
      </q-toolbar>
    </div>

    <!-- List of Members -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="(member, i) in memberObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onMemberClick(member.row, member.memberId, member.member, member.avatar)">
          <q-item-section avatar>
            <q-avatar size="50px" color="pink-10" text-color="white" v-if="member.avatar === ''">
              {{ member.member.substring(0, 1) }}
              <q-badge floating color="teal">{{ member.numberOfParticipations }}</q-badge>
            </q-avatar>
            <q-avatar size="50px" v-if="member.avatar !== ''">
              <img :src="getAvatar(getCookie('clientName'), member.avatar, member.customized === 'TRUE')">
              <q-badge floating color="teal">{{ member.numberOfParticipations }}</q-badge>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label overline>{{ member.member }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Dialogs -->
    <div class="q-pa-md q-gutter-sm">

      <!-- Start Dialogs Member -->
      <!-- Add Member -->
      <q-dialog v-model="addMember" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Mitglied erfassen</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="txtMemberNew" autofocus label="Mitglied" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
              filled
              v-model="txtAvatarNew"
              :options="avatarImages"
              label="Avatar"
              options-selected-class="text-deep-orange"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-avatar size="50px">
                      <img :src="scope.opt.avatar">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addMemberSave(txtMemberNew, txtAvatarNew.value)" :disable="txtMemberNew === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit Member -->
      <q-dialog v-model="editMember" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Mitglied ändern</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="txtMember" autofocus label="Mitglied" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
              filled
              v-model="txtAvatar"
              :options="avatarImages"
              label="Avatar"
              options-selected-class="text-deep-orange"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-avatar size="50px">
                      <img :src="scope.opt.avatar">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>

          <div class="q-pa-md q-gutter-sm" style="height: 80px">
            <q-avatar
              v-for="(el, n) in inactiveMatchObject"
              :key="n"
              size="40px"
              class="overlapping"
              :style="`left: ${n * 32}px`"
            >
              <img :src="getTeamImage(el.awayTeam)" v-if="n <= 9 && el.awayTeam !== ''">
              <img :src="getEventImage(el.matchName)" v-if="n <= 9 && el.awayTeam === ''">
            </q-avatar>
          </div>

          <div class="q-pa-md q-gutter-sm" style="height: 80px">
            <q-avatar
              v-for="(el, n) in inactiveMatchObject"
              :key="n"
              size="40px"
              class="overlapping"
              :style="`left: ${(n - 10) * 32}px`"
            >
              <img :src="getTeamImage(el.awayTeam)" v-if="n > 9 && n <= 19 && el.awayTeam !== ''">
              <img :src="getEventImage(el.matchName)" v-if="n > 9 && n <= 19 && el.awayTeam === ''">
            </q-avatar>
          </div>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" color="primary" @click="delMember = true" v-if="getCookie('isAdministrator') === 'true'" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editMemberSave(intMemberRow, txtMemberId, txtMember, txtMemberOld, txtAvatar.value)" :disable="txtMember === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete Member -->
      <q-dialog v-model="delMember" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="primary" text-color="white" />
            <span class="q-ml-sm">Datensatz löschen?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Nein" color="primary" v-close-popup />
            <q-btn flat label="Ja" color="primary" @click="deleteMember(intMemberRow, txtMemberId)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- End Dialogs Member -->
    </div>

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import useQuasar from 'quasar/src/composables/use-quasar.js'
import { getCookie, getAdminCode, getAvatar, getTeamImage, getEventImage, teamImages, avatarImages, URLMemberBasis, URLParticipantArchiveBasis, URLMatchBasis } from 'src/boot/utils.js'
import { ref } from 'vue'

const _constMemberRow = ref(0)
const _constMemberId = ref('')
const _constMember = ref('')
const _constMemberOld = ref('')
const _constAvatar = ref('')

let _URLMember
let _URLParticipantArchive
let _URLMatch

export default {
  name: 'ListMember',

  setup () {
    const $q = useQuasar()

    return {
      intMemberRow: ref(_constMemberRow),
      txtMemberId: ref(_constMemberId),
      txtMember: ref(_constMember),
      txtMemberOld: ref(_constMemberOld),
      txtAvatar: ref(_constAvatar),

      txtMemberNew: ref(''),
      txtAvatarNew: ref(''),

      onMemberCreated () {
        $q.notify({
          type: 'positive',
          message: 'Mitglieder wurde erfolgreich erfasst!'
        })
      },

      onMemberUpdated () {
        $q.notify({
          type: 'positive',
          message: 'Mitglieder wurde erfolgreich aktualisiert!'
        })
      },

      onMemberDeleted () {
        $q.notify({
          message: 'Mitglieder wurde erfolgreich gelöscht!',
          color: 'orange'
        })
      },

      onMemberAlreadyExists () {
        $q.notify({
          type: 'negative',
          message: 'Dieses Mitglied besteht bereits!'
        })
      },

      addMember: ref(false),
      editMember: ref(false),
      delMember: ref(false)
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
      avatarImages,
      URLMemberBasis,
      URLParticipantArchiveBasis,
      URLMatchBasis,

      memberObject: [
        {
          row: '',
          memberId: '',
          member: '',
          avatar: '',
          customized: '',
          numberOfParticipations: ''
        }
      ],

      inactiveMatchObject: [
        {
          homeTeam: '',
          awayTeam: '',
          matchName: ''
        }
      ],

      matchObject: [
        {
          matchId: '',
          homeTeam: '',
          awayTeam: '',
          matchName: ''
        }
      ]

    }
  },

  computed: {
  },

  mounted () {
    this.setVariables()
    this.getTableMember()
    this.getTableMatch()
  },

  methods: {
    setVariables () {
      _URLMember = URLMemberBasis + '?sh=' + getAdminCode(getCookie('applicationCode'))
      _URLParticipantArchive = URLParticipantArchiveBasis + '?sh=' + getAdminCode(getCookie('applicationCode'))
      _URLMatch = URLMatchBasis + '?sh=' + getAdminCode(getCookie('applicationCode'))
    },

    getTableMember () {
      this.memberObject = []

      // console.log('URLMember: ' + _URLMember + '&func=Read')
      this.$axios(`${_URLMember}&func=Read`)
        .then((res) => {
          this.tableMember = res.data.split('\n')
          for (let index = 0; index < this.tableMember.length - 1; index++) {
            const element = this.tableMember[index].split(',')

            // console.log('URLParticipantArchive: ' + _URLParticipantArchive + '&func=ReadParticipant&participant=' + element[3].trim())
            let _numberOfParticipations = 0
            this.$axios(`${_URLParticipantArchive}&func=ReadParticipant&participant=${element[3].trim()}`)
              .then((res2) => {
                this.tableParticipantArchive = res2.data.split('\n')
                _numberOfParticipations = this.tableParticipantArchive.length - 1
                this.setMemberObject(element[0], element[1], element[3].trim(), element[4].trim(), element[5], _numberOfParticipations)
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

    setMemberObject (_row, _memberId, _member, _avatar, _customized, _numberOfParticipations) {
      this.memberObject.push({ row: parseInt(_row), memberId: _memberId, member: _member, avatar: _avatar, customized: _customized, numberOfParticipations: _numberOfParticipations })

      // Sort array of objects
      this.memberObject.sort(function (a, b) {
        const _numberOfParticipationsA = a.numberOfParticipations
        const _numberOfParticipationsB = b.numberOfParticipations

        if (_numberOfParticipationsA > _numberOfParticipationsB) return -1
        if (_numberOfParticipationsA < _numberOfParticipationsB) return 1
        return 0
      })
    },

    getTableMatch () {
      this.matchObject = []

      // console.log('URLMatch: ' + _URLMatch + '&func=ReadInactive')
      this.$axios(`${_URLMatch}&func=ReadInactive`)
        .then((res) => {
          this.tableMatch = res.data.split('\n')
          for (let index = 0; index < this.tableMatch.length - 1; index++) {
            const element = this.tableMatch[index].split(',')
            this.setMatchObject(element[1], element[3].trim(), element[4].trim(), element[5].trim())
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setMatchObject (_matchId, _homeTeam, _awayTeam, _matchName) {
      this.matchObject.push({ matchId: _matchId, homeTeam: _homeTeam, awayTeam: _awayTeam, matchName: _matchName })
    },

    onMemberClick (_row, _memberId, _member, _avatar) {
      // console.log('Clicked on Member: ' + _row + ', ' + _memberId + ', ' + _member + ', ' + _avatar)
      _constMemberRow.value = _row
      _constMemberId.value = _memberId
      _constMember.value = _member
      _constMemberOld.value = _member
      _constAvatar.value = _avatar

      this.inactiveMatchObject = []
      // console.log('URLParticipantArchive: ' + _URLParticipantArchive + '&func=ReadParticipant&participant=' + _member)
      this.$axios(`${_URLParticipantArchive}&func=ReadParticipant&participant=${_member}`)
        .then((res) => {
          this.tableParticipantArchive = res.data.split('\n')
          for (let index = 0; index < this.tableParticipantArchive.length - 1; index++) {
            const element = this.tableParticipantArchive[index].split(',')
            const _homeTeam = this.matchObject.find(el => el.matchId === element[2]).homeTeam
            const _awayTeam = this.matchObject.find(el => el.matchId === element[2]).awayTeam
            const _matchName = this.matchObject.find(el => el.matchId === element[2]).matchName
            this.setInactiveMatchObject(_homeTeam, _awayTeam, _matchName)
          }
        })
        .catch((err) => {
          console.log(err)
        })

      this.editMember = true
    },

    setInactiveMatchObject (_homeTeam, _awayTeam, _matchName) {
      this.inactiveMatchObject.push({ homeTeam: _homeTeam, awayTeam: _awayTeam, matchName: _matchName })
    },

    addMemberSave (_member, _avatar) {
      // console.log('addMemberSave: ' + _member + ', ' + _avatar)

      const _members = this.memberObject.map(el => el.member)
      const _memberExists = _members.includes(_member)
      if (_memberExists) {
        this.onMemberAlreadyExists()
      } else {
        this.$axios(`${_URLMember}&func=Add&member=${encodeURI(_member.replace(',', ' '))}&avatar=${_avatar}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.onMemberCreated()
              this.getTableMember()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    editMemberSave (_row, _memberId, _member, _memberOld, _avatar) {
      // console.log('editMemberSave: ' + _row + ', ' + _memberId + ', ' + _member + ', ' + _memberOld + ', ' + _avatar)

      if (typeof _avatar === 'undefined') _avatar = _constAvatar.value

      const _members = this.memberObject.map(el => el.member)
      const _memberExists = _members.includes(_member) && _member !== _memberOld
      if (_memberExists) {
        this.onMemberAlreadyExists()
      } else {
        this.$axios(`${_URLMember}&func=Update&row=${_row}&memberId=${_memberId}&member=${encodeURI(_member.replace(',', ' '))}&avatar=${_avatar}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.onMemberUpdated()
              this.getTableMember()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    deleteMember (_row, _memberId) {
      // console.log('deleteMember: ' + _row + ', ' + _memberId)

      this.$axios(`${_URLMember}&func=Delete&row=${_row}&memberId=${_memberId}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.onMemberDeleted()
            this.getTableMember()
            this.editMember = false
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
