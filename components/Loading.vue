<template>
    <div class="loading">
        <h1 class="loading__text heading">{{ comment }}</h1>
        <div class="loading__grid">
            <div class="bar horizontal horizontal-1"></div>
            <div class="bar horizontal horizontal-2"></div>
            <div class="bar vertical vertical-1"></div>
            <div class="bar vertical vertical-2"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref, watch, computed, onMounted } from '@nuxtjs/composition-api'
    import gsap from 'gsap';

    let props = defineProps<{
        comment: string,
        isLoading: boolean
    }>()

    // let isLoadingRef = ref<boolean>(props.isLoading);

    onMounted(() => {
        let bars = gsap.utils.toArray('.bar');
        let animateLoadingGrid = gsap.timeline({
            paused: true,
            repeat: -1
        })

        animateLoadingGrid
            .from(bars.slice(0,2), {
                duration: .5,
                scaleX: 0,
                transformOrigin: 'left center',
                opacity: 0,
                ease: 'power4.out',
                stagger: .2
            })
            .from(bars.slice(2), {
                duration: .5,
                scaleY: 0,
                transformOrigin: 'top center',
                opacity: 0,
                ease: 'power4.out',
                stagger: .2
            })

        animateLoadingGrid.play()

        watch(() => props.isLoading, () => {
            if(!props.isLoading) animateLoadingGrid.pause(1.4)
        });
    })
    
</script>

<style lang="scss" scoped>
    .loading{
        display: flex;
        flex-direction: column;
        gap: 2em;
        align-items: center;

        .loading__grid{
            position: relative;
            width: 90px;
            height: 90px;

            .bar{
                position: absolute;
                background-color: black;
                z-index: 5;
    
                &.vertical{
                    top: 0;
                    height: 100%;
                    width: .2em;
                    transform: translateX(-50%);
                }
    
                &.horizontal{
                    left: 0;
                    width: 100%;
                    height: .2em;
                    transform: translateY(-50%);
                }
    
                &.vertical-1{ left: 33.3333% }
                &.vertical-2{ left: 66.6666% }
    
                &.horizontal-1{ top: 33.3333% }
                &.horizontal-2{ top: 66.6666% }
            }
        }
    }
</style>