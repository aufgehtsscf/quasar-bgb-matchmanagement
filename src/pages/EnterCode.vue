<template>
  <q-page>
    <!-- Dialog -->
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="enterCode" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Code eingeben</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="txtAdminCode" autofocus label="Code" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="getProperties(txtAdminCode)" :disable="txtAdminCode === ''" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <!-- End Dialog -->

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import useQuasar from 'quasar/src/composables/use-quasar.js'
import { IsAdministrator, Client, HomeTeam, StandardText, Link1, Link2, Link3, Link4, Link5, URLMatch, URLNextMatch, URLParticipant, URLParticipantArchive, URLWhereIsMyCard, URLMember, URLProperties, URLMatchBasis, URLNextMatchBasis, URLParticipantBasis, URLParticipantArchiveBasis, URLWhereIsMyCardBasis, URLMemberBasis } from 'src/boot/utils.js'
import { ref } from 'vue'

export default {
  name: 'EnterCode',

  setup () {
    const $q = useQuasar()

    return {
      txtAdminCode: ref(''),

      onCardHolderAlreadyExists () {
        $q.notify({
          type: 'negative',
          message: 'Der eingegebene Code ist ungültig!'
        })
      },

      enterCode: ref(true)
    }
  },

  data () {
    return {
      IsAdministrator,
      Client,
      HomeTeam,
      StandardText,
      Link1,
      Link2,
      Link3,
      Link4,
      Link5,
      URLMatch,
      URLNextMatch,
      URLParticipant,
      URLParticipantArchive,
      URLWhereIsMyCard,
      URLMember,
      URLProperties,
      URLMatchBasis,
      URLNextMatchBasis,
      URLParticipantBasis,
      URLParticipantArchiveBasis,
      URLWhereIsMyCardBasis,
      URLMemberBasis
    }
  },

  computed: {
  },

  methods: {
    getProperties (_adminCode) {
      this.$axios(`${this.URLProperties}&func=ReadAdminCode&adminCode=${_adminCode}`)
        .then((res) => {
          this.tableProperties = res.data.split('\n')
          for (let index = 0; index < this.tableProperties.length - 1; index++) {
            const element = this.tableProperties[index].split(',')
            const element2 = element[2].split('_')

            if (element[1] === _adminCode) {
              this.IsAdministrator = true
            } else {
              this.IsAdministrator = false
            }

            if (IsAdministrator === true ||
          (element[1].substring(1, 4) + element[1].substring(6, 4) === element2[1] && parseInt(element2[2]) > 330)) {
              this.Client = _adminCode
              this.HomeTeam = element[3]
              this.StandardText = element[4]
              this.Link1 = element[5]
              this.Link2 = element[6]
              this.Link3 = element[7]
              this.Link4 = element[8]
              this.Link5 = element[9]
              this.URLMatch = URLMatchBasis + '?sh=' + this.Client
              this.URLNextMatch = URLNextMatchBasis + '?sh=' + this.HomeTeam
              this.URLParticipant = URLParticipantBasis + '?sh=' + this.Client
              this.URLParticipantArchive = URLParticipantArchiveBasis + '?sh=' + this.Client
              this.URLWhereIsMyCard = URLWhereIsMyCardBasis + '?sh=' + this.Client
              this.URLMember = URLMemberBasis + '?sh=' + this.Client
            }
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
