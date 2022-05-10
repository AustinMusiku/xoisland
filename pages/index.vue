<template>
    <ul class="menu">
        <li class="menu__item">
            <nuxt-link to="/singleplayer">SinglePlayer</nuxt-link>
        </li>
        <li class="menu__item">
            <nuxt-link to="/multiplayer">Multiplayer</nuxt-link>
        </li>
        <li class="menu__item">
            <nuxt-link to="/leaderboard">Leaderboard</nuxt-link>
        </li>
        <li class="menu__item">
            <nuxt-link to="/settings">Settings</nuxt-link>
        </li>
        <li class="menu__item">
            <nuxt-link to="/help">Help</nuxt-link>
        </li>
        <li class="menu__item">
            <a href="">Github</a>
        </li>
    </ul>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>