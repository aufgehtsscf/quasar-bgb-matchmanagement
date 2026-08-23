copilot<template>
  <q-page>

    <!-- Team area (Titel) -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title class="text-overline">Teams ({{ teamObject.length }})</q-toolbar-title>
        <q-btn class="bg-white text-primary" icon="add" label="Neu" @click="addTeam = true" />
      </q-toolbar>
    </div>

    <!-- List of Teams -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="(team, i) in teamObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onTeamClick(team.teamId, team.team, team.imageURL)">
          <q-item-section avatar>
            <q-avatar size="50px" v-if="team.imageURL !== ''">
              <img :src="team.imageURL">
            </q-avatar>
            <q-avatar size="50px" color="blue-10" text-color="white" v-if="team.imageURL === ''">
              {{ team.team.substring(0, 1) }}
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label overline>{{ team.team }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Dialogs -->
    <div class="q-pa-md q-gutter-sm">

      <!-- Start Dialogs Team -->
      <!-- Add Team -->
      <q-dialog v-model="addTeam" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Team erfassen</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="q-pt-md" style="max-width: 350px">
              <q-input filled dense v-model="txtTeamNew" autofocus label="Team *" />
            </div>

            <div class="q-pt-md" style="max-width: 350px">
              <q-file
                filled
                dense
                v-model="fileImageNew"
                accept="image/*"
                label="Team Logo *"
                :rules="[val => !!val || 'Team Logo ist erforderlich']"
                @rejected="onFileRejected"
              />
            </div>

            <div v-if="previewImageNew" class="q-pt-md">
              <q-img :src="previewImageNew" style="max-width: 150px" />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addTeamSave(txtTeamNew, fileImageNew)" :disable="txtTeamNew.trim() === '' || !fileImageNew" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit Team -->
      <q-dialog v-model="editTeam" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Team bearbeiten</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="q-pt-md" style="max-width: 350px">
              <q-input filled dense v-model="txtTeam" label="Team *" />
            </div>

            <div class="q-pt-md" style="max-width: 350px">
              <q-file
                filled
                dense
                v-model="fileImage"
                accept="image/*"
                label="Team Logo *"
                :rules="[val => !!val || 'Team Logo ist erforderlich']"
                @rejected="onFileRejected"
              />
            </div>

            <div v-if="previewImage" class="q-pt-md">
              <q-img :src="previewImage" style="max-width: 150px" />
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" color="primary" @click="delTeam = true" v-if="getCookie('isAdministrator')" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editTeamSave(txtTeamId, txtTeam, txtTeamOld, fileImage)" :disable="txtTeam.trim() === '' || !fileImage" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete Team -->
      <q-dialog v-model="delTeam" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="primary" text-color="white" />
            <span class="q-ml-sm">Datensatz löschen?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Nein" color="primary" v-close-popup />
            <q-btn flat label="Ja" color="primary" @click="deleteTeam(txtTeamId)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- End Dialogs Team -->
    </div>

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'
import { getCookie, getAdminCode, URLMatchManagementAPI } from 'src/boot/utils.js'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const _constTeamId = ref('')
const _constTeam = ref('')
const _constTeamOld = ref('')
const _constImageURL = ref('')

const _constAdminCode = ref('')

let _TenantId
let _URLTenant
let _URLTeam

export default {
  name: 'ListTeam',

  setup () {
    const $q = useQuasar()

    return {
      varAdminCode: ref(_constAdminCode),

      txtTeamId: ref(_constTeamId),
      txtTeam: ref(_constTeam),
      txtTeamOld: ref(_constTeamOld),

      txtTeamNew: ref(''),
      fileImage: ref(null),
      fileImageNew: ref(null),
      previewImage: ref(''),
      previewImageNew: ref(''),

      onTeamCreated () {
        $q.notify({
          type: 'positive',
          message: 'Team wurde erfolgreich erfasst!'
        })
      },

      onTeamUpdated () {
        $q.notify({
          type: 'positive',
          message: 'Team wurde erfolgreich aktualisiert!'
        })
      },

      onTeamDeleted () {
        $q.notify({
          message: 'Team wurde erfolgreich gelöscht!',
          color: 'orange'
        })
      },

      onTeamAlreadyExists () {
        $q.notify({
          type: 'negative',
          message: 'Dieses Team besteht bereits!'
        })
      },

      onFileRejected () {
        $q.notify({
          type: 'negative',
          message: 'Datei konnte nicht hochgeladen werden. Bitte verwende ein Bild-Format.'
        })
      },

      addTeam: ref(false),
      editTeam: ref(false),
      delTeam: ref(false)
    }
  },

  data () {
    return {
      getCookie,
      getAdminCode,
      URLMatchManagementAPI,

      teamObject: [
        {
          teamId: '',
          team: '',
          imageURL: ''
        }
      ]

    }
  },

  computed: {
  },

  watch: {
    fileImage (newVal) {
      if (newVal) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.previewImage = e.target.result
        }
        reader.readAsDataURL(newVal)
      } else {
        this.previewImage = _constImageURL.value
      }
    },

    fileImageNew (newVal) {
      if (newVal) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.previewImageNew = e.target.result
        }
        reader.readAsDataURL(newVal)
      } else {
        this.previewImageNew = ''
      }
    }
  },

  mounted () {
    this.setVariables().then(() => {
      this.getTenantId().then(() => {
        this.getTableTeam()
      })
    })
  },

  methods: {
    setVariables () {
      _constAdminCode.value = getAdminCode(getCookie('applicationCode'))
      _URLTenant = URLMatchManagementAPI + '/Tenant'
      _URLTeam = URLMatchManagementAPI + '/Team'

      this.teamObject = []

      return Promise.resolve()
    },

    getTenantId () {
      return new Promise((resolve, reject) => {
        this.$axios.get(`${_URLTenant}/code/${_constAdminCode.value}`)
          .then((res) => {
            if (res.status === 200) {
              _TenantId = res.data.id
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

    getTableTeam () {
      this.teamObject = []

      this.$axios.get(`${_URLTeam}/${_TenantId}`)
        .then((res) => {
          if (res.status === 200) {
            for (let index = 0; index < res.data.length; index++) {
              this.setTeamObject(res.data[index].id, res.data[index].name.trim(), res.data[index].imageURL || '')
            }
          } else {
            console.log('Unexpected status code:', res.status)
          }
        })
        .catch((err) => console.log(err))
    },

    setTeamObject (_teamId, _team, _imageURL) {
      this.teamObject.push({ teamId: _teamId, team: _team, imageURL: URLMatchManagementAPI + _imageURL })

      // Sort array of objects by team name
      this.teamObject.sort((a, b) => {
        return a.team.localeCompare(b.team)
      })
    },

    onTeamClick (_teamId, _team, _imageURL) {
      _constTeamId.value = _teamId
      _constTeam.value = _team
      _constTeamOld.value = _team
      _constImageURL.value = _imageURL
      this.previewImage = _imageURL
      this.fileImage = null

      this.editTeam = true
    },

    addTeamSave (_team, _file) {
      if (!_file) return

      const _teams = this.teamObject.map(el => el.team)
      const _teamExists = _teams.includes(_team)

      if (_teamExists) {
        this.onTeamAlreadyExists()
        return
      }

      this.uploadImage(_file, (imageBase64) => {
        const newTeam = {
          id: uuidv4(),
          creationTime: new Date(),
          lastModificationTime: null,
          tenantId: _TenantId,
          name: _team.trim(),
          file: imageBase64
        }
        this.$axios.post(`${_URLTeam}/${_TenantId}`, newTeam)
          .then((res) => {
            if (res.status === 201) {
              this.onTeamCreated()
              this.getTableTeam()
              this.txtTeamNew = ''
              this.fileImageNew = null
              this.previewImageNew = ''
            } else {
              console.log('Unexpected status code:', res.status)
            }
          })
          .catch((err) => console.log(err))
      })
    },

    editTeamSave (_teamId, _team, _teamOld, _file) {
      if (!_file) return

      const _teams = this.teamObject.map(el => el.team)
      const _teamExists = _teams.includes(_team) && _team !== _teamOld

      if (_teamExists) {
        this.onTeamAlreadyExists()
        return
      }

      this.uploadImage(_file, (imageBase64) => {
        const updTeam = {
          id: _teamId,
          creationTime: null,
          lastModificationTime: new Date(),
          tenantId: _TenantId,
          name: _team.trim(),
          file: imageBase64
        }
        this.$axios.put(`${_URLTeam}/${_TenantId}/${_teamId}`, updTeam)
          .then((res) => {
            if (res.status === 200) {
              this.onTeamUpdated()
              this.getTableTeam()
            } else {
              console.log('Unexpected status code:', res.status)
            }
          })
          .catch((err) => console.log(err))
      })
    },

    deleteTeam (_teamId) {
      this.$axios.delete(`${_URLTeam}/${_TenantId}/${_teamId}`)
        .then((res) => {
          if (res.status === 200) {
            this.onTeamDeleted()
            this.getTableTeam()
            this.editTeam = false
          } else {
            console.log('Unexpected status code:', res.status)
          }
        })
        .catch((err) => console.log(err))
    },

    uploadImage (file, callback) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64String = e.target.result.split(',')[1]
        const imageBase64 = `data:${file.type};base64,${base64String}`
        callback(imageBase64)
      }
      reader.readAsDataURL(file)
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
