<template>
  <q-page>

    <!-- Properties area (Titel) -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>Einstellungen</q-toolbar-title>
      </q-toolbar>
    </div>

    <!-- List of Properties -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="(prop, i) in propertiesObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onPropertiesClick(prop.row, prop.adminCode, prop.clientName, prop.email, prop.homeTeam, prop.homeTeamAlias, prop.standardText, prop.titleUrl1, prop.captionUrl1, prop.linkUrl1, prop.titleUrl2, prop.captionUrl2, prop.linkUrl2, prop.titleUrl3, prop.captionUrl3, prop.linkUrl3, prop.titleUrl4, prop.captionUrl4, prop.linkUrl4, prop.titleUrl5, prop.captionUrl5, prop.linkUrl5)">
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

      <!-- Start Dialogs Properties -->
      <!-- Edit properties -->
      <q-dialog v-model="editProperties" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Einstellungen ändern</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="txtClientName" autofocus label="Name" :readonly="true" v-if="getCookie('clientName') === 'BGB'"/>
            <q-input dense v-model="txtClientName" autofocus label="Name" v-if="getCookie('clientName') !== 'BGB'"/>
            <q-input dense v-model="txtAdminCode" label="AdminCode" :readonly="true"/>
            <q-input dense v-model="txtUserCode" label="UserCode" :readonly="true"/>
            <q-input dense v-model="txtEmail" label="E-Mail" />
            <q-input dense v-model="txtHomeTeam" label="Heimmannschaft" />
            <q-input dense v-model="txtHomeTeamAlias" label="Heimmannschaft (Alias)" />
            <div class="q-pt-md" style="max-width: 350px">
              <q-input v-model="txtStandardText" filled type="textarea" label="Standardtext"/>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle1">Wichtige Links</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle2">Link 1</div>
            <q-input dense v-model="txtTitleUrl1" label="Titel" />
            <q-input dense v-model="txtCaptionUrl1" label="Untertitel" />
            <q-input dense v-model="txtLinkUrl1" label="URL" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle2">Link 2</div>
            <q-input dense v-model="txtTitleUrl2" label="Titel" />
            <q-input dense v-model="txtCaptionUrl2" label="Untertitel" />
            <q-input dense v-model="txtLinkUrl2" label="URL" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle2">Link 3</div>
            <q-input dense v-model="txtTitleUrl3" label="Titel" />
            <q-input dense v-model="txtCaptionUrl3" label="Untertitel" />
            <q-input dense v-model="txtLinkUrl3" label="URL" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle2">Link 4</div>
            <q-input dense v-model="txtTitleUrl4" label="Titel" />
            <q-input dense v-model="txtCaptionUrl4" label="Untertitel" />
            <q-input dense v-model="txtLinkUrl4" label="URL" />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle2">Link 5</div>
            <q-input dense v-model="txtTitleUrl5" label="Titel" />
            <q-input dense v-model="txtCaptionUrl5" label="Untertitel" />
            <q-input dense v-model="txtLinkUrl5" label="URL" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editPropertiesSave(intPropertiesRow, txtAdminCode, txtClientName, txtEmail, txtHomeTeam, txtHomeTeamAlias, txtStandardText, txtTitleUrl1, txtCaptionUrl1, txtLinkUrl1, txtTitleUrl2, txtCaptionUrl2, txtLinkUrl2, txtTitleUrl3, txtCaptionUrl3, txtLinkUrl3, txtTitleUrl4, txtCaptionUrl4, txtLinkUrl4, txtTitleUrl5, txtCaptionUrl5, txtLinkUrl5)" :disable="txtClientName === '' && txtHomeTeam === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- End Dialogs Properties -->
    </div>

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import useQuasar from 'quasar/src/composables/use-quasar.js'
import { getCookie, setCookie, getAdminCode, getUserCode, URLProperties } from 'src/boot/utils.js'
import { ref } from 'vue'

