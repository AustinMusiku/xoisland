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
    .playsPace{
        position: relative;

        .bar{
            position: absolute;
            background-color: black;

            .vertical{
                height: 100%
                width: .25em
            }

            .horizontal{
                width: 100%
                height: .25em
            }

            .verical-1{
                top: 0;
                left: 100px
            }
        }
        .playGrid{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            // gap: .25em;
            width: fit-content;
            max-width: 400px;

            .input-field {
                width: 6.25rem;
                height: 6.25rem;
                border: none;
                outline: none;
                font-size: 30px;
                text-align: center;
            }
            .input-field.winner{
                
            }
        }
    }
</style>