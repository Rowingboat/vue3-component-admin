<script>
import { createVNode } from 'vue';
import * as $Icon from '@ant-design/icons-vue';
export default {
    props: {
        icon: {
            type: String,
        },
    },
    setup(props) {
        return () => {
            return createVNode($Icon[props.icon ]);
        };
    },
};
</script>
