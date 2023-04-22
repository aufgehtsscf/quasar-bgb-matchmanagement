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
        <q-item clickable v-ripple @click="onMemberClick(member.memberId, member.member, member.avatarFileName)">
          <q-item-section avatar>
            <q-avatar size="50px" color="lime-10" text-color="white" v-if="!hasAvatar(member.member)">
              {{ member.member.substring(0, 1) }}
            </q-avatar>
            <q-avatar size="50px" v-if="hasAvatar(member.member)">
              <img :src="getAvatar(member.member)">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label overline>Mitglied: {{ member.member }}</q-item-label>
            <q-item-label caption>Dateiname: {{ member.avatarFileName }}</q-item-label>
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

            <br />

            <q-uploader
              url="statics/avatars"
              label="Dein Foto/Avatar"
              auto-upload
              accept="image/*"
              max-file-size="512000"
              @rejected="onRejected"
              style="max-width: 350px"
            />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addMemberSave(txtMemberNew, fileAvatarFileNameNew)" :disable="txtMemberNew === ''" v-close-popup />
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

            <br />

            <q-uploader
              url="statics/avatars"
              label="Dein Foto/Avatar"
              auto-upload
              accept="image/*"
              max-file-size="512000"
              @rejected="onRejected"
              style="max-width: 350px"
            />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" color="primary" @click="delMember = true" v-if="IsAdministrator" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editMemberSave(txtMemberId, txtMember, txtMemberOld, fileAvatarFileName)" :disable="txtMember === ''" v-close-popup />
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

    <q-img src="statics/BGB.jpg" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import useQuasar from 'quasar/src/composables/use-quasar.js'
import { URLMember, hasAvatar, getAvatar } from 'src/boot/utils.js'
import { ref } from 'vue'

const _constHolderId = ref('')
const _constMember = ref('')
const _constMemberOld = ref('')
const _constAvatarFileName = ref('')

export default {
  name: 'ListMember',

  setup () {
    const $q = useQuasar()

    return {
      IsAdministrator: ref(true),

      txtMemberId: ref(_constHolderId),
      txtMember: ref(_constMember),
      txtMemberOld: ref(_constMemberOld),
      fileAvatarFileName: ref(_constAvatarFileName),

      txtMemberNew: ref(''),
      fileAvatarFileNameNew: ref(null),

      onRejected () {
        $q.notify({
          type: 'negative',
          message: 'Bitte lade eine Bilddatei mit maximal 500K hoch!'
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
      URLMember,
      hasAvatar,
      getAvatar,

      memberObject: [
        {
          memberId: '',
          member: '',
          avatarFileName: ''
        }
      ]
    }
  },

  computed: {
  },

  mounted () {
    this.getTableMember()
  },

  methods: {
    getTableMember () {
      this.memberObject = []

      // console.log('URLMember: ' + this.URLMember + '&func=Read&member=')
      this.$axios(`${this.URLMember}&func=Read&member=`)
        .then((res) => {
          this.tableMember = res.data.split('\n')
          for (let index = 0; index < this.tableMember.length - 1; index++) {
            const element = this.tableMember[index].split(',')
            this.setMemberObject(element[1], element[3], element[4])
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setMemberObject (_memberId, _member, _avatarFileName) {
      this.memberObject.push({ memberId: _memberId, member: _member, avatarFileName: _avatarFileName })
    },

    onMemberClick (_memberId, _member, _avatarFileName) {
      // console.log('Clicked on Member: ' + _memberId + ', ' + _member + ', ' + _avatarFileName)
      _constHolderId.value = _memberId
      _constMember.value = _member
      _constMemberOld.value = _member
      _constAvatarFileName.value = _avatarFileName

      this.editMember = true
    },

    addMemberSave (_member, _avatarFileName) {
      // console.log('addMemberSave: ' + _member + ', ' + _avatarFileName)

      const _members = this.memberObject.map(el => el.member)
      const _memberExists = _members.includes(_member)
      if (_memberExists) {
        this.onMemberAlreadyExists()
      } else {
        this.$axios(`${this.URLMember}&func=Add&member=${encodeURI(_member.replace(',', ' '))}&avatarFileName=${_avatarFileName}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.getTableMember()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    editMemberSave (_memberId, _member, _memberOld, _avatarFileName) {
      // console.log('editMemberSave: ' + _memberId + ', ' + _member + ', ' + _memberOld + ', ' + _avatarFileName)

      const _members = this.memberObject.map(el => el.member)
      const _memberExists = _members.includes(_member) && _member !== _memberOld
      if (_memberExists) {
        this.onMemberAlreadyExists()
      } else {
        this.$axios(`${this.URLMember}&func=Update&memberId=${_memberId}&member=${encodeURI(_member.replace(',', ' '))}&avatarFileName=${_avatarFileName}`)
          .then((res) => {
            if (res.data === 'Success, requested action completed') {
              this.getTableMember()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    deleteMember (_memberId) {
      // console.log('deleteMember: ' + _memberId)

      this.$axios(`${this.URLMember}&func=Delete&memberId=${_memberId}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
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
.header-image {
  height: 100%;
  z-index: -1;
  opacity: 0.2;
  filter: grayscale(100%);
}
</style>
