<template>
  <q-page>

    <!-- Link area (Title) -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title class="text-overline">Wichtige Links ({{ linkObject.length }})</q-toolbar-title>
        <q-btn class="bg-white text-primary" icon="add" label="Neu" @click="addLink = true" v-if="getCookie('isAdministrator')" />
      </q-toolbar>
    </div>

    <!-- List of Links -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="(link, i) in linkObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onLinkClick(link.linkId, link.title, link.caption, link.url)">
          <q-item-section>
            <q-item-label overline>Titel: {{ link.title }}</q-item-label>
            <q-item-label overline>Untertitel: {{ link.caption }}</q-item-label>
            <q-item-label overline>URL: {{ link.url }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Dialogs -->
    <div class="q-pa-md q-gutter-sm">

      <!-- Start Dialogs Link -->
      <!-- Add Link -->
      <q-dialog v-model="addLink" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Link erfassen</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input filled dense v-model="txtLinkTitleNew" autofocus label="Titel *" />
            <q-input filled dense v-model="txtLinkCaptionNew" label="Untertitel" />
            <q-input filled dense v-model="txtLinkUrlNew" label="URL" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addLinkSave(txtLinkTitleNew, txtLinkCaptionNew, txtLinkUrlNew)" :disable="txtLinkTitleNew === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit Link -->
      <q-dialog v-model="editLink" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Link ändern</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input filled dense v-model="txtLinkTitle" label="Title *" />
            <q-input filled dense v-model="txtLinkCaption" autofocus label="Untertitel" />
            <q-input filled dense v-model="txtLinkUrl" autofocus label="URL" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" color="primary" @click="delLink = true" v-if="getCookie('isAdministrator')" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editLinkSave(txtLinkId, txtLinkTitle, txtLinkCaption, txtLinkUrl)" :disable="txtLinkTitle === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete Link -->
      <q-dialog v-model="delLink" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="primary" text-color="white" />
            <span class="q-ml-sm">Datensatz löschen?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Nein" color="primary" v-close-popup />
            <q-btn flat label="Ja" color="primary" @click="deleteLink(txtLinkId)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- End Dialogs Link -->
    </div>

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import useQuasar from 'quasar/src/composables/use-quasar.js'
import { getCookie, setCookie, getAdminCode, getUserCode, URLMatchManagementAPI } from 'src/boot/utils.js'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const _constLinkId = ref('')
const _constLinkTitle = ref('')
const _constLinkCaption = ref('')
const _constLinkUrl = ref('')

const _constAdminCode = ref('')

let _TenantId
let _URLTenant
let _URLLink

export default {
  name: 'ListLink',

  setup () {
    const $q = useQuasar()

    return {
      txtLinkId: ref(_constLinkId),
      txtLinkTitle: ref(_constLinkTitle),
      txtLinkCaption: ref(_constLinkCaption),
      txtLinkUrl: ref(_constLinkUrl),

      txtLinkTitleNew: ref(''),
      txtLinkCaptionNew: ref(''),
      txtLinkUrlNew: ref(''),

      onLinkCreated () {
        $q.notify({
          type: 'positive',
          message: 'Link wurde erfolgreich erfasst!'
        })
      },

      onLinkUpdated () {
        $q.notify({
          type: 'positive',
          message: 'Link wurden erfolgreich aktualisiert!'
        })
      },

      onLinkDeleted () {
        $q.notify({
          message: 'Link wurde erfolgreich gelöscht!',
          color: 'orange'
        })
      },

      onLinkAlreadyExists () {
        $q.notify({
          type: 'negative',
          message: 'Dieser Link besteht bereits!'
        })
      },

      addLink: ref(false),
      editLink: ref(false),
      delLink: ref(false)
    }
  },

  data () {
    return {
      getCookie,
      setCookie,
      getAdminCode,
      getUserCode,
      URLMatchManagementAPI,

      linkObject: [
        {
          linkId: '',
          title: '',
          caption: '',
          url: ''
        }
      ]
    }
  },

  computed: {
  },

  mounted () {
    this.setVariables().then(() => {
      this.getTenantId().then(() => {
        this.getTableLink()
      })
    })
  },

  methods: {
    setVariables () {
      _constAdminCode.value = getAdminCode(getCookie('applicationCode'))
      _URLTenant = URLMatchManagementAPI + '/Tenant'
      _URLLink = URLMatchManagementAPI + '/Link'

      this.linkObject = []

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

    getTableLink () {
      this.linkObject = []

      this.$axios.get(`${_URLLink}/${_TenantId}`)
        .then((res) => {
          if (res.status === 200) {
            for (let index = 0; index < res.data.length; index++) {
              this.setLinkObject(res.data[index].id, res.data[index].title, res.data[index].caption, res.data[index].url)
            }
          } else {
            console.log('Unexpected status code:', res.status)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setLinkObject (_linkId, _title, _caption, _url) {
      this.linkObject.push({ linkId: _linkId, title: _title, caption: _caption, url: _url })
    },

    onLinkClick (_linkId, _linkTitle, _linkCaption, _linkUrl) {
      _constLinkId.value = _linkId
      _constLinkTitle.value = _linkTitle
      _constLinkCaption.value = _linkCaption
      _constLinkUrl.value = _linkUrl

      this.editLink = true
    },

    addLinkSave (_title, _caption, _url) {
      const _links = this.linkObject.map(el => el.title)
      const _linkExists = _links.includes(_title)

      if (_linkExists) {
        this.onLinkAlreadyExists()
      } else {
        const _constNewGuid = uuidv4()
        const _constCreationTime = new Date()

        const newLink = {
          id: _constNewGuid,
          creationTime: _constCreationTime,
          lastModificationTime: null,
          tenantId: _TenantId,
          title: _title,
          caption: _caption,
          url: _url
        }
        this.$axios.post(`${_URLLink}/${_TenantId}`, newLink)
          .then((res) => {
            if (res.status === 201) {
              this.onLinkUpdated()
              this.getTableLink()
            } else {
              console.log('Unexpected status code:', res.status)
            }
          })
          .catch((err) => console.log(err))
      }
    },

    editLinkSave (_linkId, _title, _caption, _url) {
      const _links = this.linkObject.map(el => el.name)
      const _linkExists = _links.includes(_title)

      if (_linkExists) {
        this.onLinkAlreadyExists()
      } else {
        const updLink = {
          id: _linkId,
          creationTime: null,
          lastModificationTime: null,
          tenantId: _TenantId,
          title: _title,
          caption: _caption,
          url: _url
        }
        this.$axios.put(`${_URLLink}/${_TenantId}/${_linkId}`, updLink)
          .then((res) => {
            if (res.status === 200) {
              this.onLinkUpdated()
              this.getTableLink()
            } else {
              console.log('Unexpected status code:', res.status)
            }
          })
          .catch((err) => console.log(err))
      }
    },

    deleteLink (_linkId) {
      this.$axios.delete(`${_URLLink}/${_TenantId}/${_linkId}`)
        .then((res) => {
          if (res.status === 200) {
            this.onLinkDeleted()
            this.getTableLink()
            this.editLink = false
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
