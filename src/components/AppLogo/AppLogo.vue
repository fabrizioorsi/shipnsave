<template>
    <div class="site-logo">
        <router-link to="/">
            <img :src="darkLogo" alt="site logo" width="200" height="40" v-if="sidebarSelectedFilter.class == 'sidebar-overlay-light'">
            <img :src="appLogo" alt="site logo" width="200" height="40" v-else>
        </router-link>
    </div>
</template>

<script>
import AppConfig from "Constants/AppConfig";
import { mapGetters } from "vuex";

export default {
   computed: {
      ...mapGetters(["sidebarSelectedFilter"])
   },
   data() {
      return {
          appLogo: AppConfig.appLogo,
          darkLogo: AppConfig.darkLogo
      }
   }
}
</script>
