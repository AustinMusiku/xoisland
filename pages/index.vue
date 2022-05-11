<template>
    <div class="grid">
        <div class="grid__container">
            <div class="content-wrapper">
                <h1 class="super-heading">XO</h1>
                <ul class="menu">
                    <li class="menu__item">
                        <nuxt-link 
                            class="sub-heading"
                            to="/singleplayer">singleplayer
                        </nuxt-link>
                    </li>
                    <li class="menu__item">
                        <nuxt-link 
                            class="sub-heading"
                            to="/multiplayer">multiplayer
                        </nuxt-link>
                    </li>
                    <li class="menu__item">
                        <nuxt-link 
                            class="sub-heading"
                            to="/leaderboard">leaderboard
                        </nuxt-link>
                    </li>
                    <li class="menu__item">
                        <nuxt-link 
                            class="sub-heading"
                            to="/settings">settings
                        </nuxt-link>
                    </li>
                    <li class="menu__item">
                        <nuxt-link 
                            class="sub-heading"
                            to="/help">help
                        </nuxt-link>
                    </li>
                    <li class="menu__item">
                        <a href=""
                            class="sub-heading">github
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="scss" scoped>
    .content-wrapper{
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4em;
        align-items: center;
    }

    // mobile
    @media (max-width: 768px) {
        .content-wrapper{
            grid-template-columns: 1fr;
            gap: 1em;
            text-align: center;
        }
    }
</style>