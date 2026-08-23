<template>
  <q-page>

    <!-- Member area (Titel) -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title class="text-overline">Mitglieder ({{ memberObject.length }})</q-toolbar-title>
        <q-btn class="bg-white text-primary" icon="add" label="Neu" @click="addMember = true" />
      </q-toolbar>
    </div>

    <div class="q-pa-md q-gutter-y-md column items-start">
      <q-btn-dropdown color="primary" glossy text-color="white" push :label="selectedSeason || 'Saison auswählen'">
        <q-list>
          <q-item v-for="season in seasonOptions" :key="season" clickable v-close-popup @click="selectSeason(season)">
            <q-item-section>{{ season }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <!-- List of Members -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="(member, i) in memberObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onMemberClick(member.memberId, member.member, member.avatar, member.customized, member.numberOfParticipations)">
          <q-item-section avatar>
            <q-avatar size="50px" color="pink-10" text-color="white" v-if="member.avatar === ''">
              {{ member.member.substring(0, 1) }}
              <q-badge floating color="teal">{{ member.numberOfParticipations }}</q-badge>
            </q-avatar>
            <q-avatar size="50px" v-if="member.avatar !== ''">
              <img :src="getAvatar(member.avatar)">
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
            <div class="q-pt-md">
              <q-input filled dense v-model="txtMemberNew" autofocus label="Mitglied *" />
            </div>

            <div class="q-pt-md">
              <q-select
                filled dense
                v-model="txtAvatarNew"
                :options="avatarImages"
                label="Avatar *"
                :rules="[val => !!val || 'Avatar ist erforderlich']"
                options-selected-class="text-deep-orange"
                >
                <template v-slot:selected-item="scope">
                  <q-item-section avatar>
                    <q-avatar size="32px">
                      <img :src="getAvatarOptionImage(scope.opt)">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>{{ getAvatarOptionLabel(scope.opt) }}</q-item-section>
                </template>
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
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addMemberSave(txtMemberNew, getAvatarValue(txtAvatarNew))" :disable="txtMemberNew.trim() === '' || !txtAvatarNew" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit Member -->
      <q-dialog v-model="editMember" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Anzahl der Teilnahmen: {{ intNumberOfParticipations }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="q-pt-md">
              <q-input filled dense v-model="txtMember" label="Mitglied *" />
            </div>

            <div class="q-pt-md">
              <q-select
                filled dense
                v-model="txtAvatar"
                :options="avatarImages"
                label="Avatar *"
                :rules="[val => !!val || 'Avatar ist erforderlich']"
                options-selected-class="text-deep-orange"
                >
                <template v-slot:selected-item="scope">
                  <q-item-section avatar>
                    <q-avatar size="32px">
                      <img :src="getAvatarOptionImage(scope.opt)">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>{{ getAvatarOptionLabel(scope.opt) }}</q-item-section>
                </template>
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
            </div>

            <div class="q-pa-md q-gutter-sm" style="max-width: 350px; height: 80px">
              <q-avatar
                v-for="(el, n) in inactiveMatchObject"
                :key="n"
                size="40px"
                class="overlapping"
                :style="`left: ${n * 32}px`"
                >
                <img :src="getTeamImage(el.awayTeam, teamImages)" v-if="n <= 9 && el.awayTeam !== '' && el.awayTeam !== homeTeamFromTenant">
                <img :src="getTeamImage(el.homeTeam, teamImages)" v-if="n <= 9 && el.homeTeam !== '' && el.homeTeam !== homeTeamFromTenant">
                <img :src="getEventImage(el.matchName)" v-if="n <= 9 && el.homeTeam === '' && el.awayTeam === ''">
              </q-avatar>
            </div>

            <div class="q-pa-md q-gutter-sm" style="max-width: 350px; height: 80px">
              <q-avatar
                v-for="(el, n) in inactiveMatchObject"
                :key="n"
                size="40px"
                class="overlapping"
                :style="`left: ${(n - 10) * 32}px`"
                >
                <img :src="getTeamImage(el.awayTeam, teamImages)" v-if="n > 9 && n <= 19 && el.awayTeam !== '' && el.awayTeam !== homeTeamFromTenant">
                <img :src="getTeamImage(el.awayTeam, teamImages)" v-if="n > 9 && n <= 19 && el.homeTeam !== '' && el.homeTeam !== homeTeamFromTenant">
                <img :src="getEventImage(el.matchName)" v-if="n > 9 && n <= 19 && el.homeTeam === '' && el.awayTeam === ''">
              </q-avatar>
            </div>

            <div class="q-pa-md q-gutter-sm" style="max-width: 350px; height: 80px">
              <q-avatar
                v-for="(el, n) in inactiveMatchObject"
                :key="n"
                size="40px"
                class="overlapping"
                :style="`left: ${(n - 20) * 32}px`"
                >
                <img :src="getTeamImage(el.awayTeam, teamImages)" v-if="n > 19 && n <= 29 && el.awayTeam !== '' && el.awayTeam !== homeTeamFromTenant">
                <img :src="getTeamImage(el.awayTeam, teamImages)" v-if="n > 19 && n <= 29 && el.homeTeam !== '' && el.homeTeam !== homeTeamFromTenant">
                <img :src="getEventImage(el.matchName)" v-if="n > 19 && n <= 29 && el.homeTeam === '' && el.awayTeam === ''">
              </q-avatar>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" color="primary" @click="delMember = true" v-if="getCookie('isAdministrator')" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editMemberSave(txtMemberId, txtMember, txtMemberOld, getAvatarValue(txtAvatar))" :disable="txtMember.trim() === '' || !txtAvatar || boolIsCustomized" v-close-popup />
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
            <q-btn flat label="Ja" color="primary" @click="deleteMember(txtMemberId)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- End Dialogs Member -->
    </div>

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'
import { getCookie, getAdminCode, getAvatar, getTeamImage, getEventImage, URLMatchManagementAPI } from 'src/boot/utils.js'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const _constMemberId = ref('')
const _constMember = ref('')
const _constMemberOld = ref('')
const _constAvatar = ref('')
const _constIsCustomized = ref(false)
const _constNumberOfParticipations = ref('')

const _constAdminCode = ref('')
const _constHomeTeamFromTenant = ref('')

let _TenantId
let _Season
let _URLTenant
let _URLMember
let _URLParticipant
let _URLTeam
let _URLAvatar

export default {
  name: 'ListMember',

  setup () {
    const $q = useQuasar()

    return {
      varAdminCode: ref(_constAdminCode),

      txtMemberId: ref(_constMemberId),
      txtMember: ref(_constMember),
      txtMemberOld: ref(_constMemberOld),
      txtAvatar: ref(_constAvatar),
      boolIsCustomized: ref(_constIsCustomized),
      intNumberOfParticipations: ref(_constNumberOfParticipations),

      txtMemberNew: ref(''),
      txtAvatarNew: ref(''),

      homeTeamFromTenant: ref(_constHomeTeamFromTenant),

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
      avatarImages: [],
      selectedSeason: '',
      seasonOptions: [],
      URLMatchManagementAPI,
      teamImages: [],

      memberObject: [
        {
          memberId: '',
          member: '',
          avatar: '',
          customized: '',
          ImageURL: '',
          numberOfParticipations: ''
        }
      ],

      inactiveMatchObject: [
        {
          homeTeam: '',
          awayTeam: '',
          matchName: '',
          date: ''
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
          this.getTableAvatar().then(() => {
            this.getTableMember()
          })
        })
      })
    })
  },

  methods: {
    setVariables () {
      _constAdminCode.value = getAdminCode(getCookie('applicationCode'))
      _URLTenant = URLMatchManagementAPI + '/Tenant'
      _URLMember = URLMatchManagementAPI + '/Member'
      _URLParticipant = URLMatchManagementAPI + '/Participant'
      _URLTeam = URLMatchManagementAPI + '/Team'
      _URLAvatar = URLMatchManagementAPI + '/Avatar'

      this.memberObject = []
      this.teamImages = []
      this.avatarImages = []

      return Promise.resolve()
    },

    getAvatarOption (_avatar) {
      if (!_avatar) return null
      if (typeof _avatar === 'object') return _avatar

      return this.avatarImages.find((el) => el.value === _avatar || el.label === _avatar) || {
        label: _avatar,
        value: _avatar,
        avatar: ''
      }
    },

    getAvatarOptionImage (_avatar) {
      return this.getAvatarOption(_avatar)?.avatar || ''
    },

    getAvatarOptionLabel (_avatar) {
      return this.getAvatarOption(_avatar)?.label || ''
    },

    getAvatarValue (_avatar) {
      return this.getAvatarOption(_avatar)?.value || ''
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

    getTableAvatar () {
      return new Promise((resolve, reject) => {
        this.avatarImages = []

        this.$axios.get(`${_URLAvatar}/${_TenantId}`)
          .then((res) => {
            if (res.status === 200) {
              for (let index = 0; index < res.data.length; index++) {
                const avatarName = res.data[index].name.trim()
                const imageURL = res.data[index].imageURL || ''
                this.avatarImages.push({
                  label: avatarName,
                  value: avatarName.replaceAll(' ', '_'),
                  avatar: imageURL ? URLMatchManagementAPI + imageURL : ''
                })
              }
              this.avatarImages.sort((a, b) => a.label.localeCompare(b.label))
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

    getTenantId () {
      return new Promise((resolve, reject) => {
        this.$axios.get(`${_URLTenant}/code/${_constAdminCode.value}`)
          .then((res) => {
            if (res.status === 200) {
              _TenantId = res.data.id
              _Season = res.data.season
              this.selectedSeason = _Season
              this.seasonOptions = this.createSeasonOptions(_Season, res.data.creationTime)
              _constHomeTeamFromTenant.value = res.data.homeTeam
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

    selectSeason (_season) {
      this.selectedSeason = _season
      this.getTableMember(_season)
    },

    createSeasonOptions (_season, _creationTime) {
      const seasonStart = Number.parseInt(String(_season).slice(0, 4), 10)
      const creationYear = new Date(_creationTime).getFullYear()
      const currentYear = new Date().getFullYear()

      if (Number.isNaN(seasonStart) || Number.isNaN(creationYear)) return []

      const seasonCount = Math.max(1, currentYear - creationYear + 1)

      return Array.from({ length: seasonCount }, (_value, index) => {
        const startYear = seasonStart - index
        return `${startYear}-${String(startYear + 1).slice(-2)}`
      })
    },

    getTableMember (_seasonParam) {
      this.memberObject = []

      if (typeof _seasonParam !== 'undefined') {
        _Season = _seasonParam
        this.selectedSeason = _Season
      }

      this.$axios.get(`${_URLMember}/${_TenantId}`)
        .then((res) => {
          if (res.status === 200) {
            for (let index = 0; index < res.data.length; index++) {
              let _numberOfParticipations = 0
              this.$axios.get(`${_URLParticipant}/${_TenantId}/${_Season}/name/${res.data[index].name.trim()}`)
                .then((res2) => {
                  if (res2.status === 200) {
                    _numberOfParticipations = res2.data.length
                    const _imageURL = res.data[index].ImageURL || res.data[index].imageURL || res.data[index].imageUrl || res.data[index].ImageUrl || ''
                    this.setMemberObject(res.data[index].id, res.data[index].name.trim(), res.data[index].avatar.trim(), res.data[index].isCustomized, _numberOfParticipations, _imageURL)
                  } else {
                    console.log('Unexpected status code:', res2.status)
                  }
                })
                .catch((err2) => console.log(err2))
            }
          } else {
            console.log('Unexpected status code:', res.status)
          }
        })
        .catch((err) => console.log(err))
    },

    setMemberObject (_memberId, _member, _avatar, _customized, _numberOfParticipations, _imageURL) {
      this.memberObject.push({ memberId: _memberId, member: _member, avatar: _avatar, customized: _customized, ImageURL: _imageURL, numberOfParticipations: _numberOfParticipations })

      // Sort array of objects
      this.memberObject.sort(function (a, b) {
        const _numberOfParticipationsA = a.numberOfParticipations
        const _numberOfParticipationsB = b.numberOfParticipations

        return _numberOfParticipationsB - _numberOfParticipationsA
      })
    },

    onMemberClick (_memberId, _member, _avatar, _isCustomized, _numberOfParticipations) {
      _constMemberId.value = _memberId
      _constMember.value = _member
      _constMemberOld.value = _member
      _constAvatar.value = _avatar
      _constIsCustomized.value = _isCustomized
      _constNumberOfParticipations.value = _numberOfParticipations

      this.inactiveMatchObject = []
      this.$axios.get(`${_URLParticipant}/${_TenantId}/${_Season}/name/${_member.trim()}`)
        .then((res) => {
          if (res.status === 200) {
            for (let index = 0; index < res.data.length; index++) {
              this.setInactiveMatchObject(res.data[index].homeTeam, res.data[index].awayTeam, res.data[index].name, res.data[index].date)
            }
          } else {
            console.log('Unexpected status code:', res.status)
          }
        })
        .catch((err) => console.log(err))

      this.editMember = true
    },

    setInactiveMatchObject (_homeTeam, _awayTeam, _matchName, _date) {
      this.inactiveMatchObject.push({ homeTeam: _homeTeam, awayTeam: _awayTeam, matchName: _matchName, date: _date })

      // Sort array of objects
      this.inactiveMatchObject.sort((a, b) => {
        // Convert date strings to ISO format for accurate comparison
        const dateA = a.date.slice(6, 10) + '-' + a.date.slice(3, 5) + '-' + a.date.slice(0, 2) + 'T' + a.date.slice(13)
        const dateB = b.date.slice(6, 10) + '-' + b.date.slice(3, 5) + '-' + b.date.slice(0, 2) + 'T' + b.date.slice(13)

        return new Date(dateA) - new Date(dateB)
      })
    },

    addMemberSave (_member, _avatar) {
      if (!_avatar) return

      const _members = this.memberObject.map(el => el.member)
      const _memberExists = _members.includes(_member)

      if (_memberExists) {
        this.onMemberAlreadyExists()
      } else {
        const _constNewGuid = uuidv4()
        const _constCreationTime = new Date()

        const newMember = {
          id: _constNewGuid,
          creationTime: _constCreationTime,
          lastModificationTime: null,
          tenantId: _TenantId,
          name: _member.trim(),
          avatar: _avatar.trim(),
          isCustomized: false
        }
        this.$axios.post(`${_URLMember}/${_TenantId}`, newMember)
          .then((res) => {
            if (res.status === 201) {
              this.onMemberCreated()
              this.getTableMember()
            } else {
              console.log('Unexpected status code:', res.status)
            }
          })
          .catch((err) => console.log(err))
      }
    },

    editMemberSave (_memberId, _member, _memberOld, _avatar) {
      if (typeof _avatar === 'undefined') _avatar = _constAvatar.value
      if (!_avatar) return

      const _members = this.memberObject.map(el => el.member)
      const _memberExists = _members.includes(_member) && _member !== _memberOld

      if (_memberExists) {
        this.onMemberAlreadyExists()
      } else {
        const updMember = {
          id: _memberId,
          creationTime: null,
          lastModificationTime: null,
          tenantId: _TenantId,
          name: _member.trim(),
          avatar: _avatar.trim(),
          isCustomized: false
        }
        this.$axios.put(`${_URLMember}/${_TenantId}/${_memberId}`, updMember)
          .then((res) => {
            if (res.status === 200) {
              this.onMemberUpdated()
              this.getTableMember()
            } else {
              console.log('Unexpected status code:', res.status)
            }
          })
          .catch((err) => console.log(err))
      }
    },

    deleteMember (_memberId) {
      this.$axios.delete(`${_URLMember}/${_TenantId}/${_memberId}`)
        .then((res) => {
          if (res.status === 200) {
            this.onMemberDeleted()
            this.getTableMember()
            this.editMember = false
          } else {
            console.log('Unexpected status code:', res.status)
          }
        })
        .catch((err) => console.log(err))
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
