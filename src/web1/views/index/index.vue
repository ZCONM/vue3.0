<template>
    <div>
        <HelloWorld :msg="msg"></HelloWorld>
    </div>
</template>
<script>
import HelloWorld from '@/components/HelloWorld.vue'
export default {
    data() {
        return {
            msg:"测试"
        };
    },
    components: {
        HelloWorld
    },
    created() {
    },
    mounted() {
    },
    watch: {
    },
    computed: {
    },
    methods: {

    }
}
</script>