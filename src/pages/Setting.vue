<template>
  <q-page>

    <!-- Setting area (Titel) -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title class="text-overline">Einstellungen</q-toolbar-title>
      </q-toolbar>
    </div>

    <!-- List of Settings -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="(prop, i) in settingObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onSettingClick(prop.adminCode, prop.clientName, prop.email, prop.homeTeam, prop.homeTeamAlias, prop.standardText, prop.titleUrl1, prop.captionUrl1, prop.linkUrl1, prop.titleUrl2, prop.captionUrl2, prop.linkUrl2, prop.titleUrl3, prop.captionUrl3, prop.linkUrl3, prop.titleUrl4, prop.captionUrl4, prop.linkUrl4, prop.titleUrl5, prop.captionUrl5, prop.linkUrl5)">
          <q-item-section>
            <q-item-label caption>Name: {{ prop.clientName }}</q-item-label>
            <q-item-label caption></q-item-label>
            <q-item-label caption>Admincode: {{ prop.adminCode }}</q-item-label>
            <q-item-label caption></q-item-label>
            <q-item-label caption>Usercode: {{ getUserCode(prop.adminCode) }}</q-item-label>
            <q-item-label caption></q-item-label>
            <q-item-label caption>Email: {{ prop.email }}</q-item-label>
            <q-item-label caption></q-item-label>
            <q-item-label caption>Heimmannschaft: {{ prop.homeTeam }}</q-item-label>
            <q-item-label caption></q-item-label>
            <q-item-label caption>Heimmannschaft (Alias): {{ prop.homeTeamAlias }}</q-item-label>
            <q-item-label caption></q-item-label>
            <q-item-label caption>Standardtext: {{ prop.standardText }}</q-item-label>
            <q-item-label caption></q-item-label>
            <q-item-label caption></q-item-label>
            <q-item-label caption></q-item-label>
            <q-item-label overline>Wichtige Links</q-item-label>
            <q-item-label caption></q-item-label>
            <q-item-label overline>Link1</q-item-label>
            <q-item-label caption>Titel: {{ prop.titleUrl1 }}</q-item-label>
            <q-item-label caption>Untertitel: {{ prop.captionUrl1 }}</q-item-label>
            <q-item-label caption>URL: {{ prop.linkUrl1 }}</q-item-label>
            <q-item-label caption></q-item-label>
            <q-item-label overline>Link2</q-item-label>
            <q-item-label caption>Titel: {{ prop.titleUrl2 }}</q-item-label>
            <q-item-label caption>Untertitel: {{ prop.captionUrl2 }}</q-item-label>
            <q-item-label caption>URL: {{ prop.linkUrl2 }}</q-item-label>
            <q-item-label caption></q-item-label>
            <q-item-label overline>Link3</q-item-label>
            <q-item-label caption>Titel: {{ prop.titleUrl3 }}</q-item-label>
            <q-item-label caption>Untertitel: {{ prop.captionUrl3 }}</q-item-label>
            <q-item-label caption>URL: {{ prop.linkUrl3 }}</q-item-label>
            <q-item-label caption></q-item-label>
            <q-item-label overline>Link4</q-item-label>
            <q-item-label caption>Titel: {{ prop.titleUrl4 }}</q-item-label>
            <q-item-label caption>Untertitel: {{ prop.captionUrl4 }}</q-item-label>
            <q-item-label caption>URL: {{ prop.linkUrl4 }}</q-item-label>
            <q-item-label caption></q-item-label>
            <q-item-label overline>Link5</q-item-label>
            <q-item-label caption>Titel: {{ prop.titleUrl5 }}</q-item-label>
            <q-item-label caption>Untertitel: {{ prop.captionUrl5 }}</q-item-label>
            <q-item-label caption>URL: {{ prop.linkUrl5 }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Dialogs -->
    <div class="q-pa-md q-gutter-sm">

      <!-- Start Dialogs Setting -->
      <!-- Edit Setting -->
      <q-dialog v-model="editSetting" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Einstellungen ändern</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input filled dense v-model="txtClientName" autofocus label="Name" :readonly="true" v-if="getCookie('clientName') === 'BGB'"/>
            <q-input filled dense v-model="txtClientName" autofocus label="Name" v-if="getCookie('clientName') !== 'BGB'"/>
            <q-input filled dense v-model="txtAdminCode" label="AdminCode" :readonly="true"/>
            <q-input filled dense v-model="txtUserCode" label="UserCode" :readonly="true"/>
            <q-input filled dense v-model="txtEmail" label="E-Mail" />
            <q-input filled dense v-model="txtHomeTeam" label="Heimmannschaft" />
            <q-input filled dense v-model="txtHomeTeamAlias" label="Heimmannschaft (Alias)" />
            <div class="q-pt-md" style="max-width: 350px">
              <q-input filled dense v-model="txtStandardText" type="textarea" label="Standardtext"/>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle1">Wichtige Links</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle2">Link 1</div>
            <q-input filled dense v-model="txtTitleUrl1" label="Titel" />
            <q-input filled dense v-model="txtCaptionUrl1" label="Untertitel" />
            <q-input filled dense v-model="txtLinkUrl1" label="URL" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle2">Link 2</div>
            <q-input filled dense v-model="txtTitleUrl2" label="Titel" />
            <q-input filled dense v-model="txtCaptionUrl2" label="Untertitel" />
            <q-input filled dense v-model="txtLinkUrl2" label="URL" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle2">Link 3</div>
            <q-input filled dense v-model="txtTitleUrl3" label="Titel" />
            <q-input filled dense v-model="txtCaptionUrl3" label="Untertitel" />
            <q-input filled dense v-model="txtLinkUrl3" label="URL" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle2">Link 4</div>
            <q-input filled dense v-model="txtTitleUrl4" label="Titel" />
            <q-input filled dense v-model="txtCaptionUrl4" label="Untertitel" />
            <q-input filled dense v-model="txtLinkUrl4" label="URL" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle2">Link 5</div>
            <q-input filled dense v-model="txtTitleUrl5" label="Titel" />
            <q-input filled dense v-model="txtCaptionUrl5" label="Untertitel" />
            <q-input filled dense v-model="txtLinkUrl5" label="URL" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editSettingSave(txtAdminCode, txtClientName, txtEmail, txtHomeTeam, txtHomeTeamAlias, txtStandardText, txtTitleUrl1, txtCaptionUrl1, txtLinkUrl1, txtTitleUrl2, txtCaptionUrl2, txtLinkUrl2, txtTitleUrl3, txtCaptionUrl3, txtLinkUrl3, txtTitleUrl4, txtCaptionUrl4, txtLinkUrl4, txtTitleUrl5, txtCaptionUrl5, txtLinkUrl5)" :disable="txtClientName === '' && txtHomeTeam === ''" v-close-popup />
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

      editSetting: ref(false)
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
              _constHomeTeam.value = res.data.homeTeam
              _constHomeTeamAlias.value = res.data.homeTeamAlias
              _constStandardText.value = res.data.standardText
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
              this.setSettingObject(res.data[index].name, res.data[index].value)
            }
          } else {
            console.log('Unexpected status code:', res.status)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setSettingObject (_name, _value) {
      this.settingObject.push({ name: _name, value: _value })
    },

    onSettingClick (_adminCode, _clientName, _email, _homeTeam, _homeTeamAlias, _standardText) {
      _constAdminCode.value = _adminCode
      _constUserCode.value = getUserCode(_adminCode)
      _constClientName.value = _clientName
      _constEmail.value = _email
      _constHomeTeam.value = _homeTeam
      _constHomeTeamAlias.value = _homeTeamAlias
      _constStandardText.value = _standardText

      const _date = new Date()

      setCookie(true, _adminCode, _clientName, _email, _homeTeam, _homeTeamAlias, _standardText, _date)

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
          avatar: _value
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
        const _constNewGuid = uuidv4()
        const _constCreationTime = new Date()

        const updSetting = {
          id: _constNewGuid,
          creationTime: _constCreationTime,
          lastModificationTime: null,
          tenantId: _TenantId,
          name: _name,
          avatar: _value
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
.header-image {
  height: 100%;
  z-index: -1;
  opacity: 0.2;
  filter: grayscale(100%);
}
</style>
