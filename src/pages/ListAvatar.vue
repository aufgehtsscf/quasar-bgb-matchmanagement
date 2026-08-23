<template>
  <q-page>
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title class="text-overline">Avatare ({{ avatarObject.length }})</q-toolbar-title>
        <q-btn class="bg-white text-primary" icon="add" label="Neu" @click="addAvatar = true" />
      </q-toolbar>
    </div>

    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list v-for="avatar in avatarObject" :key="avatar.avatarId" dark bordered separator style="max-width: 470px" v-ripple>
        <q-item clickable v-ripple @click="onAvatarClick(avatar.avatarId, avatar.avatar, avatar.imageURL)">
          <q-item-section avatar>
            <q-avatar size="50px" v-if="avatar.imageURL !== ''">
              <img :src="avatar.imageURL" :alt="avatar.avatar">
            </q-avatar>
            <q-avatar size="50px" color="pink-10" text-color="white" v-else>
              {{ avatar.avatar.substring(0, 1) }}
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label overline>{{ avatar.avatar }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="addAvatar" persistent>
        <q-card style="min-width: 350px">
          <q-card-section><div class="text-h6">Avatar erfassen</div></q-card-section>
          <q-card-section class="q-pt-none">
            <q-input v-model="txtAvatarNew" filled dense autofocus label="Avatar *" />
            <q-file v-model="fileImageNew" class="q-pt-md" filled dense accept="image/*" label="Avatar Bild *" @rejected="onFileRejected" />
            <q-img v-if="previewImageNew" :src="previewImageNew" class="q-mt-md" style="max-width: 150px" />
          </q-card-section>
          <q-separator />
          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" :disable="txtAvatarNew.trim() === '' || !fileImageNew" @click="addAvatarSave(txtAvatarNew, fileImageNew)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="editAvatar" persistent>
        <q-card style="min-width: 350px">
          <q-card-section><div class="text-h6">Avatar bearbeiten</div></q-card-section>
          <q-card-section class="q-pt-none">
            <q-input v-model="txtAvatar" filled dense label="Avatar *" />
            <q-file v-model="fileImage" class="q-pt-md" filled dense accept="image/*" label="Avatar Bild" @rejected="onFileRejected" />
            <q-img v-if="previewImage" :src="previewImage" class="q-mt-md" style="max-width: 150px" />
          </q-card-section>
          <q-separator />
          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" color="primary" @click="delAvatar = true" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" :disable="txtAvatar.trim() === ''" @click="editAvatarSave(txtAvatarId, txtAvatar, txtAvatarOld, fileImage)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="delAvatar" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="primary" text-color="white" />
            <span class="q-ml-sm">Datensatz löschen?</span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Nein" color="primary" v-close-popup />
            <q-btn flat label="Ja" color="primary" @click="deleteAvatar(txtAvatarId)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'
import { getAdminCode, getCookie, URLMatchManagementAPI } from 'src/boot/utils.js'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const _constAvatarId = ref('')
const _constAvatar = ref('')
const _constAvatarOld = ref('')
const _constImageURL = ref('')
const _constAdminCode = ref('')

let _TenantId
let _URLTenant
let _URLAvatar

export default {
  name: 'ListAvatar',

  setup () {
    const $q = useQuasar()
    return {
      getCookie,
      txtAvatarId: ref(_constAvatarId),
      txtAvatar: ref(_constAvatar),
      txtAvatarOld: ref(_constAvatarOld),
      txtAvatarNew: ref(''),
      fileImage: ref(null),
      fileImageNew: ref(null),
      previewImage: ref(''),
      previewImageNew: ref(''),
      addAvatar: ref(false),
      editAvatar: ref(false),
      delAvatar: ref(false),
      onAvatarCreated () { $q.notify({ type: 'positive', message: 'Avatar wurde erfolgreich erfasst!' }) },
      onAvatarUpdated () { $q.notify({ type: 'positive', message: 'Avatar wurde erfolgreich aktualisiert!' }) },
      onAvatarDeleted () { $q.notify({ message: 'Avatar wurde erfolgreich gelöscht!', color: 'orange' }) },
      onAvatarAlreadyExists () { $q.notify({ type: 'negative', message: 'Dieses Avatar besteht bereits!' }) },
      onFileRejected () { $q.notify({ type: 'negative', message: 'Datei konnte nicht hochgeladen werden. Bitte verwende ein Bild-Format.' }) }
    }
  },

  data () {
    return { avatarObject: [] }
  },

  watch: {
    fileImage (newVal) {
      this.previewImage = newVal ? URL.createObjectURL(newVal) : _constImageURL.value
    },
    fileImageNew (newVal) {
      this.previewImageNew = newVal ? URL.createObjectURL(newVal) : ''
    }
  },

  mounted () {
    this.setVariables().then(() => this.getTenantId().then(() => this.getTableAvatar()))
  },

  methods: {
    setVariables () {
      _constAdminCode.value = getAdminCode(getCookie('applicationCode'))
      _URLTenant = URLMatchManagementAPI + '/Tenant'
      _URLAvatar = URLMatchManagementAPI + '/Avatar'
      this.avatarObject = []
      return Promise.resolve()
    },

    getTenantId () {
      return this.$axios.get(`${_URLTenant}/code/${_constAdminCode.value}`).then((res) => {
        if (res.status === 200) _TenantId = res.data.id
        else throw new Error('Unexpected status code')
      }).catch((err) => console.log(err))
    },

    getTableAvatar () {
      this.avatarObject = []
      this.$axios.get(`${_URLAvatar}/${_TenantId}`).then((res) => {
        if (res.status === 200) res.data.forEach(avatar => this.setAvatarObject(avatar.id, avatar.name.trim(), avatar.imageURL || ''))
      }).catch((err) => console.log(err))
    },

    setAvatarObject (_avatarId, _avatar, _imageURL) {
      this.avatarObject.push({ avatarId: _avatarId, avatar: _avatar, imageURL: _imageURL ? URLMatchManagementAPI + _imageURL : '' })
      this.avatarObject.sort((a, b) => a.avatar.localeCompare(b.avatar))
    },

    onAvatarClick (_avatarId, _avatar, _imageURL) {
      _constAvatarId.value = _avatarId
      _constAvatar.value = _avatar
      _constAvatarOld.value = _avatar
      _constImageURL.value = _imageURL
      this.previewImage = _imageURL
      this.fileImage = null
      this.editAvatar = true
    },

    addAvatarSave (_avatar, _file) {
      const avatarName = _avatar.replaceAll('.', '').trim()
      if (this.avatarObject.some(el => el.avatar === avatarName)) {
        this.onAvatarAlreadyExists()
        return
      }
      this.uploadImage(_file, (_error, imageBase64) => {
        this.$axios.post(`${_URLAvatar}/${_TenantId}`, {
          id: uuidv4(),
          creationTime: new Date(),
          lastModificationTime: null,
          tenantId: _TenantId,
          name: avatarName,
          file: imageBase64
        }).then((res) => {
          if (res.status === 201) {
            this.onAvatarCreated()
            this.getTableAvatar()
            this.resetNewAvatar()
          }
        }).catch((err) => console.log(err))
      })
    },

    editAvatarSave (_avatarId, _avatar, _avatarOld, _file) {
      const avatarName = _avatar.replaceAll('.', '').trim()
      if (this.avatarObject.some(el => el.avatar === avatarName && avatarName !== _avatarOld)) {
        this.onAvatarAlreadyExists()
        return
      }
      const saveAvatar = (_error, imageBase64) => {
        this.$axios.put(`${_URLAvatar}/${_TenantId}/${_avatarId}`, {
          id: _avatarId,
          creationTime: null,
          lastModificationTime: new Date(),
          tenantId: _TenantId,
          name: avatarName,
          file: imageBase64
        }).then((res) => {
          if (res.status === 200) {
            this.onAvatarUpdated()
            this.getTableAvatar()
          }
        }).catch((err) => console.log(err))
      }
      if (_file) this.uploadImage(_file, saveAvatar)
      else saveAvatar(null, '')
    },

    deleteAvatar (_avatarId) {
      this.$axios.delete(`${_URLAvatar}/${_TenantId}/${_avatarId}`).then((res) => {
        if (res.status === 200) {
          this.onAvatarDeleted()
          this.getTableAvatar()
          this.editAvatar = false
        }
      }).catch((err) => console.log(err))
    },

    resetNewAvatar () {
      this.txtAvatarNew = ''
      this.fileImageNew = null
      this.previewImageNew = ''
    },

    uploadImage (file, callback) {
      const reader = new FileReader()
      reader.onload = (e) => callback(null, `data:${file.type};base64,${e.target.result.split(',')[1]}`)
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
