<template>
  <q-page>

  <!-- Last order (Titel) -->
  <div class="q-pa-md" style="max-width: 500px">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>
        Aktuelle Bestellung ({{ order2Object.length }})</q-toolbar-title>
        <q-btn class="bg-white text-primary" icon="add" label="Neu" @click="addOrder = true" />
      </q-toolbar>
  </div>

  <!-- List of positions of last order -->
  <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
    <q-list dark bordered separator style="max-width: 470px" v-for="(order2, i) in order2Object"
      :key="i"
      v-ripple>
      <q-item clickable v-ripple @click="onOrder2Click(order2.row, order2.name, order2.product, order2.size, order2.color, order2.initials, order2.positionId, order2.orderId)">
        <q-item-section>
          <q-item-label overline>Name: {{ order2.name }}</q-item-label>
          <q-item-label caption>Artikel: {{ order2.product }}</q-item-label>
          <q-item-label caption>Größe: {{ order2.size }}</q-item-label>
          <q-item-label caption>Farbe: {{ order2.color }}</q-item-label>
          <q-item-label caption>Initialen: {{ order2.initials }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>

  <!-- Previous order (Titel) -->
  <div class="q-pa-md" style="max-width: 500px">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>
        Frühere Bestellung ({{ order1Object.length }})</q-toolbar-title>
    </q-toolbar>
  </div>

  <!-- List of positions of previous order -->
  <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
    <q-list dark bordered separator style="max-width: 470px" v-for="(order1, i) in order1Object"
      :key="i"
      v-ripple>
      <q-item>
        <q-item-section>
          <q-item-label overline>Name: {{ order1.name }}</q-item-label>
          <q-item-label caption>Artikel: {{ order1.product }}</q-item-label>
          <q-item-label caption>Größe: {{ order1.size }}</q-item-label>
          <q-item-label caption>Farbe: {{ order1.color }}</q-item-label>
          <q-item-label caption>Initialen: {{ order1.initials }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>

    <!-- Dialogs -->
    <div class="q-pa-md q-gutter-sm">

<!-- Start Dialogs Order -->
<!-- Add Order -->
<q-dialog v-model="addOrder" persistent>
  <q-card style="min-width: 350px">
    <q-card-section>
      <div class="text-h6">Bestellung erfassen</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input filled dense v-model="txtNameNew" autofocus label="Name *" />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-select
        filled dense
        v-model="txtProductNew"
        :options="cbxProductOptions"
        label="Artikel *"
        options-selected-class="text-deep-orange"
      >
      </q-select>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-select
        filled dense
        v-model="txtSizeNew"
        :options="cbxSizeOptions"
        label="Größe *"
        options-selected-class="text-deep-orange"
      >
      </q-select>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-select
        filled dense
        v-model="txtColorNew"
        :options="cbxColorOptions"
        label="Farbe *"
        options-selected-class="text-deep-orange"
      >
      </q-select>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input filled dense v-model="txtInitialsNew"  label="Initialen" />
    </q-card-section>

    <q-separator />

    <q-card-actions class="text-primary" align="right">
      <q-btn flat label="Abbrechen" v-close-popup />
      <q-btn icon="save" label="Speichern" @click="addOrderSave(OrderId2, txtNameNew, txtProductNew, txtSizeNew, txtColorNew, txtInitialsNew)" :disable="txtNameNew === '' || txtProductNew === '' || txtSizeNew === '' || txtColorNew === ''" v-close-popup />
    </q-card-actions>
  </q-card>
</q-dialog>

<!-- Edit Order -->
<q-dialog v-model="editOrder" persistent>
  <q-card style="min-width: 350px">
    <q-card-section>
      <div class="text-h6">Bestellung ändern</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input filled dense v-model="txtName" autofocus label="Name *" />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-select
        filled dense
        v-model="txtProduct"
        :options="cbxProductOptions"
        label="Artikel *"
        options-selected-class="text-deep-orange"
      >
      </q-select>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-select
        filled dense
        v-model="txtSize"
        :options="cbxSizeOptions"
        label="Größe *"
        options-selected-class="text-deep-orange"
      >
      </q-select>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-select
        filled dense
        v-model="txtColor"
        :options="cbxColorOptions"
        label="Farbe *"
        options-selected-class="text-deep-orange"
      >
      </q-select>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input filled dense v-model="txtInitials"  label="Initialen" />
    </q-card-section>

    <q-separator />

    <q-card-actions class="text-primary" align="right">
      <q-btn icon="delete" color="primary" @click="delOrder = true" v-if="getCookie('isAdministrator') === 'true'" />
      <q-btn flat label="Abbrechen" v-close-popup />
      <q-btn icon="save" label="Speichern" @click="editOrderSave(intOrderRow, txtPositionId, txtOrderId, txtName, txtProduct, txtSize, txtColor, txtInitials)" :disable="txtName === '' || txtProduct === '' || txtSize === '' || txtColor === ''" v-close-popup />
    </q-card-actions>
  </q-card>
</q-dialog>

<!-- Delete Order -->
<q-dialog v-model="delOrder" persistent>
  <q-card>
    <q-card-section class="row items-center">
      <q-avatar icon="delete" color="primary" text-color="white" />
      <span class="q-ml-sm">Datensatz löschen?</span>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Nein" color="primary" v-close-popup />
      <q-btn flat label="Ja" color="primary" @click="deleteOrder(intOrderRow, txtPositionId, txtOrderId)" v-close-popup />
    </q-card-actions>
  </q-card>
</q-dialog>
<!-- End Dialogs Member -->
</div>

<q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import useQuasar from 'quasar/src/composables/use-quasar.js'
import { getCookie, getAdminCode, URLOrderBasis, OrderId1, OrderId2 } from 'src/boot/utils.js'
import { ref } from 'vue'

const _constRow = ref('')
const _constName = ref('')
const _constProduct = ref('')
const _constSize = ref('')
const _constColor = ref('')
const _constInitials = ref('')
const _constPositionId = ref('')
const _constOrderId = ref('')

let _URLOrder

export default {
  name: 'ListOrder',

  setup () {
    const $q = useQuasar()

    return {
      txtNameNew: ref(''),
      txtProductNew: ref(''),
      txtSizeNew: ref(''),
      txtColorNew: ref(''),
      txtInitialsNew: ref(''),

      intOrderRow: ref(_constRow),
      txtPositionId: ref(_constPositionId),
      txtOrderId: ref(_constOrderId),
      txtName: ref(_constName),
      txtProduct: ref(_constProduct),
      txtSize: ref(_constSize),
      txtColor: ref(_constColor),
      txtInitials: ref(_constInitials),

      cbxProductOptions: ['Hoodie', 'Zipjacke Damen', 'Zipjacke Herren'],
      cbxSizeOptions: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
      cbxColorOptions: ['Rot', 'Schwarz'],

      onOrderCreated () {
        $q.notify({
          type: 'positive',
          message: 'Bestellung wurde erfolgreich erfasst!'
        })
      },

      onOrderUpdated () {
        $q.notify({
          type: 'positive',
          message: 'Bestellung wurde erfolgreich aktualisiert!'
        })
      },

      onOrderDeleted () {
        $q.notify({
          message: 'Bestellung wurde erfolgreich gelöscht!',
          color: 'orange'
        })
      },

      addOrder: ref(false),
      editOrder: ref(false),
      delOrder: ref(false)
    }
  },

  data () {
    return {
      getCookie,
      getAdminCode,
      URLOrderBasis,
      OrderId1,
      OrderId2,

      order2Object: [
        {
          row: '',
          name: '',
          product: '',
          size: '',
          color: '',
          initials: '',
          positionId: '',
          orderId: ''
        }
      ],

      order1Object: [
        {
          name: '',
          product: '',
          size: '',
          color: '',
          initials: ''
        }
      ]
    }
  },

  computed: {
  },

  mounted () {
    this.setVariables()
    this.getTableOrder2()
    this.getTableOrder1()
  },

  methods: {
    setVariables () {
      _URLOrder = URLOrderBasis + '?sh=' + getAdminCode(getCookie('applicationCode'))
    },

    getTableOrder2 () {
      this.order2Object = []

      // console.log('URLOrder: ' + _URLOrder + '&func=Read&orderId=' + OrderId2)
      this.$axios(`${_URLOrder}&func=Read&orderId=${OrderId2}`)
        .then((res) => {
          this.tableOrder2 = res.data.split('\n')
          for (let index = 0; index < this.tableOrder2.length - 1; index++) {
            const element = this.tableOrder2[index].split(',')
            this.setOrder2Object(element[0], element[2], element[3], element[4], element[5], element[6], element[7], element[8])
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setOrder2Object (_row, _name, _product, _size, _color, _initials, _positionId, _orderId) {
      this.order2Object.push({ row: parseInt(_row), name: _name, product: _product, size: _size, color: _color, initials: _initials, positionId: _positionId, orderId: _orderId })
    },

    getTableOrder1 () {
      this.order1Object = []

      // console.log('URLOrder: ' + _URLOrder + '&func=Read&orderId=' + OrderId1)
      this.$axios(`${_URLOrder}&func=Read&orderId=${OrderId1}`)
        .then((res) => {
          this.tableOrder1 = res.data.split('\n')
          for (let index = 0; index < this.tableOrder1.length - 1; index++) {
            const element = this.tableOrder1[index].split(',')
            this.setOrder1Object(element[2], element[3], element[4], element[5], element[6])
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    setOrder1Object (_name, _product, _size, _color, _initials) {
      this.order1Object.push({ name: _name, product: _product, size: _size, color: _color, initials: _initials })
    },

    onOrder2Click (_row, _name, _product, _size, _color, _initials, _positionId, _orderId) {
      // console.log('Clicked on an Order: ' + _row + ', ' + _name + ', ' + _product + ', ' + _size + ', ' + _color + ', ' + _initials + ', ' + _positionId + ', ' + _orderId)
      _constRow.value = _row
      _constName.value = _name
      _constProduct.value = _product
      _constSize.value = _size
      _constColor.value = _color
      _constInitials.value = _initials
      _constPositionId.value = _positionId
      _constOrderId.value = _orderId

      if (getCookie('isAdministrator') === 'true') this.editOrder = true
    },

    addOrderSave (_orderId, _name, _product, _size, _color, _initials) {
      // console.log('addOrderSave: ' + _orderId + ', ' + _name + ', ' + _product + ', ' + _size + ', ' + _color + ', ' + _initials)

      this.$axios(`${_URLOrder}&func=Add&orderId=${_orderId}&name=${encodeURI(_name.replace(',', ' '))}&product=${_product}&size=${_size}&color=${_color}&initials=${encodeURI(_initials.replace(',', ' '))}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.onOrderCreated()
            this.getTableOrder2()
            this.getTableOrder1()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    editOrderSave (_row, _positionId, _orderId, _name, _product, _size, _color, _initials) {
      // console.log('editOrderSave: ' + _row + ', ' + _positionId + ', ' + _orderId + ', ' + _name + ', ' + _product + ', ' + _size + ', ' + _color + ', ' + _initials)

      this.$axios(`${_URLOrder}&func=Update&row=${_row}&positionId=${_positionId}&orderId=${_orderId}&name=${encodeURI(_name.replace(',', ' '))}&product=${_product}&size=${_size}&color=${_color}&initials=${encodeURI(_initials.replace(',', ' '))}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.onOrderUpdated()
            this.getTableOrder2()
            this.getTableOrder1()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    deleteOrder (_row, _positionId, _orderId) {
      // console.log('deleteOrder: ' + _row + ', ' + _positionId + ', ' + _orderId)

      this.$axios(`${_URLOrder}&func=Delete&row=${_row}&positionId=${_positionId}&orderId=${_orderId}`)
        .then((res) => {
          if (res.data === 'Success, requested action completed') {
            this.onOrderDeleted()
            this.getTableOrder2()
            this.getTableOrder1()
            this.editOrder = false
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
