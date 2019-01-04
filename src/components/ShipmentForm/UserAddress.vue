<template>
   <v-form ref="form" v-model="valid" lazy-validation>
      <v-layout row wrap>
        <v-flex xs12 md12 lg12 sm12 class="col-height-auto">
   
            
            <h2 class="px-3 py-4 mb-0">{{$t('message.billingDetails')}}</h2>
            <div>
              <v-layout row wrap>
                <v-flex xs12 sm12 md12 >
                  <v-text-field prepend-icon="perm_identity" :rules="nameRules" v-model="formQuote.contactName" label="Contact name" required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap>                   
                <v-flex xs12 sm12 md12>
                  <v-text-field prepend-icon="perm_identity" v-model="formQuote.companyName" label="Company name" required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12 md12 sm12>
                  <v-text-field prepend-icon="home" v-model="formQuote.address1" label="Address 1" required></v-text-field>
                </v-flex>
                <v-flex xs12 md12 sm12>
                  <v-text-field prepend-icon="home"  v-model="formQuote.address2" label="Address 2"></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12 sm6 md6>
                  <v-text-field prepend-icon="mail" label="Email" v-model="formQuote.email" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field prepend-icon="phone" label="Mobile No" v-model="formQuote.phone" required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12 sm4 md4>
                  <v-autocomplete
                    :items="countries"
                    item-text="name"
                    item-value="code"
                    label="Country"
                    v-model="formQuote.country"
                    prepend-icon="public"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 sm4 md4>
                  <v-text-field prepend-icon="location_city" v-model="formQuote.province" label="Province/State"></v-text-field>
                </v-flex>
                <v-flex xs12 sm4 md4>
                  <v-text-field prepend-icon="domain" v-model="formQuote.city" label="City"></v-text-field>
                </v-flex>
              </v-layout> 
                </div>
          
              
          </div>
        </v-flex>
      </v-layout>
    </v-form>
</template>

<script>
import firebase from 'firebase';
import Nprogress from 'nprogress';
import UserDetail from "Components/Widgets/UserDetail";
import Skills from "Components/Widgets/Skills";
import Education from "Components/Widgets/Education";
import ContactRequest from "Components/Widgets/ContactRequest";
import UserActivity from "Components/Widgets/UserActivity";
import {
    database
} from '../../firebase';
import { countriesList } from 'Constants/countriesList'

export default {
  components: {
    UserDetail,
    Skills,
    Education,
    ContactRequest,
    UserActivity
  },
  props: ['formQuote'],
  data() {
    return {
      nameRules: [
    v => !!v || 'This field is required'
    ],
    valid: true,
    countries: countriesList,
      loader: true,
      usersList: null,
      connectUsersList: null,
      uidUser: '',
      snackbar: false,
      snackbar2: false,
      y: "top",
      x: null,
      mode: "",
      mode2: "",
      timeout: 2000,
      text: "Profile updated!",
      color: ""
    };
  },
  mounted() {
    
    var style = {
    base: {
      color: '#32325d',
      lineHeight: '18px',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };

  console.log(this.formQuote);

    // let localUser = this.$store.getters.getUser.user;
    // console.log(typeof localUser);
    // if (typeof localUser !== 'object')
    // {
    //   if (JSON.parse(this.$store.getters.getUser).user) {
    //     this.$set(this,'uidUser',JSON.parse(this.$store.getters.getUser).user.uid);
    //   } else {
    //     this.$set(this,'uidUser',JSON.parse(this.$store.getters.getUser).uid);
    //   }
    // } else {
    //   if (this.$store.getters.getUser.user) {
    //     this.$set(this,'uidUser',this.$store.getters.getUser.user.uid);
    //   } else {
    //     this.$set(this,'uidUser',this.$store.getters.getUser.uid);
    //   }
    // }
    // database.ref(`/users/${this.uidUser}`).once('value')
    // .then((snapshot) => {
    //   console.log(snapshot.val());
    //   if (snapshot.val()) {
    //     this.$set(this,'formQuote',snapshot.val());
    // }})
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        console.log(this.formQuote);
        Nprogress.start();
        if (this.uidUser) {
          database.ref(`/users/${this.uidUser}`).set(this.formQuote)
          .then(() => {
            Nprogress.done();
            this.$set(this,'snackbar',true);
          })
        } else {
          Nprogress.done();
        }
      }
    },
    clear () {
      this.$refs.form.reset()
    }
  }
};

</script>
