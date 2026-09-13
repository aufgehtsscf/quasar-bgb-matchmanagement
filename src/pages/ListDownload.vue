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
      <q-item clickable v-ripple class="download-item download-item-first">
        <q-item-section>
          <q-item-label class="overline">BGB-Beitritt</q-item-label>
        </q-item-section>

        <q-item-section class="download-qr-column">
          <img
            :src="URLDownloadBGBBeitrittSVG"
            alt="QR-Code BGB-Beitritt"
            class="download-qr-image"
          />
          <a
            :href="URLDownloadBGBBeitritt"
            target="_blank"
            download
            class="download-url"
          >
            planthegame.ch/downloads/BGB-Beitritt.pdf
          </a>
        </q-item-section>
      </q-item>

      <div class="download-separator" aria-hidden="true"></div>

      <q-item clickable v-ripple class="download-item download-item-second">
        <q-item-section>
          <q-item-label class="overline">FG-Mitgliedsantrag</q-item-label>
        </q-item-section>

        <q-item-section class="download-qr-column">
          <img
            :src="URLDownloadFGMitgliedsantragSVG"
            alt="QR-Code FG-Mitgliedsantrag"
            class="download-qr-image"
          />
          <a
            :href="URLDownloadFGMitgliedsantrag"
            target="_blank"
            download
            class="download-url"
          >
            planthegame.ch/downloads/FG-Mitgliedsantrag.pdf
          </a>
        </q-item-section>
      </q-item>
    </q-list>
    </div>

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image absolute-top" />
  </q-page>
</template>

<script>
import {
  URLDownloadBGBBeitritt,
  URLDownloadBGBBeitrittSVG,
  URLDownloadFGMitgliedsantrag,
  URLDownloadFGMitgliedsantragSVG
} from 'src/boot/utils.js'

export default {
  name: 'ListDownload',

  data () {
    return {
      URLDownloadBGBBeitritt,
      URLDownloadBGBBeitrittSVG,
      URLDownloadFGMitgliedsantrag,
      URLDownloadFGMitgliedsantragSVG
    }
  }
}
</script>

<style lang="scss">
.download-item {
  min-height: 84px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.22);
}

.download-item-first {
  border-top: 1px solid rgba(255, 255, 255, 0.22);
}

.download-item-second {
  border-bottom: 1px solid rgba(255, 255, 255, 0.22);
}

.download-separator {
  height: 200px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.03),
    rgba(255, 255, 255, 0.01)
  );
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.download-qr-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 84px;
  margin-left: 8px;
  margin-right: 8px;
}

.download-qr-image {
  display: block;
  width: 124px;
  height: 124px;
  object-fit: contain;
  background: white;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 0;
}

.download-url {
  margin-top: 8px;
  color: #ffffff;
  font-size: 10px;
  line-height: 1.2;
  text-align: center;
  word-break: break-all;
}

.header-image {
  height: 100%;
  z-index: -1;
  opacity: 0.2;
  filter: grayscale(100%);
}
</style>
