<template>
    <div class="grid">
        <div class="grid__container">
            <div class="content-wrapper --two-sections">
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
    .menu__item{
        position: relative;
        width: fit-content;
        transition: .25s;

        &:hover{
            transform: translateX(10px);
        }
    }

    // mobile
    @media (max-width: 768px) {
        .menu__item{
            width: 100%;
        }
    }
</style>