<template>
  <q-page>
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card" flat bordered>
        <q-card-section horizontal>
          <q-card-section class="q-pt-xs">
            <div class="text-overline">Plan the Game</div>
            <div class="text-h5 q-mt-sm q-mb-xs">Die App zur Spieltagsplanung für deinen SCF</div>
            <div class="text-caption text-grey">
              Spieltag einfach und effizient planen.
            </div>
          </q-card-section>

          <q-card-section class="col-5 flex flex-center">
            <q-img
              class="rounded-borders"
              src="statics/images/Home.png"
            />
          </q-card-section>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center">
          <q-btn class="glossy" rounded color="red" label="Jetzt starten" />
        </q-card-actions>
      </q-card>
    </div>

    <div class="q-pa-md q-gutter-sm">
    <q-carousel
      animated
      v-model="slide"
      infinite
    >
      <q-carousel-slide name="soft-jazz">
        <q-video
          class="absolute-full"
          src="https://www.youtube.com/embed/k3_tw44QsZQ"
        />
      </q-carousel-slide>

      <q-carousel-slide name="Rihanna">
        <q-video
          class="absolute-full"
          src="https://www.youtube.com/embed/kOkQ4T5WO9E"
        />
      </q-carousel-slide>

      <q-carousel-slide name="ibiza">
        <q-video
          class="absolute-full"
          src="https://www.youtube.com/embed/p87miJIYEEk"
        />
      </q-carousel-slide>
    </q-carousel>

    <div class="row justify-center">
      <q-btn-toggle
        glossy
        rounded
        color="red"
        v-model="slide"
        :options="[
          { label: 'Soft Jazz', value: 'soft-jazz' },
          { label: 'Rihanna', value: 'Rihanna' },
          { label: 'Ibiza Mix', value: 'ibiza' }
        ]"
      />
    </div>
  </div>

  <div class="q-pa-md row items-start q-gutter-md">
    <q-card
        class="my-card text-white"
        style="background: radial-gradient(circle, #7e0210 0%, #59000b 100%)">

      <q-card-section>
        <div class="text-h6 q-mb-xs">Auf geht's SCF</div>
        <div class="text-subtitle2">Plan the game</div>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle2">Lieber SCF-Fan</div>
      </q-card-section>

        <q-card-section class="q-pt-none">
        {{ bodyText }}
      </q-card-section>

      <img src="statics/images/AufGehtsSCF2.png">

      <q-card-section>
        <div class="text-subtitle2">Was kann diese App?</div>
      </q-card-section>

      <q-list>
        <q-item>
          <q-item-section avatar>
            <q-icon color="yellow" name="emoji_people" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-subtitle2">Teilnehmer verwalten</q-item-label>
            <q-item-label>Hier kannst du dich für ein bestimmtes Spiel eintragen. Du kannst angeben, ob du dabei bist oder ob du ein Ticket brauchst/freigibst. Du hast stets den Überblick über die aktuellen Spiele.</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon color="blue" name="sports_volleyball" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-subtitle2">Spiele verwalten</q-item-label>
            <q-item-label>Hier kannst du ein bereits terminierten Spiel erfassen und publizieren. Heim- und Auswärtsspiele können erfasst werden.</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon color="red" name="person" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-subtitle2">Mitglieder verwalten</q-item-label>
            <q-item-label>Hier kannst du als Mitglied eintragen. Es stehen dir jede Menge coole Avatare zur Verfügung.</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon color="green" name="credit_card" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-subtitle2">Karten verwalten. Wer hat meine Karte?</q-item-label>
            <q-item-label>Hier kannst du angeben, wer aktuell deine Karte hat. Diese Information fließt in die Spielübersicht ein.</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon color="teal" name="add" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-subtitle2">... und vieles mehr</q-item-label>
            <q-item-label>Wer ist der Heimspielkönig? Welches Spiel wurde am meisten besucht? Diese und andere Statistiken sind jederzeit sichtbar.</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator />

      <q-card-actions class="text-white" align="right">
        <q-btn label="Ok" v-close-popup />
      </q-card-actions>

      </q-card>
    </div>

    <q-img src="statics/images/AufGehtsSCF.png" class="header-image2 absolute-top"/>
  </q-page>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'HomePage',

  setup () {
    return {
      slide: ref('Rihanna')
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

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
