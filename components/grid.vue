<template>
    <div class="playSpace">
        <div class="bar horizontal horizontal-1"></div>
        <div class="bar horizontal horizontal-2"></div>
        <div class="bar vertical vertical-1"></div>
        <div class="bar vertical vertical-2"></div>
        <div class="playGrid">
            <input type="text" class="input-field" id="b1" onclick="fillField('b1');" readonly>
            <input type="text" class="input-field" id="b2" onclick="fillField('b2');" readonly>
            <input type="text" class="input-field" id="b3" onclick="fillField('b3');" readonly>
            <input type="text" class="input-field" id="b4" onclick="fillField('b4');" readonly>
            <input type="text" class="input-field" id="b5" onclick="fillField('b5');" readonly>
            <input type="text" class="input-field" id="b6" onclick="fillField('b6');" readonly>
            <input type="text" class="input-field" id="b7" onclick="fillField('b7');" readonly>
            <input type="text" class="input-field" id="b8" onclick="fillField('b8');" readonly>
            <input type="text" class="input-field" id="b9" onclick="fillField('b9');" readonly>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
    .playSpace{
        position: relative;
        height: 300px;
        width: 300px;

        .bar{
            position: absolute;
            background-color: black;
            z-index: 5;

            &.vertical{
                top: 0;
                height: 100%;
                width: .25em;
                transform: translateX(-50%);
            }

            &.horizontal{
                left: 0;
                width: 100%;
                height: .25em;
                transform: translateY(-50%);
            }

            &.vertical-1{ left: 33.3333% }
            &.vertical-2{ left: 66.6666% }

            &.horizontal-1{ top: 33.3333% }
            &.horizontal-2{ top: 66.6666% }
        }
        .playGrid{
            position: relative;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            // grid-template-rows: repeat(3, 1fr);
            width: 100%;
            height: 100%;
            
            .input-field {
                width: 100%;
                height: 100%;
                border: none;
                outline: none;
                font-size: 30px;
                text-align: center;
                background-color: transparent;
            }
            .input-field.winner{
                
            }
        }
    }
</style>