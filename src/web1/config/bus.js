const install = function (Vue) {
    const bus = new Vue({
        data() {
            return {
                store: {
                    name: 2
                } // 使用pushWindow时把属性添加到store中
            }
        },
        created() {
            const str = localStorage.getItem('store')
            const obj = JSON.parse(str)
            if (obj)
                this.store = obj

            // if (JSON.stringify(this.store) !== '{}')
            //     localStorage.setItem('store', JSON.stringify(val))
        },
        watch: {
            store: {
                handler(val) {
                    localStorage.setItem('store', JSON.stringify(val))
                },
                deep: true
            }
        },
        methods: {
        }
    })
    Vue.prototype.$bus = bus
};
export default install