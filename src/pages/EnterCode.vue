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
            <q-input dense v-model="txtCode" autofocus label="Code" />
          </q-card-section>

          <q-separator />

          <q-card-actions class="text-primary" align="right">
            <q-btn flat label="Abbrechen" v-close-popup />
            <q-btn icon="save" label="Speichern" @click="CheckCode(txtCode)" :disable="txtCode === ''" v-close-popup />
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
import { IsAdministrator, Client, HomeTeam, StandardText } from 'src/boot/utils.js'
import { ref } from 'vue'

export default {
  name: 'EnterCode',

  setup () {
    const $q = useQuasar()

    return {
      txtCode: ref(''),

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
      StandardText
    }
  },

  computed: {
  },

  methods: {
    CheckCode (_code) {
      console.log('CheckCode: ' + _code)

      // this.$axios(`${this.URLCode}&func=Check&code=${_code}`)
      //   .then((res) => {
      //     this.tableMember = res.data.split('\n')
      //     for (let index = 0; index < this.tableMember.length - 1; index++) {
      //       const element = this.tableMember[index].split(',')
      //       this.IsAdministrator = true,
      //       this.Client = _code,
      //       this.HomeTeam = 'Freiburg',
      //       this.StandardText = null
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //   })
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
