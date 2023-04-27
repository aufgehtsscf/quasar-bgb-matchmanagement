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
        <q-item clickable v-ripple @click="onMemberClick(member.row, member.memberId, member.member, member.avatarFileName)">
          <q-item-section avatar>
            <q-avatar size="50px" color="lime-10" text-color="white" v-if="!hasAvatar(member.member)">
              {{ member.member.substring(0, 1) }}
            </q-avatar>
            <q-avatar size="50px" v-if="hasAvatar(member.member)">
              <img :src="getAvatar(member.member)">
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
            <q-input dense v-model="txtMemberNew" autofocus label="Mitglied" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addMemberSave(txtMemberNew)" :disable="txtMemberNew === ''" v-close-popup />
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
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" color="primary" @click="delMember = true" v-if="IsAdministrator" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editMemberSave(intMemberRow, txtMemberId, txtMember, txtMemberOld)" :disable="txtMember === ''" v-close-popup />
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
            <q-btn flat label="Ja" color="primary" @click="deleteMember(intMemberRow, txtMemberId)" v-close-popup />
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
import { IsAdministrator, URLMember, hasAvatar, getAvatar } from 'src/boot/utils.js'
import { ref } from 'vue'

const _constMemberRow = ref(0)
const _constMemberId = ref('')
const _constMember = ref('')
const _constMemberOld = ref('')

export default {
  name: 'ListMember',

  setup () {
    const $q = useQuasar()

    return {
      intMemberRow: ref(_constMemberRow),
      txtMemberId: ref(_constMemberId),
      txtMember: ref(_constMember),
      txtMemberOld: ref(_constMemberOld),

      txtMemberNew: ref(''),

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
      IsAdministrator,
      URLMember,
      hasAvatar,
      getAvatar,

      memberObject: [
        {
          row: '',
          memberId: '',
          member: ''
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

      // console.log('URLMember: ' + this.URLMember + '&func=Read')
      this.$axios(`${this.URLMember}&func=Read`)
        .then((res) => {
          this.tableMember = res.data.split('\n')
          for (let index = 0; index < this.tableMember.length - 1; index++) {
            const element = this.tableMember[index].split(',')
            this.setMemberObject(element[0], element[1], element[3])
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setMemberObject (_row, _memberId, _member) {
      this.memberObject.push({ row: parseInt(_row), memberId: _memberId, member: _member })
    },

    onMemberClick (_row, _memberId, _member) {
      // console.log('Clicked on Member: ' + _row + ', ' + _memberId + ', ' + _member)
      _constMemberRow.value = _row
      _constMemberId.value = _memberId
      _constMember.value = _member
      _constMemberOld.value = _member

      this.editMember = true
    },

    addMemberSave (_member) {
      // console.log('addMemberSave: ' + _member)

      const _members = this.memberObject.map(el => el.member)
      const _memberExists = _members.includes(_member)
      if (_memberExists) {
        this.onMemberAlreadyExists()
      } else {
        this.$axios(`${this.URLMember}&func=Add&member=${encodeURI(_member.replace(',', ' '))}&avatarFileName=`)
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

    editMemberSave (_row, _memberId, _member, _memberOld) {
      // console.log('editMemberSave: ' + _row + ', ' + _memberId + ', ' + _member + ', ' + _memberOld)

      const _members = this.memberObject.map(el => el.member)
      const _memberExists = _members.includes(_member) && _member !== _memberOld
      if (_memberExists) {
        this.onMemberAlreadyExists()
      } else {
        this.$axios(`${this.URLMember}&func=Update&row=${_row}&memberId=${_memberId}&member=${encodeURI(_member.replace(',', ' '))}&avatarFileName=`)
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

    deleteMember (_row, _memberId) {
      // console.log('deleteMember: ' + _row + ', ' + _memberId)

      this.$axios(`${this.URLMember}&func=Delete&row=${_row}&memberId=${_memberId}`)
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
