<template>
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
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
    .playGrid{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        width: fit-content;
        max-width: 400px;

        .input-field {
            width: 110px;
            height: 110px;
            border: none;
            outline: none;
            font-size: 30px;
            text-align: center;
        }
        .input-field.winner{
            
        }
    }
</style>