<template>
   <v-list-tile class="sidebar-profile">
		<v-list-tile-avatar v-if="user.displayName">
			<img :src="user.photoURL" alt="avatar" height="40" width="40" class="img-responsive" />
		</v-list-tile-avatar>
		<v-list-tile-content class="ml-3">
			<template v-if="user.displayName">
				<v-list-tile-title><span>{{user.displayName}}</span></v-list-tile-title>
			</template>
			<template v-if="!user.displayName">
				<v-list-tile-title><span>{{user.email}}</span></v-list-tile-title>
			</template>
		</v-list-tile-content>
		<v-menu 
			bottom
			offset-y
			left
			content-class="userblock-dropdown" 
			nudge-top="-10"
			nudge-right="0"
			transition="slide-y-transition"
		>
			<v-btn dark icon slot="activator" class="ma-0">
					<v-icon>more_vert</v-icon>
			</v-btn>
			<div class="dropdown-content">
				<div class="dropdown-top white--text primary">
				   <span v-if="user.displayName" class="white--text fs-14 fw-bold d-block">{{user.displayName}}</span>
	               <span v-if="user.displayName" class="d-block fs-12 fw-light">{{user.email}}</span>
	               <span v-if="!user.displayName" class="white--text fs-14 fw-bold d-block">{{user.email}}</span>
				</div>
				<v-list class="dropdown-list">
					<template v-for="userLink in userLinks" v-if="userLink.id !== 4">
						<v-list-tile :to="getMenuLink(userLink.path)" :key="userLink.id">
							<i :class="userLink.icon"></i>
							<span>{{$t(userLink.title)}}</span>
						</v-list-tile>
					</template>
					<template v-else>
						<v-list-tile @click="logoutUser" :key="userLink.id">
							<i :class="userLink.icon"></i>
							<span>{{$t(userLink.title)}}</span>
						</v-list-tile>
					</template>
				</v-list>
			</div>
		</v-menu>
   </v-list-tile>
</template>

<script>
import { getCurrentAppLayout } from "Helpers/helpers";

export default {
	data() {
		return {
			user: '',
			userLinks: [
				{
					id: 1,
					title: 'message.userProfile',
					icon: 'ti-user mr-3 primary--text',
					path: '/users/user-profile'
				},
				{
					id: 2,
					title: 'message.inbox',
					icon: 'ti-email mr-3 success--text',
					path: '/inbox'
				},
				{
					id: 3,
					title: 'message.usersList',
					icon: 'ti-bell mr-3 info--text',
					path: '/users/users-list'
				},
				{
					id: 4,
					title: 'message.logOut',
					icon: 'ti-power-off mr-3 error--text'
				}
			]
		}
	},
	mounted() {
         if (JSON.parse(localStorage.getItem('user')).user) {
            this.$set(this,'user',JSON.parse(localStorage.getItem('user')).user);
         } else {
            this.$set(this,'user',JSON.parse(localStorage.getItem('user')));
         }
    },
  methods: {
    logoutUser() {
      this.$store.dispatch("logoutUserFromFirebase", this.$router);
	 },
	 getMenuLink(path) {
		 return '/' + getCurrentAppLayout(this.$router) +  path;
	 }
  }
};
</script>
