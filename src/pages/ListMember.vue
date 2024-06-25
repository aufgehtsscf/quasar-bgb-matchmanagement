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
      <q-btn-group push>
        <q-btn color="primary" glossy text-color="white" push label="2024-25" @click="getTableMember('2024-25')"/>
        <q-btn color="deep-orange-10" glossy text-color="white" push label="2023-24" @click="getTableMember('2023-24')"/>
        <q-btn color="deep-orange-9" glossy text-color="white" push label="2022-23" @click="getTableMember('2022-23')"/>
      </q-btn-group>
    </div>

    <!-- List of Members -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="(member, i) in memberObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onMemberClick(member.memberId, member.member, member.avatar, member.customized)">
          <q-item-section avatar>
            <q-avatar size="50px" color="pink-10" text-color="white" v-if="member.avatar === ''">
              {{ member.member.substring(0, 1) }}
              <q-badge floating color="teal">{{ member.numberOfParticipations }}</q-badge>
            </q-avatar>
            <q-avatar size="50px" v-if="member.avatar !== ''">
              <img :src="getAvatar(varAdminCode, member.avatar, member.customized)">
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
            <q-input filled dense v-model="txtMemberNew" autofocus label="Mitglied *" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-select
              filled dense
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
            <q-input filled dense v-model="txtMember" label="Mitglied *" />

            <q-select
              filled dense
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
              <img :src="getTeamImage(el.awayTeam)" v-if="n <= 9 && el.awayTeam !== '' && el.awayTeam !== homeTeamFromTenant">
              <img :src="getTeamImage(el.homeTeam)" v-if="n <= 9 && el.homeTeam !== '' && el.homeTeam !== homeTeamFromTenant">
              <img :src="getEventImage(el.matchName)" v-if="n <= 9 && el.homeTeam === '' && el.awayTeam === ''">
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
              <img :src="getTeamImage(el.awayTeam)" v-if="n > 9 && n <= 19 && el.awayTeam !== '' && el.awayTeam !== homeTeamFromTenant">
              <img :src="getTeamImage(el.awayTeam)" v-if="n > 9 && n <= 19 && el.homeTeam !== '' && el.homeTeam !== homeTeamFromTenant">
              <img :src="getEventImage(el.matchName)" v-if="n > 9 && n <= 19 && el.homeTeam === '' && el.awayTeam === ''">
            </q-avatar>
          </div>

          <div class="q-pa-md q-gutter-sm" style="height: 80px">
            <q-avatar
              v-for="(el, n) in inactiveMatchObject"
              :key="n"
              size="40px"
              class="overlapping"
              :style="`left: ${(n - 20) * 32}px`"
            >
              <img :src="getTeamImage(el.awayTeam)" v-if="n > 19 && n <= 29 && el.awayTeam !== '' && el.awayTeam !== homeTeamFromTenant">
              <img :src="getTeamImage(el.awayTeam)" v-if="n > 19 && n <= 29 && el.homeTeam !== '' && el.homeTeam !== homeTeamFromTenant">
              <img :src="getEventImage(el.matchName)" v-if="n > 19 && n <= 29 && el.homeTeam === '' && el.awayTeam === ''">
            </q-avatar>
          </div>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" color="primary" @click="delMember = true" v-if="getCookie('isAdministrator')" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editMemberSave(txtMemberId, txtMember, txtMemberOld, txtAvatar.value)" :disable="txtMember === '' || boolIsCustomized" v-close-popup />
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
import useQuasar from 'quasar/src/composables/use-quasar.js'
import { getCookie, getAdminCode, getAvatar, getTeamImage, getEventImage, teamImages, avatarImages, URLMatchManagementAPI } from 'src/boot/utils.js'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const _constMemberId = ref('')
const _constMember = ref('')
const _constMemberOld = ref('')
const _constAvatar = ref('')
const _constIsCustomized = ref(false)

const _constAdminCode = ref('')
const _constHomeTeamFromTenant = ref('')

let _TenantId
let _Season
let _URLTenant
let _URLMember
let _URLParticipant

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
      teamImages,
      avatarImages,
      URLMatchManagementAPI,

      memberObject: [
        {
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
        this.getTableMember()
      })
    })
  },

  methods: {
    setVariables () {
      _constAdminCode.value = getAdminCode(getCookie('applicationCode'))
      _URLTenant = URLMatchManagementAPI + '/Tenant'
      _URLMember = URLMatchManagementAPI + '/Member'
      _URLParticipant = URLMatchManagementAPI + '/Participant'

      this.memberObject = []

      return Promise.resolve()
    },

    getTenantId () {
      return new Promise((resolve, reject) => {
        this.$axios.get(`${_URLTenant}/code/${_constAdminCode.value}`)
          .then((res) => {
            if (res.status === 200) {
              _TenantId = res.data.id
              _Season = res.data.season
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

    getTableMember (_seasonParam) {
      this.memberObject = []

      if (typeof _seasonParam !== 'undefined') {
        _Season = _seasonParam
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
                    this.setMemberObject(res.data[index].id, res.data[index].name, res.data[index].avatar, res.data[index].isCustomized, _numberOfParticipations)
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

    setMemberObject (_memberId, _member, _avatar, _customized, _numberOfParticipations) {
      this.memberObject.push({ memberId: _memberId, member: _member, avatar: _avatar, customized: _customized, numberOfParticipations: _numberOfParticipations })

      // Sort array of objects
      this.memberObject.sort(function (a, b) {
        const _numberOfParticipationsA = a.numberOfParticipations
        const _numberOfParticipationsB = b.numberOfParticipations

        if (_numberOfParticipationsA > _numberOfParticipationsB) return -1
        if (_numberOfParticipationsA < _numberOfParticipationsB) return 1
        return 0
      })
    },

    onMemberClick (_memberId, _member, _avatar, _isCustomized) {
      _constMemberId.value = _memberId
      _constMember.value = _member
      _constMemberOld.value = _member
      _constAvatar.value = _avatar
      _constIsCustomized.value = _isCustomized

      this.inactiveMatchObject = []
      this.$axios.get(`${_URLParticipant}/${_TenantId}/${_Season}/name/${_member.trim()}`)
        .then((res) => {
          if (res.status === 200) {
            for (let index = 0; index < res.data.length; index++) {
              this.setInactiveMatchObject(res.data[index].homeTeam, res.data[index].awayTeam, res.data[index].matchName, res.data[index].date)
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
      this.inactiveMatchObject.sort(function (a, b) {
        let dateA = a.date
        dateA = dateA.substring(6, 10) + dateA.substring(3, 5) + dateA.substring(0, 2)

        let dateB = b.date
        dateB = dateB.substring(6, 10) + dateB.substring(3, 5) + dateB.substring(0, 2)

        if (dateA > dateB) return 1
        if (dateA < dateB) return -1
        return 0
      })
    },

    addMemberSave (_member, _avatar) {
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
          name: _member,
          avatar: _avatar,
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
          name: _member,
          avatar: _avatar,
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
