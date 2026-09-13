<template>
  <q-page>

    <!-- Download area (Titel) -->
    <div class="q-pa-md" style="max-width: 500px">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title class="text-overline">Downloads</q-toolbar-title>
      </q-toolbar>
    </div>

    <!-- List of Downloads -->
    <div class="q-pa-md bg-grey-10 text-white" style="max-width: 500px">
    <q-list dark bordered separator style="max-width: 470px">
      <q-item clickable v-ripple class="download-item">
        <q-item-section>
          <q-item-label class="overline">BGB-Beitritt</q-item-label>
        </q-item-section>

        <q-item-section side class="download-action">
          <q-btn
            class="bg-white text-primary download-button"
            icon="download"
            label="Download"
            type="a"
            :href="URLDownloadBGBBeitritt"
            target="_blank"
            download
          />
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple class="download-item">
        <q-item-section>
          <q-item-label class="overline">FG-Mitgliedsantrag</q-item-label>
        </q-item-section>

        <q-item-section side class="download-action">
          <q-btn
            class="bg-white text-primary download-button"
            icon="download"
            label="Download"
            type="a"
            :href="URLDownloadFGMitgliedsantrag"
            target="_blank"
            download
          />
        </q-item-section>
      </q-item>
    </q-list>
    </div>

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import { URLDownloadBGBBeitritt, URLDownloadFGMitgliedsantrag } from 'src/boot/utils.js'

export default {
  name: 'ListDownload',

  data () {
    return {
      URLDownloadBGBBeitritt,
      URLDownloadFGMitgliedsantrag
    }
  }
}
</script>

<style lang="scss">
.download-item {
  min-height: 72px;
}

.download-action {
  margin-left: 16px;
}

.download-button {
  border-radius: 4px;
}

.header-image {
  height: 100%;
  z-index: -1;
  opacity: 0.2;
  filter: grayscale(100%);
}
</style>
