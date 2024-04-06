<template>
  <q-page>

    <!-- WhereIsMyCard area (Titel) -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title class="text-overline">Wer hat meine Karte ({{ whereIsMyCardObject.length }})</q-toolbar-title>
        <q-btn class="bg-white text-primary" icon="add" label="Neu" @click="addWhereIsMyCard = true" />
      </q-toolbar>
    </div>

    <!-- List of WhereIsMyCards -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
      <q-list dark bordered separator style="max-width: 470px" v-for="(card, i) in whereIsMyCardObject"
        :key="i"
        v-ripple>
        <q-item clickable v-ripple @click="onWhereIsMyCardClick(card.cardHolderId, card.cardHolder, card.discounted, card.whoHasTheCard)">
          <q-item-section avatar>
            <q-avatar size="50px" color="lime-10" text-color="white" v-if="card.cardHolderAvatar === ''">
              {{ card.cardHolder.substring(0, 1) }}
            </q-avatar>
            <q-avatar size="50px" v-if="card.cardHolderAvatar !== ''">
              <img :src="getAvatar(varAdminCode, card.cardHolderAvatar, card.cardHolderAvatarIsCustomized ===true)">
            </q-avatar>
          </q-item-section>
          <q-item-section avatar>
            <q-avatar size="50px" color="green-10" text-color="white" v-if="card.whoHasTheCardAvatar === ''">
              {{ card.whoHasTheCard.substring(0, 1) }}
            </q-avatar>
            <q-avatar size="50px" v-if="card.whoHasTheCardAvatar !== ''">
              <img :src="getAvatar(varAdminCode, card.whoHasTheCardAvatar, card.whoHasTheCardAvatarIsCustomized === true)">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label overline>Inhaber: {{ card.cardHolder }}</q-item-label>
            <q-item-label caption v-if="card.discounted === true">Kind: Ja</q-item-label>
            <q-item-label caption v-if="card.discounted === false">Kind: Nein</q-item-label>
            <q-item-label caption>Wer hat die Karte: {{ card.whoHasTheCard }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Dialogs -->
    <div class="q-pa-md q-gutter-sm">

      <!-- Start Dialogs WhereIsMyCard -->
      <!-- Add whereIsMyCard -->
      <q-dialog v-model="addWhereIsMyCard" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Karte erfassen</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input filled dense v-model="txtCardHolderNew" autofocus label="Inhaber *" />

            <q-toggle
              v-model="tglDiscountedNew"
              color="red"
              label="Kind"
              left-label
            />

            <q-input filled dense v-model="txtWhoHasTheCardNew" label="Wer hat die Karte *" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="addWhereIsMyCardSave(txtCardHolderNew, tglDiscountedNew, txtWhoHasTheCardNew)" :disable="txtCardHolderNew === '' || txtWhoHasTheCardNew === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit whereIsMyCard -->
      <q-dialog v-model="editWhereIsMyCard" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Karte ändern</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input filled dense v-model="txtCardHolder" label="Inhaber *" />

            <q-toggle
              v-model="tglDiscounted"
              color="red"
              label="Kind"
              left-label
            />

            <q-input filled dense v-model="txtWhoHasTheCard" autofocus label="Wer hat die Karte *" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn icon="delete" color="primary" @click="delWhereIsMyCard = true" v-if="getCookie('isAdministrator') === 'true'" />
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="editWhereIsMyCardSave(txtCardHolderId, txtCardHolder, txtCardHolderOld, tglDiscounted, txtWhoHasTheCard)" :disable="txtCardHolder === '' || txtWhoHasTheCard === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete WhereIsMyCard -->
      <q-dialog v-model="delWhereIsMyCard" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete" color="primary" text-color="white" />
            <span class="q-ml-sm">Datensatz löschen?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Nein" color="primary" v-close-popup />
            <q-btn flat label="Ja" color="primary" @click="deleteWhereIsMyCard(txtCardHolderId)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- End Dialogs WhereIsMyCard -->
    </div>

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import useQuasar from 'quasar/src/composables/use-quasar.js'
import { getCookie, getAdminCode, getAvatar, URLMatchManagementAPI } from 'src/boot/utils.js'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const _constCardHolderId = ref('')
const _constCardHolder = ref('')
const _constCardHolderOld = ref('')
const _constDiscounted = ref('')
const _constWhoHasTheCard = ref('')
const _constAdminCode = ref('')

let _TenantId
let _URLTenant
let _URLMember
let _URLWhereIsMyCard

export default {
  name: 'ListWhoHasTheCard',

  setup () {
    const $q = useQuasar()

    return {
      varAdminCode: ref(_constAdminCode),

      txtCardHolderId: ref(_constCardHolderId),
      txtCardHolder: ref(_constCardHolder),
      txtCardHolderOld: ref(_constCardHolderOld),
      tglDiscounted: ref(_constDiscounted),
      txtWhoHasTheCard: ref(_constWhoHasTheCard),

      txtCardHolderNew: ref(''),
      tglDiscountedNew: ref(false),
      txtWhoHasTheCardNew: ref(''),

      onCardHolderCreated () {
        $q.notify({
          type: 'positive',
          message: 'Karteninhaber wurde erfolgreich erfasst!'
        })
      },

      onCardHolderUpdated () {
        $q.notify({
          type: 'positive',
          message: 'Karteninhaber wurde erfolgreich aktualisiert!'
        })
      },

      onCardHolderDeleted () {
        $q.notify({
          message: 'Karteninhaber wurde erfolgreich gelöscht!',
          color: 'orange'
        })
      },

      onCardHolderAlreadyExists () {
        $q.notify({
          type: 'negative',
          message: 'Dieser Karteninhaber besteht bereits!'
        })
      },

      addWhereIsMyCard: ref(false),
      editWhereIsMyCard: ref(false),
      delWhereIsMyCard: ref(false)
    }
  },

  data () {
    return {
      getCookie,
      getAdminCode,
      getAvatar,
      URLMatchManagementAPI,

      whereIsMyCardObject: [
        {
          cardHolderId: '',
          cardHolder: '',
          cardHolderAvatar: '',
          cardHolderAvatarIsCustomized: '',
          discounted: '',
          whoHasTheCard: '',
          whoHasTheCardAvatar: '',
          whoHasTheCardAvatarIsCustomized: ''
        }
      ],

      memberObject: [
        {
          member: '',
          avatar: '',
          customized: ''
        }
      ]
    }
  },

  computed: {
  },

  mounted () {
    this.setVariables().then(() => {
      this.getTableMember().then(() => {
        this.getTableWhereIsMyCard()
      })
    })
  },

  methods: {
    setVariables () {
      _constAdminCode.value = getAdminCode(getCookie('applicationCode'))
      _URLTenant = URLMatchManagementAPI + '/Tenant'
      _URLWhereIsMyCard = URLMatchManagementAPI + '/CardHolder'
      _URLMember = URLMatchManagementAPI + '/Member'
      return Promise.resolve()
    },

    getTableMember () {
      return new Promise((resolve, reject) => {
        this.$axios.get(`${_URLTenant}/${_constAdminCode.value}`)
          .then((res2) => {
            if (res2.statusText === '') {
              _TenantId = res2.data.id

              this.memberObject = []

              this.$axios.get(`${_URLMember}/${_TenantId}`)
                .then((res) => {
                  if (res.statusText === '') {
                    for (let index = 0; index < res.data.length; index++) {
                      this.setMemberObject(res.data[index].name, res.data[index].avatar, res.data[index].isCustomized)
                    }
                    resolve()
                  }
                })
                .catch((err) => {
                  console.log(err)
                  reject(err)
                })
            }
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      })
    },

    setMemberObject (_member, _avatar, _customized) {
      this.memberObject.push({ member: _member, avatar: _avatar, customized: _customized })
    },

    getTableWhereIsMyCard () {
      this.whereIsMyCardObject = []

      this.$axios.get(`${_URLWhereIsMyCard}/${_TenantId}`)
        .then((res) => {
          if (res.statusText === '') {
            for (let index = 0; index < res.data.length; index++) {
              let _cardHolderAvatar = this.memberObject.find(el => el.member === res.data[index].name)?.avatar
              if (typeof _cardHolderAvatar === 'undefined') {
                _cardHolderAvatar = ''
              }
              let _cardHolderAvatarIsCustomized = this.memberObject.find(el => el.member === res.data[index].name)?.customized
              if (typeof _cardHolderAvatarIsCustomized === 'undefined') {
                _cardHolderAvatarIsCustomized = false
              }
              let _whoHasTheCardAvatar = this.memberObject.find(el => el.member === res.data[index].whoHasTheCard)?.avatar
              if (typeof _whoHasTheCardAvatar === 'undefined') {
                _whoHasTheCardAvatar = ''
              }
              let _whoHasTheCardAvatarIsCustomized = this.memberObject.find(el => el.member === res.data[index].whoHasTheCard)?.customized
              if (typeof _whoHasTheCardAvatarIsCustomized === 'undefined') {
                _whoHasTheCardAvatarIsCustomized = false
              }
              this.setWhereIsMyCardObject(res.data[index].id, res.data[index].name, _cardHolderAvatar, _cardHolderAvatarIsCustomized, res.data[index].isDiscounted, res.data[index].whoHasTheCard, _whoHasTheCardAvatar, _whoHasTheCardAvatarIsCustomized)
            }
          }
        })
        .catch((err) => console.log(err))
    },

    setWhereIsMyCardObject (_cardHolderId, _cardHolder, _cardHolderAvatar, _cardHolderAvatarIsCustomized, _discounted, _whoHasTheCard, _whoHasTheCardAvatar, _whoHasTheCardAvatarIsCustomized) {
      this.whereIsMyCardObject.push({ cardHolderId: _cardHolderId, cardHolder: _cardHolder, cardHolderAvatar: _cardHolderAvatar, cardHolderAvatarIsCustomized: _cardHolderAvatarIsCustomized, discounted: _discounted, whoHasTheCard: _whoHasTheCard, whoHasTheCardAvatar: _whoHasTheCardAvatar, whoHasTheCardAvatarIsCustomized: _whoHasTheCardAvatarIsCustomized })
    },

    onWhereIsMyCardClick (_cardHolderId, _cardHolder, _discounted, _whoHasTheCard) {
      _constCardHolderId.value = _cardHolderId
      _constCardHolder.value = _cardHolder
      _constCardHolderOld.value = _cardHolder
      _constDiscounted.value = _discounted === true
      _constWhoHasTheCard.value = _whoHasTheCard

      this.editWhereIsMyCard = true
    },

    addWhereIsMyCardSave (_cardHolder, _discounted, _whoHasTheCard) {
      const _cardHolders = this.whereIsMyCardObject.map(el => el.cardHolder)
      const _cardHolderExists = _cardHolders.includes(_cardHolder)

      if (_cardHolderExists) {
        this.onCardHolderAlreadyExists()
      } else {
        const _constNewGuid = uuidv4()
        const _constCreationTime = new Date()

        const newCardHolder = {
          id: _constNewGuid,
          creationTime: _constCreationTime,
          lastModificationTime: null,
          tenantId: _TenantId,
          name: _cardHolder,
          discounted: _discounted,
          whoHasTheCard: _whoHasTheCard
        }
        this.$axios.post(`${_URLWhereIsMyCard}/${_TenantId}`, newCardHolder)
          .then((res) => {
            if (res.statusText === '') {
              this.onCardHolderCreated()
              this.getTableWhereIsMyCard()
            }
          })
          .catch((err) => console.log(err))
      }
    },

    editWhereIsMyCardSave (_cardHolderId, _cardHolder, _cardHolderOld, _discounted, _whoHasTheCard) {
      const _cardHolders = this.whereIsMyCardObject.map(el => el.cardHolder)
      const _cardHolderExists = _cardHolders.includes(_cardHolder) && _cardHolder !== _cardHolderOld

      if (_cardHolderExists) {
        this.onCardHolderAlreadyExists()
      } else {
        const updCardHolder = {
          id: _cardHolderId,
          creationTime: null,
          lastModificationTime: null,
          tenantId: _TenantId,
          name: _cardHolder,
          discounted: _discounted,
          whoHasTheCard: _whoHasTheCard
        }
        this.$axios.put(`${_URLWhereIsMyCard}/${_TenantId}/${_cardHolderId}`, updCardHolder)
          .then((res) => {
            if (res.statusText === '') {
              this.onCardHolderUpdated()
              this.getTableWhereIsMyCard()
            }
          })
          .catch((err) => console.log(err))
      }
    },

    deleteWhereIsMyCard (_cardHolderId) {
      this.$axios.delete(`${_URLWhereIsMyCard}/${_TenantId}/${_cardHolderId}`)
        .then((res) => {
          if (res.statusText === '') {
            this.editWhereIsMyCard = false
            this.onCardHolderDeleted()
            this.getTableWhereIsMyCard()
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
