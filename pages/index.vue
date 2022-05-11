<template>
    <div class="grid">
        <div class="wrapper grid__container">
            <h1 class="section-heading">tic tac toe</h1>
            <ul class="menu">
                <li class="menu__item">
                    <nuxt-link to="/singleplayer">Singleplayer</nuxt-link>
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
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style>
</style>