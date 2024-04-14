<template>
  <q-page>

    <!-- Setting area (Titel) -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title class="text-overline">Einstellungen ({{ settingObject.length }})</q-toolbar-title>
        <q-btn class="bg-white text-primary" icon="add" label="Neu" @click="addSetting = true" v-if="getCookie('isAdministrator')" />
      </q-toolbar>
    </div>

    <!-- List of Settings -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="(setting, i) in settingObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onSettingClick(setting.settingId, setting.name, setting.value)">
          <q-item-section>
            <q-item-label overline>Name {{ setting.name }}</q-item-label>
            <q-item-label overline>Value {{ setting.value }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Dialogs -->
    <div class="q-pa-md q-gutter-sm">

      <!-- Start Dialogs Setting -->
      <!-- Add Setting -->
      <q-dialog v-model="addSetting" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Setting erfassen</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input filled dense v-model="txtSettingNameNew" autofocus label="Name *" />
            <q-input filled dense v-model="txtSettingValueNew" label="Value *" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addSettingSave(txtSettingNameNew, txtSettingValueNew)" :disable="txtSettingNameNew === '' || txtSettingValueNew === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit Setting -->
      <q-dialog v-model="editSetting" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Setting ändern</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input filled dense v-model="txtSettingName" label="Name *" />
            <q-input filled dense v-model="txtSettingValue" autofocus label="Value *" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" color="primary" @click="delSetting = true" v-if="getCookie('isAdministrator')" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editSettingSave(txtSettingId, txtSettingName, txtSettingValue)" :disable="txtSettingName === '' || txtSettingValue === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete Setting -->
      <q-dialog v-model="delSetting" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="primary" text-color="white" />
            <span class="q-ml-sm">Datensatz löschen?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Nein" color="primary" v-close-popup />
            <q-btn flat label="Ja" color="primary" @click="deleteSetting(txtSettingId)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- End Dialogs Setting -->
    </div>

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import useQuasar from 'quasar/src/composables/use-quasar.js'
import { getCookie, setCookie, getAdminCode, getUserCode, URLMatchManagementAPI } from 'src/boot/utils.js'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const _constClientName = ref('')
const _constAdminCode = ref('')
const _constUserCode = ref('')
const _constEmail = ref('')
const _constHomeTeam = ref('')
const _constHomeTeamAlias = ref('')
const _constStandardText = ref('')

const _constSettingId = ref('')
const _constSettingName = ref('')
const _constSettingValue = ref('')

let _TenantId
let _URLTenant
let _URLSetting

export default {
  name: 'ListSetting',

  setup () {
    const $q = useQuasar()

    return {
      txtClientName: ref(_constClientName),
      txtAdminCode: ref(_constAdminCode),
      txtUserCode: ref(_constUserCode),
      txtEmail: ref(_constEmail),
      txtHomeTeam: ref(_constHomeTeam),
      txtHomeTeamAlias: ref(_constHomeTeamAlias),
      txtStandardText: ref(_constStandardText),

      txtSettingId: ref(_constSettingId),
      txtSettingName: ref(_constSettingName),
      txtSettingValue: ref(_constSettingValue),

      txtSettingNameNew: ref(''),
      txtSettingValueNew: ref(''),

      onSettingCreated () {
        $q.notify({
          type: 'positive',
          message: 'Einstellung wurde erfolgreich erfasst!'
        })
      },

      onSettingUpdated () {
        $q.notify({
          type: 'positive',
          message: 'Einstellung wurden erfolgreich aktualisiert!'
        })
      },

      onSettingDeleted () {
        $q.notify({
          message: 'Einstellung wurde erfolgreich gelöscht!',
          color: 'orange'
        })
      },

      onSettingAlreadyExists () {
        $q.notify({
          type: 'negative',
          message: 'Diese Einstellung besteht bereits!'
        })
      },

      addSetting: ref(false),
      editSetting: ref(false),
      delSetting: ref(false)
    }
  },

  data () {
    return {
      getCookie,
      setCookie,
      getAdminCode,
      getUserCode,
      URLMatchManagementAPI,

      settingObject: [
        {
          settingId: '',
          name: '',
          value: ''
        }
      ]
    }
  },

  computed: {
  },

  mounted () {
    this.setVariables().then(() => {
      this.getTenantId().then(() => {
        this.getTableSetting()
      })
    })
  },

  methods: {
    setVariables () {
      _constAdminCode.value = getAdminCode(getCookie('applicationCode'))
      _URLTenant = URLMatchManagementAPI + '/Tenant'
      _URLSetting = URLMatchManagementAPI + '/Setting'

      this.settingObject = []

      return Promise.resolve()
    },

    getTenantId () {
      return new Promise((resolve, reject) => {
        this.$axios.get(`${_URLTenant}/code/${_constAdminCode.value}`)
          .then((res) => {
            if (res.status === 200) {
              _TenantId = res.data.id
              _constClientName.value = res.data.name
              _constAdminCode.value = res.data.adminCode
              _constUserCode.value = res.data.userCode
              _constEmail.value = res.data.email
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

    async getTableSetting () {
      this.settingObject = []

      this.$axios.get(`${_URLSetting}/${_TenantId}`)
        .then((res) => {
          if (res.status === 200) {
            for (let index = 0; index < res.data.length; index++) {
              this.setSettingObject(res.data[index].id, res.data[index].name, res.data[index].value)
            }
          } else {
            console.log('Unexpected status code:', res.status)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setSettingObject (_settingId, _name, _value) {
      this.settingObject.push({ settingId: _settingId, name: _name, value: _value })
    },

    onSettingClick (_settingId, _settingName, _settingValue) {
      _constSettingId.value = _settingId
      _constSettingName.value = _settingName
      _constSettingValue.value = _settingValue

      // const _date = new Date()

      // setCookie(true, _adminCode, _clientName, _email, _homeTeam, _homeTeamAlias, _standardText, _date)

      this.editSetting = true
    },

    addSettingSave (_name, _value) {
      const _settings = this.settingObject.map(el => el.name)
      const _settingExists = _settings.includes(_name)

      if (_settingExists) {
        this.onSettingAlreadyExists()
      } else {
        const _constNewGuid = uuidv4()
        const _constCreationTime = new Date()

        const newSetting = {
          id: _constNewGuid,
          creationTime: _constCreationTime,
          lastModificationTime: null,
          tenantId: _TenantId,
          name: _name,
          value: _value
        }
        this.$axios.post(`${_URLSetting}/${_TenantId}`, newSetting)
          .then((res) => {
            if (res.status === 201) {
              this.onSettingUpdated()
              this.getTableSetting()
            } else {
              console.log('Unexpected status code:', res.status)
            }
          })
          .catch((err) => console.log(err))
      }
    },

    editSettingSave (_settingId, _name, _value) {
      const _settings = this.settingObject.map(el => el.name)
      const _settingExists = _settings.includes(_name)

      if (_settingExists) {
        this.onSettingAlreadyExists()
      } else {
        const updSetting = {
          id: _settingId,
          creationTime: null,
          lastModificationTime: null,
          tenantId: _TenantId,
          name: _name,
          value: _value
        }
        this.$axios.put(`${_URLSetting}/${_TenantId}/${_settingId}`, updSetting)
          .then((res) => {
            if (res.status === 200) {
              this.onSettingUpdated()
              this.getTableSetting()
            } else {
              console.log('Unexpected status code:', res.status)
            }
          })
          .catch((err) => console.log(err))
      }
    },

    deleteSetting (_settingId) {
      this.$axios.delete(`${_URLSetting}/${_TenantId}/${_settingId}`)
        .then((res) => {
          if (res.status === 200) {
            this.onSettingDeleted()
            this.getTableSetting()
            this.editSetting = false
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
.header-image {
  height: 100%;
  z-index: -1;
  opacity: 0.2;
  filter: grayscale(100%);
}
</style>
