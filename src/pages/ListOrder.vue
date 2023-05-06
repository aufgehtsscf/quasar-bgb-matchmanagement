<template>
  <q-page>
    <div class="q-pa-md" style="max-width: 500px">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>
        Bestellungen
      </q-toolbar-title>
    </q-toolbar>
  </div>

  <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
    <q-list dark bordered separator style="max-width: 470px" v-for="i in index"
      :key="i"
      v-ripple>
      <q-item clickable v-ripple @click="onOrderClick(position[i], name[i], product[i], size[i], color[i], initials[i])" v-if="i > 0">
        <q-item-section>
          <q-item-label overline>Name: {{ name[i] }}</q-item-label>
          <q-item-label caption>Artikel: {{ product[i] }}</q-item-label>
          <q-item-label caption>Größe: {{ size[i] }}</q-item-label>
          <q-item-label caption>Farbe: {{ color[i] }}</q-item-label>
          <q-item-label caption>Initialen: {{ initials[i] }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

  </div>

  <q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import { IsAdministrator, URLOrder } from 'src/boot/utils.js'
import { ref } from 'vue'

const _constPosition = ref('')
const _constName = ref('')
const _constProduct = ref('')
const _constSize = ref('')
const _constColor = ref('')
const _constInitials = ref('')

export default {
  name: 'ListOrder',

  setup () {
    return {
    }
  },

  data () {
    return {
      IsAdministrator,
      URLOrder,

      index: [],
      position: [],
      name: [],
      product: [],
      size: [],
      color: [],
      initials: []
    }
  },

  computed: {
  },

  mounted () {
    this.getTableOrder()
  },

  methods: {
    getTableOrder () {
      console.log('URLOrder: ' + this.URLOrder + '&func=Read')
      this.$axios(`${this.URLOrder}&func=Read`)
        .then((res) => {
          this.tableOrder = res.data.split('\n')
          for (let index = 0; index < this.tableOrder.length - 1; index++) {
            const element = this.tableOrder[index].split(',')
            for (let index2 = 0; index2 < element.length; index2++) {
              switch (index2) {
                case 0:
                  this.index[index + 1] = index + 1
                  this.position[index + 1] = element[index2]
                  break
                case 2:
                  this.name[index + 1] = element[index2]
                  break
                case 3:
                  this.product[index + 1] = element[index2]
                  break
                case 4:
                  this.size[index + 1] = element[index2]
                  break
                case 5:
                  this.color[index + 1] = element[index2]
                  break
                case 6:
                  this.initials[index + 1] = element[index2]
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

    onOrderClick (_position, _name, _product, _size, _color, _initials) {
      console.log('Clicked on an Order: ' + _position + ', ' + _name + ', ' + _product + ', ' + _size + ', ' + _color + ', ' + _initials)
      _constPosition.value = _position
      _constName.value = _name
      _constProduct.value = _product
      _constSize.value = _size
      _constColor.value = _color
      _constInitials.value = _initials
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
