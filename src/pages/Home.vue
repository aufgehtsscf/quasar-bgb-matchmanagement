<template>
  <q-page>
    <div class="q-pa-md" style="max-width: 500px">
      <div class="q-px-lg q-pt-xl q-mb-md">
        <div class="text-h6">Die App zur Spieltagsplanung für deinen SCF</div>
      </div>
    </div>

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image2 absolute-top"/>
  </q-page>
</template>

<script>

export default {
  name: 'HomePage',

  setup () {
    return {
    }
  },

  data () {
    return {
    }
  },

  computed: {
  },

  methods: {
  }
}
</script>

<style lang="scss">
.header-image2 {
  height: 100%;
  z-index: -1;
  opacity: 0.7;
  filter: grayscale(40%);
}
</style>
