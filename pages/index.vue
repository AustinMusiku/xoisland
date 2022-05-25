<template>
    <div class="grid">
        <div class="grid__container">
            <div class="content-wrapper --two-sections">
                <h1 class="super-heading">XO</h1>
                <ul class="menu">
                    
                    <li class="menu__item">
                        <nuxt-link 
                            class="heading"
                            to="/multiplayer">play
                        </nuxt-link>
                    </li>
                    <li class="menu__item">
                        <nuxt-link 
                            class="heading"
                            to="/leaderboard">leaderboard
                        </nuxt-link>
                    </li>
                    <li class="menu__item">
                        <nuxt-link 
                            class="heading"
                            to="/help">help
                        </nuxt-link>
                    </li>
                    <li class="menu__item">
                        <a 
                            href="https://github.com/AustinMusiku/tictactoe"
                            target="_blank"
                            class="heading">github
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