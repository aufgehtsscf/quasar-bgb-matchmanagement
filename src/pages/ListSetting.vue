<template>
  <q-page>

    <!-- Setting area (Title) -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title class="text-overline">Einstellungen</q-toolbar-title>
      </q-toolbar>
    </div>

    <!-- List of Settings -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px">
        <q-item clickable v-ripple @click="onSettingClick()">
          <q-item-section>
            <q-item-label overline>Fanclub: {{ txtClientName }}</q-item-label>
            <q-item-label overline>Admin-Zugriffscode: {{ txtAdminCode }}</q-item-label>
            <q-item-label overline>User-Zugriffscode: {{ txtUserCode }}</q-item-label>
            <q-item-label overline>Heimmannschaft: {{ txtHomeTeam }}</q-item-label>
            <q-item-label overline>E-Mail-Adresse: {{ txtEmail }}</q-item-label>
            <q-item-label overline>Heimmannschaft-Alias: {{ txtHomeTeamAlias }}</q-item-label>
            <q-item-label overline>Standardtext: {{ txtStandardText }}</q-item-label>
            <q-item-label overline>Saison: {{ txtSeason }}</q-item-label>
            <q-item-label overline v-if="true">Saison (Admin): {{ txtSeasonForAdmin }}</q-item-label>
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
            <div class="text-h6">Settings ändern</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input filled dense v-model="txtClientName" label="Fanclub" :disable="true" />
            <q-input filled dense v-model="txtAdminCode" label="Admin-Zugriffscode" :disable="true" />
            <q-input filled dense v-model="txtUserCode" label="User-Zugriffscode" :disable="true" />
            <q-input filled dense v-model="txtHomeTeam" label="Heimmannschaft" :disable="true" />
            <q-input filled dense v-model="txtEmail" label="E-Mail-Adresse" />
            <q-input filled dense v-model="txtHomeTeamAlias" label="Heimmannschaft-Alias" />
            <q-input filled dense v-model="txtStandardText" type="textarea" label="Standardtext" />
            <q-input filled dense v-model="txtSeason" label="Saison" />
            <q-input filled dense v-model="txtSeasonForAdmin" label="Saison (Admin)" v-if="true" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editSettingSave(txtClientName, txtEmail, txtHomeTeamAlias, txtStandardText, txtSeason, txtSeasonForAdmin)"  v-close-popup />
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
import { getCookie, getAdminCode, URLMatchManagementAPI } from 'src/boot/utils.js'
import { ref } from 'vue'

const _constClientName = ref('')
const _constAdminCode = ref('')
const _constUserCode = ref('')
const _constEmail = ref('')
const _constHomeTeam = ref('')
const _constHomeTeamAlias = ref('')
const _constStandardText = ref('')
const _constSeason = ref('')
const _constSeasonForAdmin = ref('')

let _TenantId
let _URLTenant

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
      txtSeason: ref(_constSeason),
      txtSeasonForAdmin: ref(_constSeasonForAdmin),

      onSettingUpdated () {
        $q.notify({
          type: 'positive',
          message: 'Einstellungen wurden erfolgreich aktualisiert!'
        })
      },

      editSetting: ref(false)
    }
  },

  data () {
    return {
      getCookie,
      getAdminCode,
      URLMatchManagementAPI
    }
  },

  computed: {
  },

  mounted () {
    this.setVariables().then(() => {
      this.getTenant()
    })
  },

  methods: {
    setVariables () {
      _constAdminCode.value = getAdminCode(getCookie('applicationCode'))
      _URLTenant = URLMatchManagementAPI + '/Tenant'

      return Promise.resolve()
    },

    getTenant () {
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
            _constSeason.value = res.data.season
            _constSeasonForAdmin.value = res.data.seasonForAdmin
          } else {
            console.log('Unexpected status code:', res.status)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    onSettingClick () {
      this.editSetting = true
    },

    editSettingSave (_clientName, _email, _homeTeamAlias, _standardText, _season, _seasonForAdmin) {
      const updTenant = {
        id: _TenantId,
        creationTime: null,
        lastModificationTime: null,
        name: _clientName,
        userCode: null,
        homeTeam: null,
        email: _email,
        homeTeamAlias: _homeTeamAlias,
        standardText: _standardText,
        season: _season,
        seasonForAdmin: _seasonForAdmin
      }
      this.$axios.put(`${_URLTenant}/${_TenantId}`, updTenant)
        .then((res) => {
          if (res.status === 200) {
            this.onSettingUpdated()
            this.getTenant()
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