const _constPropertiesRow = ref(0)
const _constAdminCode = ref('')
const _constUserCode = ref('')
const _constClientName = ref('')
const _constEmail = ref('')
const _constHomeTeam = ref('')
const _constHomeTeamAlias = ref('')
const _constStandardText = ref('')
const _constTitleUrl1 = ref('')
const _constCaptionUrl1 = ref('')
const _constLinkUrl1 = ref('')
const _constTitleUrl2 = ref('')
const _constCaptionUrl2 = ref('')
const _constLinkUrl2 = ref('')
const _constTitleUrl3 = ref('')
const _constCaptionUrl3 = ref('')
const _constLinkUrl3 = ref('')
const _constTitleUrl4 = ref('')
const _constCaptionUrl4 = ref('')
const _constLinkUrl4 = ref('')
const _constTitleUrl5 = ref('')
const _constCaptionUrl5 = ref('')
const _constLinkUrl5 = ref('')

export default {
  name: 'ListProperties',

  setup () {
    const $q = useQuasar()

    return {
      intPropertiesRow: ref(_constPropertiesRow),
      txtAdminCode: ref(_constAdminCode),
      txtUserCode: ref(_constUserCode),
      txtClientName: ref(_constClientName),
      txtEmail: ref(_constEmail),
      txtHomeTeam: ref(_constHomeTeam),
      txtHomeTeamAlias: ref(_constHomeTeamAlias),
      txtStandardText: ref(_constStandardText),
      txtTitleUrl1: ref(_constTitleUrl1),
      txtCaptionUrl1: ref(_constCaptionUrl1),
      txtLinkUrl1: ref(_constLinkUrl1),
      txtTitleUrl2: ref(_constTitleUrl2),
      txtCaptionUrl2: ref(_constCaptionUrl2),
      txtLinkUrl2: ref(_constLinkUrl2),
      txtTitleUrl3: ref(_constTitleUrl3),
      txtCaptionUrl3: ref(_constCaptionUrl3),
      txtLinkUrl3: ref(_constLinkUrl3),
      txtTitleUrl4: ref(_constTitleUrl4),
      txtCaptionUrl4: ref(_constCaptionUrl4),
      txtLinkUrl4: ref(_constLinkUrl4),
      txtTitleUrl5: ref(_constTitleUrl5),
      txtCaptionUrl5: ref(_constCaptionUrl5),
      txtLinkUrl5: ref(_constLinkUrl5),

      onPropertiesUpdated () {
        $q.notify({
          type: 'positive',
          message: 'Einstellungen wurden erfolgreich aktualisiert!'
        })
      },

      editProperties: ref(false)
    }
  },

  data () {
    return {
      getCookie,
      setCookie,
      getAdminCode,
      getUserCode,
      URLProperties,

      propertiesObject: [
        {
          row: '',
          adminCode: '',
          clientName: '',
          email: '',
          homeTeam: '',
          homeTeamAlias: '',
          standardText: '',
          titleUrl1: '',
          captionUrl1: '',
          linkUrl1: '',
          titleUrl2: '',
          captionUrl2: '',
          linkUrl2: '',
          titleUrl3: '',
          captionUrl3: '',
          linkUrl3: '',
          titleUrl4: '',
          captionUrl4: '',
          linkUrl4: '',
          titleUrl5: '',
          captionUrl5: '',
          linkUrl5: ''
        }
      ]
    }
  },

  computed: {
  },

  mounted () {
    this.getTableProperties()
  },

  methods: {
    async getTableProperties () {
      this.propertiesObject = []

      // console.log('URLProperties: ' + this.URLProperties + '&func=ReadAdminCode&adminCode=' + getAdminCode(getCookie('applicationCode'))
      this.$axios(`${this.URLProperties}&func=ReadAdminCode&adminCode=${getAdminCode(getCookie('applicationCode'))}`)
        .then((res) => {
          this.tableProperties = res.data.split('\n')
          for (let index = 0; index < this.tableProperties.length - 1; index++) {
            const element = this.tableProperties[index].split(',')

            this.setPropertiesObject(element[0], element[1].trim(), element[3].trim(), element[4].trim(), element[5].trim(), element[6].trim(), element[7].trim(), element[8].trim(), element[9].trim(), element[10].trim(), element[11].trim(), element[12].trim(), element[13].trim(), element[14].trim(), element[15].trim(), element[16].trim(), element[17].trim(), element[18].trim(), element[19].trim(), element[20].trim(), element[21].trim(), element[22].trim())
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setPropertiesObject (_row, _adminCode, _clientName, _email, _homeTeam, _homeTeamAlias, _standardText, _titleUrl1, _captionUrl1, _linkUrl1, _titleUrl2, _captionUrl2, _linkUrl2, _titleUrl3, _captionUrl3, _linkUrl3, _titleUrl4, _captionUrl4, _linkUrl4, _titleUrl5, _captionUrl5, _linkUrl5) {
      this.propertiesObject.push({ row: parseInt(_row), adminCode: _adminCode, clientName: _clientName, email: _email, homeTeam: _homeTeam, homeTeamAlias: _homeTeamAlias, standardText: _standardText, titleUrl1: _titleUrl1, captionUrl1: _captionUrl1, linkUrl1: _linkUrl1, titleUrl2: _titleUrl2, captionUrl2: _captionUrl2, linkUrl2: _linkUrl2, titleUrl3: _titleUrl3, captionUrl3: _captionUrl3, linkUrl3: _linkUrl3, titleUrl4: _titleUrl4, captionUrl4: _captionUrl4, linkUrl4: _linkUrl4, titleUrl5: _titleUrl5, captionUrl5: _captionUrl5, linkUrl5: _linkUrl5 })
    },

    onPropertiesClick (_row, _adminCode, _clientName, _email, _homeTeam, _homeTeamAlias, _standardText, _titleUrl1, _captionUrl1, _linkUrl1, _titleUrl2, _captionUrl2, _linkUrl2, _titleUrl3, _captionUrl3, _linkUrl3, _titleUrl4, _captionUrl4, _linkUrl4, _titleUrl5, _captionUrl5, _linkUrl5) {
      // console.log('Clicked on Properties: ' + _row + ', ' + _adminCode + ', ' + _clientName + ', ' + _email + ', ' + _homeTeam + ', ' + _homeTeamAlias + ', ' + _standardText + ', ' + _titleUrl1 + ', ' + _captionUrl1 + ', ' + _linkUrl1 + ', ' + _titleUrl2 + ', ' + _captionUrl2 + ', ' + _linkUrl2 + ', ' + _titleUrl3 + ', ' + _captionUrl3 + ', ' + _linkUrl3 + ', ' + _titleUrl4 + ', ' + _captionUrl4 + ', ' + _linkUrl4 + ', ' + _titleUrl5 + ', ' + _captionUrl5 + ', ' + _linkUrl5)
      _constPropertiesRow.value = _row
      _constAdminCode.value = _adminCode
      _constUserCode.value = getUserCode(_adminCode)
      _constClientName.value = _clientName
      _constEmail.value = _email
      _constHomeTeam.value = _homeTeam
      _constHomeTeamAlias.value = _homeTeamAlias
      _constStandardText.value = _standardText
      _constTitleUrl1.value = _titleUrl1
      _constCaptionUrl1.value = _captionUrl1
      _constLinkUrl1.value = _linkUrl1
      _constTitleUrl2.value = _titleUrl2
      _constCaptionUrl2.value = _captionUrl2
      _constLinkUrl2.value = _linkUrl2
      _constTitleUrl3.value = _titleUrl3
      _constCaptionUrl3.value = _captionUrl3
      _constLinkUrl3.value = _linkUrl3
      _constTitleUrl4.value = _titleUrl4
      _constCaptionUrl4.value = _captionUrl4
      _constLinkUrl4.value = _linkUrl4
      _constTitleUrl5.value = _titleUrl5
      _constCaptionUrl5.value = _captionUrl5
      _constLinkUrl5.value = _linkUrl5

      this.editProperties = true
    },

    editPropertiesSave (_row, _adminCode, _clientName, _email, _homeTeam, _homeTeamAlias, _standardText, _titleUrl1, _captionUrl1, _linkUrl1, _titleUrl2, _captionUrl2, _linkUrl2, _titleUrl3, _captionUrl3, _linkUrl3, _titleUrl4, _captionUrl4, _linkUrl4, _titleUrl5, _captionUrl5, _linkUrl5) {
      // console.log('editPropertiesSave: ' + _row + ', ' + _adminCode + ', ' + _clientName + ', ' + _email + ', ' + _homeTeam + ', ' + _homeTeamAlias + ', ' + _standardText + ', ' + _titleUrl1 + ', ' + _captionUrl1 + ', ' + _linkUrl1 + ', ' + _titleUrl2 + ', ' + _captionUrl2 + ', ' + _linkUrl2 + ', ' + _titleUrl3 + ', ' + _captionUrl3 + ', ' + _linkUrl3 + ', ' + _titleUrl4 + ', ' + _captionUrl4 + ', ' + _linkUrl4 + ', ' + _titleUrl5 + ', ' + _captionUrl5 + ', ' + _linkUrl5)
      const _date = new Date()
      this.$axios(`${this.URLProperties}&func=UpdateAdminCode&row=${_row}&adminCode=${_adminCode}&clientName=${encodeURI(_clientName.replace(',', ' '))}&email=${encodeURI(_email.replace(',', ' '))}&homeTeam=${encodeURI(_homeTeam.replace(',', ''))}&homeTeamAlias=${encodeURI(_homeTeamAlias.replace(',', ''))}&standardText=${encodeURI(_standardText.replace(',', ''))}&titleUrl1=${encodeURI(_titleUrl1.replace(',', ''))}&captionUrl1=${encodeURI(_captionUrl1.replace(',', ''))}&linkUrl1=${encodeURI(_linkUrl1.replace(',', ''))}&titleUrl2=${encodeURI(_titleUrl2.replace(',', ''))}&captionUrl2=${encodeURI(_captionUrl2.replace(',', ''))}&linkUrl2=${encodeURI(_linkUrl2.replace(',', ''))}&titleUrl3=${encodeURI(_titleUrl3.replace(',', ''))}&captionUrl3=${encodeURI(_captionUrl3.replace(',', ''))}&linkUrl3=${encodeURI(_linkUrl3.replace(',', ''))}&titleUrl4=${encodeURI(_titleUrl4.replace(',', ''))}&captionUrl4=${encodeURI(_captionUrl4.replace(',', ''))}&linkUrl4=${encodeURI(_linkUrl4.replace(',', ''))}&titleUrl5=${encodeURI(_titleUrl5.replace(',', ''))}&captionUrl5=${encodeURI(_captionUrl5.replace(',', ''))}&linkUrl5=${encodeURI(_linkUrl5.replace(',', ''))}&updatedOn=${_date}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.onPropertiesUpdated()
            setCookie(true, _adminCode, _clientName, _email, _homeTeam, _homeTeamAlias, _standardText, _titleUrl1, _captionUrl1, _linkUrl1, _titleUrl2, _captionUrl2, _linkUrl2, _titleUrl3, _captionUrl3, _linkUrl3, _titleUrl4, _captionUrl4, _linkUrl4, _titleUrl5, _captionUrl5, _linkUrl5, _date)
            this.getTableProperties()
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
.header-image {
  height: 100%;
  z-index: -1;
  opacity: 0.2;
  filter: grayscale(100%);
}
</style>
