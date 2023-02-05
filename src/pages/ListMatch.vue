<template>
  <q-page>
    <div class="q-pa-md" style="max-width: 500px">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>
        Spiele
      </q-toolbar-title>
    </q-toolbar>
  </div>

  <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
    <q-list dark bordered separator style="max-width: 470px" v-for="i in index"
      :key="i"
      v-ripple>
      <q-item clickable v-ripple @click="onMatchClick(position[i], match[i], published[i], time[i], annotations[i], date[i])" v-if="i > 0">
        <q-item-section>
          <q-item-label overline>{{ match[i] }}</q-item-label>
          <q-item-label caption>{{ date[i] }} - {{ time[i] }}</q-item-label>
          <q-item-label caption>{{ txtPublished[i] }}</q-item-label>
          <q-item-label caption>{{ annotations[i] }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

  </div>

  <q-img src="statics/BGB.jpg" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import { ref } from 'vue'

const _constPosition = ref('')
const _constMatch = ref('')
const _constPublished = ref('')
const _constTime = ref('')
const _constAnnotations = ref('')
const _constDate = ref('')
const _constMatchName = ref('')

export default {
  name: 'ListMatch',

  setup () {
    return {
    }
  },

  data () {
    return {
      URLMatch: 'https://script.google.com/macros/s/AKfycbyh43MSF1Vz9W3TZ0_9e273B81CtCEk4se3yHj9HCbIvBlfw9g6tHE3d5O8eXW3yIkyog/exec?ID=1znyBnIzqghCeRImZ8fSVGB_gR6TESuqep20YbUhkhSU&SH=BGB-Match',

      index: [],
      position: [],
      match: [],
      published: [],
      txtPublished: [],
      time: [],
      annotations: [],
      date: []
    }
  },

  computed: {
  },

  mounted () {
    this.getTableMatch()
  },

  methods: {
    getTableMatch () {
      console.log('URLMatch: ' + this.URLMatch + '&func=Read&published=TRUE')
      this.$axios(`${this.URLMatch}&func=Read&published=TRUE`)
        .then((res) => {
          this.tableMatch = res.data.split('\n')
          for (let index = 0; index < this.tableMatch.length - 1; index++) {
            const element = this.tableMatch[index].split(',')
            for (let index2 = 0; index2 < element.length; index2++) {
              switch (index2) {
                case 0:
                  this.index[index + 1] = index + 1
                  this.position[index + 1] = element[index2]
                  break
                case 2:
                  this.match[index + 1] = element[index2]
                  break
                case 3:
                  this.published[index + 1] = element[index2]
                  if (element[index2] === 'TRUE') {
                    this.txtPublished[index + 1] = 'Aktiv'
                  } else {
                    this.txtPublished[index + 1] = 'Inaktiv'
                  }
                  break
                case 4:
                  this.time[index + 1] = element[index2].substr(0, 5)
                  break
                case 5:
                  this.annotations[index + 1] = element[index2].replace(/§§§/g, ' / ')
                  break
                case 6:
                  this.date[index + 1] = element[index2]
                  break
                default:
                  break
              }
            }
          }
          // console.log(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    onMatchClick (_position, _match, _published, _time, _annotations, _date) {
      console.log('Clicked on an Match: ' + _position + ', ' + _match + ', ' + _published + ', ' + _time + ', ' + _annotations + ', ' + _date)
      _constPosition.value = _position
      _constMatch.value = _match
      _constPublished.value = _published
      _constTime.value = _time
      _constAnnotations.value = _annotations
      _constDate.value = _date
      _constMatchName.value = _match.trim() + ' ' + _date.substr(0, 6) + _date.substr(8, 2) + ' - ' + _time
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
